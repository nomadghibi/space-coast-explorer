from fastapi.testclient import TestClient

from app.main import create_app


def test_public_tours_include_pilot() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/public/tours")

    assert response.status_code == 200
    tours = response.json()
    assert len(tours) == 3
    assert tours[0]["slug"] == "cocoa-village-historic-explorer"


def test_missing_public_destination_returns_404() -> None:
    client = TestClient(create_app())

    response = client.get("/api/v1/public/destinations/not-real")

    assert response.status_code == 404
