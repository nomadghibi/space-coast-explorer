import type { GeoPoint } from "@space-coast-explorer/types";

export function googleMapsDirectionsUrl(destination: GeoPoint | string) {
  const destinationValue =
    typeof destination === "string"
      ? destination
      : `${destination.latitude},${destination.longitude}`;

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationValue)}`;
}

export function googleMapsSearchUrl(query: GeoPoint | string) {
  const queryValue = typeof query === "string" ? query : `${query.latitude},${query.longitude}`;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryValue)}`;
}
