
from fastapi import APIRouter, HTTPException, Query

from app.core.config import get_settings
from app.launches import LaunchLibrary2Provider, LaunchService

router = APIRouter(prefix="/api/v1/public/launches", tags=["launches"])


_service: LaunchService | None = None


def service() -> LaunchService:
    global _service
    if _service is not None:
        return _service
    settings = get_settings()
    provider = LaunchLibrary2Provider(settings.launch_library_base_url)
    _service = LaunchService(provider, set(settings.launch_space_coast_pads.split(",")), settings.launch_cache_ttl_seconds)
    return _service


@router.get("")
async def list_launches(force_refresh: bool = Query(default=False)) -> dict[str, object]:
    launches, stale, updated = await service().upcoming(force_refresh)
    return {"data": launches, "data_freshness": "stale" if stale else "fresh", "last_updated_at": updated}


@router.get("/upcoming")
async def upcoming_launches() -> dict[str, object]:
    return await list_launches()


@router.get("/next")
async def next_launch() -> dict[str, object]:
    launch, stale, updated = await service().next()
    return {"data": launch, "data_freshness": "stale" if stale else "fresh", "last_updated_at": updated}


@router.get("/{launch_id}")
async def get_launch(launch_id: str) -> object:
    settings = get_settings()
    launch = await LaunchLibrary2Provider(settings.launch_library_base_url).get_launch(launch_id)
    if launch is None:
        raise HTTPException(status_code=404, detail="Launch not found")
    from app.launches import normalize_launch
    normalized = normalize_launch(launch, settings.launch_provider)
    if not service()._is_space_coast(normalized):
        raise HTTPException(status_code=404, detail="Launch not found")
    return normalized
