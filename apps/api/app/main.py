from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analytics import router as analytics_router
from app.api.cms import router as cms_router
from app.api.health import router as health_router
from app.api.launches import router as launches_router
from app.api.public import router as public_router
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.core.request_id import RequestIdMiddleware


def create_app() -> FastAPI:
    configure_logging()
    settings = get_settings()
    app = FastAPI(title="Space Coast Explorer API", version="0.1.0")
    allowed_origins = [
        origin.strip() for origin in settings.cors_allowed_origins.split(",") if origin.strip()
    ]
    if allowed_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=allowed_origins,
            allow_credentials=False,
            allow_methods=["GET", "POST", "OPTIONS"],
            allow_headers=["*"],
        )
    app.add_middleware(RequestIdMiddleware)
    app.include_router(health_router)
    app.include_router(analytics_router)
    app.include_router(public_router)
    app.include_router(launches_router)
    app.include_router(cms_router)
    return app


app = create_app()
