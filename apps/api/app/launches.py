from __future__ import annotations

import re
from datetime import UTC, datetime
from enum import StrEnum
from typing import Any, Protocol

import httpx
from pydantic import BaseModel, ConfigDict, Field


class LaunchDataMode(StrEnum):
    FIXTURE = "fixture"
    DEVELOPMENT_PROVIDER = "development-provider"
    PRODUCTION = "production"


class Launch(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    provider_source: str
    provider_launch_id: str
    name: str
    slug: str
    launch_provider: dict[str, str | None]
    rocket: dict[str, str | None] | None = None
    mission: dict[str, str | None] | None = None
    pad: dict[str, str | float | None] | None = None
    status: str
    net: datetime | None = None
    window_start: datetime | None = None
    window_end: datetime | None = None
    image_url: str | None = None
    webcast_url: str | None = None
    last_updated_at: datetime | None = None


class ProviderLaunch(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    name: str = "Unnamed launch"
    slug: str = ""
    net: datetime | None = None
    window_start: datetime | None = None
    window_end: datetime | None = None
    status: dict[str, Any] | None = None
    launch_service_provider: dict[str, Any] | None = None
    rocket: dict[str, Any] | None = None
    mission: dict[str, Any] | None = None
    pad: dict[str, Any] | None = None
    image: str | None = None
    webcast_live: bool | None = None
    vid_urls: list[str] = Field(default_factory=list)
    last_updated: datetime | None = None


class LaunchProvider(Protocol):
    async def get_upcoming_launches(self) -> list[ProviderLaunch]: ...

    async def get_launch(self, provider_id: str) -> ProviderLaunch | None: ...


STATUS_MAP = {
    1: "scheduled",
    2: "go",
    3: "hold",
    4: "delayed",
    5: "scrubbed",
    6: "launched",
    7: "success",
    8: "failure",
}


def normalize_status(status: dict[str, Any] | None) -> str:
    value = status or {}
    status_id = value.get("id")
    return STATUS_MAP.get(status_id, "unknown") if isinstance(status_id, int) else "unknown"


def _slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def normalize_launch(item: ProviderLaunch, source: str) -> Launch:
    provider = item.launch_service_provider or {}
    rocket_config = (item.rocket or {}).get("configuration") or {}
    mission = item.mission
    pad = item.pad
    location = (pad or {}).get("location") or {}
    return Launch(
        id=f"{source}:{item.id}",
        provider_source=source,
        provider_launch_id=item.id,
        name=item.name,
        slug=item.slug or _slugify(item.name),
        launch_provider={
            "name": provider.get("name"),
            "abbreviation": provider.get("abbrev"),
        },
        rocket={
            "name": rocket_config.get("name"),
            "full_name": rocket_config.get("full_name"),
            "image_url": rocket_config.get("image_url"),
        }
        if rocket_config
        else None,
        mission={
            "name": mission.get("name"),
            "description": mission.get("description"),
            "type": mission.get("type"),
            "orbit": (mission.get("orbit") or {}).get("name"),
        }
        if mission
        else None,
        pad={
            "name": pad.get("name"),
            "location_name": location.get("name"),
            "latitude": pad.get("latitude"),
            "longitude": pad.get("longitude"),
        }
        if pad
        else None,
        status=normalize_status(item.status),
        net=item.net,
        window_start=item.window_start,
        window_end=item.window_end,
        image_url=item.image,
        webcast_url=item.vid_urls[0] if item.vid_urls else None,
        last_updated_at=item.last_updated,
    )


class LaunchLibrary2Provider:
    def __init__(self, base_url: str, timeout_seconds: float = 10.0) -> None:
        self.base_url = base_url.rstrip("/") + "/2.3.0"
        self.timeout_seconds = timeout_seconds

    async def _request(self, path: str) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.get(
                f"{self.base_url}/{path.lstrip('/')}",
                params={"limit": 100, "ordering": "net"},
            )
            response.raise_for_status()
            payload = response.json()
            if not isinstance(payload, dict) or not isinstance(payload.get("results"), list):
                raise ValueError("Invalid Launch Library response")
            return payload

    async def get_upcoming_launches(self) -> list[ProviderLaunch]:
        payload = await self._request("launches/")
        return [ProviderLaunch.model_validate(item) for item in payload["results"]]

    async def get_launch(self, provider_id: str) -> ProviderLaunch | None:
        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.get(f"{self.base_url}/launch/{provider_id}/")
            if response.status_code == 404:
                return None
            response.raise_for_status()
            return ProviderLaunch.model_validate(response.json())


FIXTURE_LAUNCHES: list[dict[str, Any]] = [
    {
        "id": "fixture-falcon-9-space-coast",
        "name": "Falcon 9 | Space Coast Explorer Fixture Mission",
        "slug": "falcon-9-space-coast-explorer-fixture-mission",
        "net": "2030-01-15T02:17:00Z",
        "window_start": "2030-01-15T01:55:00Z",
        "window_end": "2030-01-15T03:35:00Z",
        "status": {"id": 1, "name": "To Be Confirmed"},
        "launch_service_provider": {"name": "SpaceX", "abbrev": "SpX"},
        "rocket": {
            "configuration": {
                "name": "Falcon 9",
                "full_name": "Falcon 9 Block 5",
                "image_url": None,
            }
        },
        "mission": {
            "name": "Space Coast Explorer Fixture Mission",
            "description": "Deterministic fixture data for local launch UI development.",
            "type": "Communications",
            "orbit": {"name": "Low Earth Orbit"},
        },
        "pad": {
            "name": "Space Launch Complex 40",
            "latitude": 28.561941,
            "longitude": -80.577357,
            "location": {"name": "Cape Canaveral SFS, FL, USA"},
        },
        "image": None,
        "vid_urls": ["https://www.youtube.com/watch?v=fixture"],
        "last_updated": "2029-12-20T16:00:00Z",
    },
    {
        "id": "fixture-atlas-v-space-coast",
        "name": "Atlas V | Cape Fixture Payload",
        "slug": "atlas-v-cape-fixture-payload",
        "net": "2030-02-04T19:30:00Z",
        "status": {"id": 2, "name": "Go"},
        "launch_service_provider": {"name": "United Launch Alliance", "abbrev": "ULA"},
        "rocket": {"configuration": {"name": "Atlas V", "full_name": "Atlas V 551"}},
        "mission": None,
        "pad": {
            "name": "Space Launch Complex 41",
            "latitude": 28.583,
            "longitude": -80.583,
            "location": {"name": "Cape Canaveral SFS, FL, USA"},
        },
        "image": None,
        "vid_urls": [],
        "last_updated": "2029-12-21T16:00:00Z",
    },
    {
        "id": "fixture-non-florida",
        "name": "Electron | Non Florida Fixture",
        "slug": "electron-non-florida-fixture",
        "net": "2030-01-20T12:00:00Z",
        "status": {"id": 4, "name": "Delayed"},
        "launch_service_provider": {"name": "Rocket Lab", "abbrev": "RL"},
        "pad": {"name": "Launch Complex 1A", "location": {"name": "Mahia, New Zealand"}},
        "last_updated": "2029-12-20T16:00:00Z",
    },
]


class FixtureLaunchProvider:
    def __init__(self, launches: list[dict[str, Any]] | None = None) -> None:
        self.launches = launches or FIXTURE_LAUNCHES

    async def get_upcoming_launches(self) -> list[ProviderLaunch]:
        return [ProviderLaunch.model_validate(item) for item in self.launches]

    async def get_launch(self, provider_id: str) -> ProviderLaunch | None:
        for item in self.launches:
            if item.get("id") == provider_id:
                return ProviderLaunch.model_validate(item)
        return None


class LaunchService:
    def __init__(
        self,
        provider: LaunchProvider,
        accepted_pads: set[str],
        ttl_seconds: int,
        provider_source: str,
    ) -> None:
        self.provider = provider
        self.accepted_pads = {value.strip().lower() for value in accepted_pads if value.strip()}
        self.ttl_seconds = ttl_seconds
        self.provider_source = provider_source
        self._cache: tuple[datetime, list[Launch]] | None = None

    def is_space_coast(self, launch: Launch) -> bool:
        pad_name = str((launch.pad or {}).get("name") or "").lower()
        location_name = str((launch.pad or {}).get("location_name") or "").lower()
        return any(value in pad_name or value in location_name for value in self.accepted_pads)

    async def upcoming(
        self, force_refresh: bool = False
    ) -> tuple[list[Launch], bool, datetime | None]:
        now = datetime.now(UTC)
        if (
            self._cache
            and not force_refresh
            and (now - self._cache[0]).total_seconds() < self.ttl_seconds
        ):
            return self._cache[1], False, self._cache[0]
        try:
            launches = [
                normalize_launch(item, self.provider_source)
                for item in await self.provider.get_upcoming_launches()
            ]
            launches = sorted(
                {launch.id: launch for launch in launches if self.is_space_coast(launch)}.values(),
                key=lambda launch: launch.net or datetime.max.replace(tzinfo=UTC),
            )
            self._cache = (now, launches)
            return launches, False, now
        except (httpx.HTTPError, ValueError, TypeError):
            if self._cache:
                return self._cache[1], True, self._cache[0]
            raise

    async def next(self) -> tuple[Launch | None, bool, datetime | None]:
        launches, stale, updated = await self.upcoming()
        now = datetime.now(UTC)
        return (
            next((launch for launch in launches if launch.net is None or launch.net >= now), None),
            stale,
            updated,
        )

    async def get(self, provider_id: str) -> Launch | None:
        launch = await self.provider.get_launch(provider_id)
        if launch is None:
            return None
        normalized = normalize_launch(launch, self.provider_source)
        return normalized if self.is_space_coast(normalized) else None


def provider_for_mode(mode: str, base_url: str) -> LaunchProvider:
    launch_mode = LaunchDataMode(mode)
    if launch_mode is LaunchDataMode.FIXTURE:
        return FixtureLaunchProvider()
    return LaunchLibrary2Provider(base_url)
