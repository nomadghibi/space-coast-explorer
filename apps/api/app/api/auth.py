import logging

from fastapi import APIRouter, Depends, HTTPException

logger = logging.getLogger(__name__)
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.auth import create_access_token, verify_password
from app.db.models import CmsUser
from app.db.session import get_session

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, session: Session = Depends(get_session)) -> TokenResponse:
    try:
        user = session.scalar(select(CmsUser).where(CmsUser.email == body.email))
        if not user or not user.is_active or not verify_password(body.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return TokenResponse(access_token=create_access_token(user.id, user.role))
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Login error: %s", exc)
        raise HTTPException(status_code=500, detail=f"Login error: {type(exc).__name__}: {exc}") from exc
