import { describe, expect, it } from "vitest";
import { googleMapsDirectionsUrl, googleMapsSearchUrl } from "./map-links";

describe("map links", () => {
  it("builds directions URLs for coordinates", () => {
    expect(googleMapsDirectionsUrl({ latitude: 28.3625, longitude: -80.72556 })).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=28.3625%2C-80.72556"
    );
  });

  it("builds search URLs for readable place names", () => {
    expect(googleMapsSearchUrl("Porcher House, Cocoa, FL")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Porcher%20House%2C%20Cocoa%2C%20FL"
    );
  });
});
