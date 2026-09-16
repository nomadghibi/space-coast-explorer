"""Create or reset a CMS admin user. Run once after migration 0008."""

import os
import sys
import uuid
from datetime import datetime, timezone

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from app.core.auth import hash_password
from app.db.models import CmsUser


def main() -> None:
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise SystemExit("DATABASE_URL not set")

    email = os.environ.get("ADMIN_EMAIL")
    password = os.environ.get("ADMIN_PASSWORD")

    if not email or not password:
        raise SystemExit("ADMIN_EMAIL and ADMIN_PASSWORD must be set")

    if len(password) < 12:
        raise SystemExit("ADMIN_PASSWORD must be at least 12 characters")

    engine = create_engine(database_url, echo=False)

    with Session(engine) as session:
        existing = session.scalar(select(CmsUser).where(CmsUser.email == email))
        if existing:
            existing.hashed_password = hash_password(password)
            existing.is_active = True
            existing.updated_at = datetime.now(timezone.utc)
            session.commit()
            print(f"Updated password for existing admin: {email}")
        else:
            user = CmsUser(
                id=uuid.uuid4(),
                email=email,
                hashed_password=hash_password(password),
                role="admin",
                is_active=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            session.add(user)
            session.commit()
            print(f"Created admin user: {email}")

    print("Done. Login via POST /api/v1/auth/login")


if __name__ == "__main__":
    main()
