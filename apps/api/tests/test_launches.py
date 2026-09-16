from __future__ import annotations

import asyncio
from collections.abc import Coroutine
from datetime import datetime
from typing import Any

import httpx
from fastapi.testclient import TestClient

from app.api import launches as launch_routes
from app.launches import (
    FixtureLaunchProvider,
    LaunchProvider,
    LaunchService,
    ProviderLaunch,
    normalize_launch,
    normalize_status,
    provider_for_mode,
)
from app.main import create_app


def run_async[T](value: Coroutine[Any, Any, T]) -> T:
    return asyncio.run(value)


def provider_launch(
    launch_id: str,
    *,
    name: str = "Falcon 9 | Test Mission",
    net: str | None = "2030-01-01T12:00:00Z",
    status_id: int | None = 1,
    pad_name: str = "Space Launch Complex 40",
    location_name: str = "Cape Canaveral SFS, FL, USA",
    mission: dict[str, Any] | None = None,
) -> ProviderLaunch:
    status = {"id": status_id, "name": "Provider status"} if status_id is not None else None
    payload: dict[str, Any] = {
        "id": launch_id,
        "name": name,
        "net": net,
        "status": status,
        "launch_service_provider": {"name": "SpaceX", "abbrev": "SpX"},
        "rocket": {"configuration": {"name": "Falcon 9", "full_name": "Falcon 9 Block 5"}},
        "mission": mission,
        "pad": {
            "name": pad_name,
            "latitude": 28.561941,
            "longitude": -80.577357,
            "location": {"name": location_name},
        },
        "last_updated": "2029-12-01T12:00:00Z",
    }
    return ProviderLaunch.model_validate(payload)


class FakeProvider:
    def __init__(self, launches: list[ProviderLaunch]) -> None:
        self.launches = launches
        self.calls = 0

    async def get_upcoming_launches(self) -> list[ProviderLaunch]:
        self.calls += 1
        return self.launches

    async def get_launch(self, provider_id: str) -> ProviderLaunch | None:
        return next((launch for launch in self.launches if launch.id == provider_id), None)


class FailingAfterFirstProvider(FakeProvider):
    async def get_upcoming_launches(self) -> list[ProviderLaunch]:
        self.calls += 1
        if self.calls > 1:
            raise httpx.TimeoutException("provider timed out")
        return self.launches


def service(provider: LaunchProvider, ttl_seconds: int = 0) -> LaunchService:
    return LaunchService(
        provider,
        {
            "SLC-40",
            "SLC-41",
            "LC-39A",
            "LC-39B",
            "Space Launch Complex 40",
            "Space Launch Complex 41",
        },
        ttl_seconds,
        "launch_library_2",
    )


def test_normalize_status_maps_known_and_unknown_values() -> None:
    assert normalize_status({"id": 1}) == "scheduled"
    assert normalize_status({"id": 2}) == "go"
    assert normalize_status({"id": 999}) == "unknown"
    assert normalize_status({"id": "1"}) == "unknown"
    assert normalize_status(None) == "unknown"


def test_normalize_launch_preserves_missing_optional_fields_as_null() -> None:
    launch = normalize_launch(
        provider_launch("missing-fields", net=None, status_id=None, mission=None),
        "launch_library_2",
    )

    assert launch.net is None
    assert launch.mission is None
    assert launch.status == "unknown"
    assert launch.image_url is None
    assert launch.webcast_url is None


def test_upcoming_filters_to_configured_space_coast_pads() -> None:
    provider = FakeProvider(
        [
            provider_launch("space-coast"),
            provider_launch(
                "non-florida",
                pad_name="Launch Complex 1A",
                location_name="Mahia, New Zealand",
            ),
        ]
    )

    launches, stale, _updated = run_async(service(provider).upcoming())

    assert stale is False
    assert [launch.provider_launch_id for launch in launches] == ["space-coast"]


def test_upcoming_sorts_by_net_and_deduplicates_provider_ids() -> None:
    provider = FakeProvider(
        [
            provider_launch("duplicate", net="2030-03-01T12:00:00Z"),
            provider_launch("earliest", net="2030-01-01T12:00:00Z"),
            provider_launch("duplicate", net="2030-02-01T12:00:00Z"),
            provider_launch("unknown-time", net=None),
        ]
    )

    launches, _stale, _updated = run_async(service(provider).upcoming())

    assert [launch.provider_launch_id for launch in launches] == [
        "earliest",
        "duplicate",
        "unknown-time",
    ]


def test_provider_failure_returns_stale_cached_launches() -> None:
    provider = FailingAfterFirstProvider([provider_launch("space-coast")])
    launch_service = service(provider)

    first_launches, first_stale, first_updated = run_async(launch_service.upcoming())
    second_launches, second_stale, second_updated = run_async(
        launch_service.upcoming(force_refresh=True)
    )

    assert first_stale is False
    assert second_stale is True
    assert second_launches == first_launches
    assert second_updated == first_updated


def test_next_returns_first_future_or_unknown_time_launch() -> None:
    provider = FakeProvider(
        [
            provider_launch("past", net="2020-01-01T12:00:00Z"),
            provider_launch("future", net="2030-01-01T12:00:00Z"),
            provider_launch("unknown-time", net=None),
        ]
    )

    launch, stale, _updated = run_async(service(provider).next())

    assert stale is False
    assert launch is not None
    assert launch.provider_launch_id == "future"


def test_get_returns_none_for_non_space_coast_detail() -> None:
    provider = FakeProvider(
        [
            provider_launch(
                "non-florida",
                pad_name="Launch Complex 1A",
                location_name="Mahia, New Zealand",
            )
        ]
    )

    launch = run_async(service(provider).get("non-florida"))

    assert launch is None


def test_fixture_mode_is_local_safe_and_filters_to_space_coast() -> None:
    provider = provider_for_mode("fixture", "https://example.test")
    assert isinstance(provider, FixtureLaunchProvider)

    launches, stale, _updated = run_async(service(provider).upcoming())

    assert stale is False
    assert len(launches) == 2
    assert all(
        "Cape Canaveral" in str((launch.pad or {}).get("location_name")) for launch in launches
    )


def test_public_launches_route_uses_fixture_mode_by_default() -> None:
    launch_routes._service = None
    try:
        client = TestClient(create_app())

        response = client.get("/api/v1/public/launches/next")

        assert response.status_code == 200
        payload = response.json()
        assert payload["data"]["provider_launch_id"] == "fixture-falcon-9-space-coast"
        assert payload["data_freshness"] == "fresh"
        assert datetime.fromisoformat(payload["last_updated_at"]) is not None
    finally:
        launch_routes._service = None
