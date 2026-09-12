from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.public import router as public_router
from app.core.logging import configure_logging
from app.core.request_id import RequestIdMiddleware


def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(title="Space Coast Explorer API", version="0.1.0")
    app.add_middleware(RequestIdMiddleware)
    app.include_router(health_router)
    app.include_router(public_router)
    return app


app = create_app()
