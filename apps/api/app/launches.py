from __future__ import annotations

import re
from datetime import UTC, datetime
from typing import Any, Protocol

import httpx
from pydantic import BaseModel, ConfigDict, Field


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


def normalize_launch(item: ProviderLaunch, source: str) -> Launch:
    provider = item.launch_service_provider or {}
    rocket_config = ((item.rocket or {}).get("configuration") or {})
    mission = item.mission
    pad = item.pad
    location = (pad or {}).get("location") or {}
    return Launch(
        id=f"{source}:{item.id}", provider_source=source, provider_launch_id=item.id,
        name=item.name, slug=item.slug or re.sub(r"[^a-z0-9]+", "-", item.name.lower()).strip("-"),
        launch_provider={"name": provider.get("name"), "abbreviation": provider.get("abbrev")},
        rocket={"name": rocket_config.get("name"), "full_name": rocket_config.get("full_name"), "image_url": rocket_config.get("image_url")} if rocket_config else None,
        mission={"name": mission.get("name"), "description": mission.get("description"), "type": mission.get("type"), "orbit": (mission.get("orbit") or {}).get("name")} if mission else None,
        pad={"name": pad.get("name"), "location_name": location.get("name"), "latitude": pad.get("latitude"), "longitude": pad.get("longitude")} if pad else None,
        status=normalize_status(item.status), net=item.net, window_start=item.window_start,
        window_end=item.window_end, image_url=item.image, webcast_url=item.vid_urls[0] if item.vid_urls else None,
        last_updated_at=item.last_updated,
    )


class LaunchLibrary2Provider:
    def __init__(self, base_url: str, timeout_seconds: float = 10.0) -> None:
        self.base_url = base_url.rstrip("/") + "/2.3.0"
        self.timeout_seconds = timeout_seconds

    async def _request(self, path: str) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            response = await client.get(f"{self.base_url}/{path.lstrip('/')}", params={"limit": 100, "ordering": "net"})
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


class LaunchService:
    def __init__(self, provider: LaunchProvider, accepted_pads: set[str], ttl_seconds: int) -> None:
        self.provider = provider
        self.accepted_pads = {value.strip().lower() for value in accepted_pads if value.strip()}
        self.ttl_seconds = ttl_seconds
        self._cache: tuple[datetime, list[Launch]] | None = None

    def _is_space_coast(self, launch: Launch) -> bool:
        pad_name = str((launch.pad or {}).get("name") or "").lower()
        location_name = str((launch.pad or {}).get("location_name") or "").lower()
        return any(value in pad_name or value in location_name for value in self.accepted_pads)

    async def upcoming(self, force_refresh: bool = False) -> tuple[list[Launch], bool, datetime | None]:
        now = datetime.now(UTC)
        if self._cache and not force_refresh and (now - self._cache[0]).total_seconds() < self.ttl_seconds:
            return self._cache[1], False, self._cache[0]
        try:
            launches = [normalize_launch(item, "launch_library_2") for item in await self.provider.get_upcoming_launches()]
            launches = sorted({launch.id: launch for launch in launches if self._is_space_coast(launch)}.values(), key=lambda launch: launch.net or datetime.max.replace(tzinfo=UTC))
            self._cache = (now, launches)
            return launches, False, now
        except (httpx.HTTPError, ValueError, TypeError):
            if self._cache:
                return self._cache[1], True, self._cache[0]
            raise

    async def next(self) -> tuple[Launch | None, bool, datetime | None]:
        launches, stale, updated = await self.upcoming()
        now = datetime.now(UTC)
        return next((launch for launch in launches if launch.net is None or launch.net >= now), None), stale, updated
