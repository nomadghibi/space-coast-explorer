from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.analytics import router as analytics_router
from app.api.auth import router as auth_router
from app.api.cms import router as cms_router
from app.api.health import router as health_router
from app.api.launches import router as launches_router
from app.api.public import router as public_router
from app.core.config import get_settings
from app.core.limiter import limiter
from app.core.logging import configure_logging
from app.core.request_id import RequestIdMiddleware


def create_app() -> FastAPI:
    configure_logging()
    settings = get_settings()
    app = FastAPI(title="Space Coast Explorer API", version="0.1.0")
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore[arg-type]
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
    app.add_middleware(SlowAPIMiddleware)
    app.add_middleware(RequestIdMiddleware)
    app.include_router(health_router)
    app.include_router(auth_router)
    app.include_router(analytics_router)
    app.include_router(public_router)
    app.include_router(launches_router)
    app.include_router(cms_router)
    return app


app = create_app()
