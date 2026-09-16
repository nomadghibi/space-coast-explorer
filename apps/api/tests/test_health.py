from fastapi.testclient import TestClient
from pytest import MonkeyPatch

from app.core.config import get_settings
from app.main import create_app


def test_health_returns_request_id() -> None:
    client = TestClient(create_app())
    response = client.get("/health", headers={"x-request-id": "test-request"})
    assert response.status_code == 200
    assert response.headers["x-request-id"] == "test-request"
    assert response.json() == {"status": "ok", "service": "api", "request_id": "test-request"}


def test_configured_cors_origin_is_allowed(monkeypatch: MonkeyPatch) -> None:
    get_settings.cache_clear()
    monkeypatch.setenv("CORS_ALLOWED_ORIGINS", "https://space-coast-explorer.vercel.app")
    client = TestClient(create_app())

    response = client.options(
        "/health",
        headers={
            "origin": "https://space-coast-explorer.vercel.app",
            "access-control-request-method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == (
        "https://space-coast-explorer.vercel.app"
    )
    get_settings.cache_clear()
