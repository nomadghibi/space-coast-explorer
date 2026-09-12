from fastapi.testclient import TestClient

from app.main import create_app


def test_health_returns_request_id() -> None:
    client = TestClient(create_app())
    response = client.get("/health", headers={"x-request-id": "test-request"})
    assert response.status_code == 200
    assert response.headers["x-request-id"] == "test-request"
    assert response.json() == {"status": "ok", "service": "api", "request_id": "test-request"}
