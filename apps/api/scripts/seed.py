"""Seed production analytics records: organization, destination, tour."""

import os
import uuid
from datetime import datetime, timezone

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from app.db.models import Destination, Organization, Tour


def main() -> None:
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise SystemExit("DATABASE_URL not set")

    engine = create_engine(database_url, echo=False)

    with Session(engine) as session:
        # Organization
        org = session.scalar(select(Organization).where(Organization.slug == "space-coast-explorer"))
        if not org:
            org = Organization(
                id=uuid.uuid4(),
                name="Space Coast Explorer",
                slug="space-coast-explorer",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            session.add(org)
            session.flush()
            print(f"Created organization: {org.id}")
        else:
            print(f"Existing organization: {org.id}")

        # Destination — cocoa-village
        dest = session.scalar(
            select(Destination).where(Destination.slug == "cocoa-village")
        )
        if not dest:
            dest = Destination(
                id=uuid.uuid4(),
                organization_id=org.id,
                name="Cocoa Village",
                slug="cocoa-village",
                summary="Historic downtown walking district on Florida's Space Coast.",
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            session.add(dest)
            session.flush()
            print(f"Created destination: {dest.id}")
        else:
            print(f"Existing destination: {dest.id}")

        # Tour — cocoa-village-historic-explorer
        tour = session.scalar(
            select(Tour).where(Tour.slug == "cocoa-village-historic-explorer")
        )
        if not tour:
            tour = Tour(
                id=uuid.uuid4(),
                destination_id=dest.id,
                slug="cocoa-village-historic-explorer",
                title="Cocoa Village Historic Explorer",
                summary="A compact historical landmark walk through Cocoa Village.",
                editorial_status="published",
                published_at=datetime.now(timezone.utc),
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            session.add(tour)
            session.flush()
            print(f"Created tour: {tour.id}")
        else:
            print(f"Existing tour: {tour.id}")

        dest_id = dest.id
        tour_id = tour.id
        session.commit()

    print()
    print("=== Vercel env vars ===")
    print(f"NEXT_PUBLIC_ANALYTICS_DESTINATION_ID={dest_id}")
    print(f"NEXT_PUBLIC_ANALYTICS_TOUR_ID={tour_id}")
    print("NEXT_PUBLIC_ANALYTICS_API_ENABLED=true")


if __name__ == "__main__":
    main()
