from datetime import UTC, datetime
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.models import Tour
from app.db.session import get_session

router = APIRouter(prefix="/api/v1/cms", tags=["cms"])


def require_admin(x_cms_token: str | None = Header(default=None)) -> None:
    expected = get_settings().cms_admin_token
    if not expected or x_cms_token != expected:
        raise HTTPException(status_code=401, detail="CMS authentication required")


class TourUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=240)
    summary: str | None = None
    editorial_status: str | None = Field(
        default=None, pattern="^(draft|in_review|published|archived)$"
    )


class TourRecord(BaseModel):
    id: UUID
    slug: str
    title: str
    summary: str
    editorial_status: str
    published_at: datetime | None


def record(tour: Tour) -> TourRecord:
    return TourRecord.model_validate(tour, from_attributes=True)


@router.get("/tours", response_model=list[TourRecord], dependencies=[Depends(require_admin)])
def list_cms_tours(session: Session = Depends(get_session)) -> list[TourRecord]:  # noqa: B008
    tours = session.scalars(select(Tour).order_by(Tour.updated_at.desc())).all()
    return [record(tour) for tour in tours]


@router.patch("/tours/{tour_id}", response_model=TourRecord, dependencies=[Depends(require_admin)])
def update_cms_tour(
    tour_id: UUID, payload: TourUpdate, session: Session = Depends(get_session)  # noqa: B008
) -> TourRecord:
    tour = session.get(Tour, tour_id)
    if tour is None:
        raise HTTPException(status_code=404, detail="Tour not found")
    changes = payload.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(tour, field, value)
    if payload.editorial_status == "published":
        tour.published_at = datetime.now(UTC)
    elif payload.editorial_status is not None and payload.editorial_status != "published":
        tour.published_at = None
    session.commit()
    session.refresh(tour)
    return record(tour)
