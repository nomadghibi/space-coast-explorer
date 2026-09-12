from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/public", tags=["public"])


class DestinationResponse(BaseModel):
    slug: str
    name: str
    summary: str
    highlights: list[str]


class TourResponse(BaseModel):
    slug: str
    title: str
    destination_slug: str
    destination_name: str
    summary: str
    transport_mode: str
    duration_minutes: int
    distance_miles: float
    stop_count: int
    price_label: str
    accessibility_summary: str


DESTINATIONS = [
    DestinationResponse(
        slug="cocoa-village",
        name="Cocoa Village",
        summary=(
            "Historic downtown exploring with restaurants, shops, architecture, "
            "and riverfront."
        ),
        highlights=["historic architecture", "shopping", "restaurants", "riverfront"],
    ),
    DestinationResponse(
        slug="cocoa-beach",
        name="Cocoa Beach",
        summary="Surf, sand, food, family attractions, and Space Coast beach culture.",
        highlights=["beach", "surfing", "food", "space culture"],
    ),
    DestinationResponse(
        slug="port-canaveral",
        name="Port Canaveral",
        summary="Cruise gateway and waterfront discovery near restaurants and launch-view areas.",
        highlights=["cruise travel", "waterfront", "restaurants", "launch viewpoints"],
    ),
]

TOURS = [
    TourResponse(
        slug="cocoa-village-historic-explorer",
        title="Cocoa Village Historic Explorer",
        destination_slug="cocoa-village",
        destination_name="Cocoa Village",
        summary="A compact walking introduction to Cocoa Village streets and stories.",
        transport_mode="Walking",
        duration_minutes=60,
        distance_miles=1.2,
        stop_count=10,
        price_label="Free",
        accessibility_summary="Sidewalk-focused route; conditions require pilot verification.",
    ),
    TourResponse(
        slug="cocoa-beach-surf-space-sand",
        title="Cocoa Beach: Surf, Space & Sand",
        destination_slug="cocoa-beach",
        destination_name="Cocoa Beach",
        summary="A beach-town discovery route connecting surf culture and coastal views.",
        transport_mode="Mixed",
        duration_minutes=95,
        distance_miles=4.8,
        stop_count=6,
        price_label="Free",
        accessibility_summary="Beach access and parking conditions vary.",
    ),
    TourResponse(
        slug="port-canaveral-explorer",
        title="Port Canaveral Explorer",
        destination_slug="port-canaveral",
        destination_name="Port Canaveral",
        summary="A cruise-friendly waterfront preview near the port.",
        transport_mode="Driving",
        duration_minutes=75,
        distance_miles=5.5,
        stop_count=5,
        price_label="Free",
        accessibility_summary="Driving-oriented route; verify terminal and parking rules.",
    ),
]


@router.get("/destinations", response_model=list[DestinationResponse])
def list_destinations() -> list[DestinationResponse]:
    return DESTINATIONS


@router.get("/destinations/{slug}", response_model=DestinationResponse)
def get_destination(slug: str) -> DestinationResponse:
    for destination in DESTINATIONS:
        if destination.slug == slug:
            return destination
    raise HTTPException(status_code=404, detail="Destination not found")


@router.get("/tours", response_model=list[TourResponse])
def list_tours() -> list[TourResponse]:
    return TOURS


@router.get("/tours/{slug}", response_model=TourResponse)
def get_tour(slug: str) -> TourResponse:
    for tour in TOURS:
        if tour.slug == slug:
            return tour
    raise HTTPException(status_code=404, detail="Tour not found")
