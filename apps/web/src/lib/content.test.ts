import { describe, expect, it } from "vitest";
import {
  destinationPoiCluster,
  destinations,
  filterTours,
  getDestination,
  getTour,
  getTourStopImage,
  tours
} from "./content";

describe("public content", () => {
  it("finds the initial destination areas", () => {
    expect(getDestination("cocoa-village")?.name).toBe("Cocoa Village");
    expect(getDestination("cocoa-beach")?.name).toBe("Cocoa Beach");
    expect(getDestination("port-canaveral")?.name).toBe("Port Canaveral");
  });

  it("finds the pilot tour", () => {
    expect(getTour("cocoa-village-historic-explorer")?.stopCount).toBe(10);
  });

  it("gives the pilot tour a concrete start point", () => {
    const pilot = getTour("cocoa-village-historic-explorer");

    expect(pilot?.startPoint?.title).toBe("Porcher House");
    expect(pilot?.startPoint?.address).toContain("434 Delannoy Avenue");
    expect(pilot?.startPoint?.parkingNotes.length).toBeGreaterThan(0);
  });

  it("models Cocoa Village as a destination cluster", () => {
    const pois = destinationPoiCluster("cocoa-village");
    const categories = new Set(pois.map((poi) => poi.category));
    const historicLandmarks = pois.filter(
      (poi) => poi.category === "Historic Landmark" || poi.slug === "historic-cocoa-village-playhouse"
    );

    expect(pois).toHaveLength(30);
    expect(historicLandmarks.length).toBeGreaterThan(0);
    expect(historicLandmarks.every((poi) => poi.description?.length)).toBe(true);
    expect(pois.find((poi) => poi.slug === "historic-walking-tour-route")?.priority).toBe(
      "featured"
    );
    expect(Array.from(categories)).toEqual(
      expect.arrayContaining(["Historic Landmark", "Waterfront", "Food", "Events"])
    );
  });

  it("attaches local visitor photos to supplied Cocoa Village landmarks", () => {
    const requestedPhotoSlugs = [
      "porcher-house",
      "parrish-grove-inn",
      "sur-le-parc",
      "historic-cocoa-village-playhouse",
      "derby-street-chapel",
      "village-tower-masonic-temple",
      "sf-travis-company",
      "st-marks-episcopal-church",
      "library-of-florida-history",
      "myrt-tharpe-square",
      "cocoa-riverfront-park",
      "riverfront-amphitheater",
      "cocoa-village-marina",
      "taylor-park",
      "cocoa-civic-center",
      "historic-lawndale-museum",
      "brevard-county-state-bank",
      "historic-walking-tour-route",
      "delannoy-avenue"
    ];

    const poisBySlug = new Map(destinationPoiCluster("cocoa-village").map((poi) => [poi.slug, poi]));

    for (const slug of requestedPhotoSlugs) {
      const poi = poisBySlug.get(slug);

      expect(poi?.description?.length).toBeGreaterThan(0);
      expect(poi?.imageUrl).toBe(`/images/cocoa-village/landmarks/${slug}.jpg`);
      expect(poi?.imageAlt).toBeTruthy();
    }
  });

  it("models the Historic Walking Tour Route with map and street-scene media", () => {
    const route = destinationPoiCluster("cocoa-village").find(
      (poi) => poi.slug === "historic-walking-tour-route"
    );
    const description = route?.description?.join(" ") ?? "";

    expect(route?.category).toBe("Walking Tour / Historic District");
    expect(route?.address).toBe("Delannoy Avenue / central Cocoa Village");
    expect(route?.imageUrl).toBe("/images/cocoa-village/landmarks/historic-walking-tour-route.jpg");
    expect(route?.secondaryImageUrl).toBe(
      "/images/cocoa-village/landmarks/historic-walking-tour-route-secondary.jpg"
    );
    expect(description).toContain("Porcher House, 434 Delannoy Avenue");
    expect(description).toContain("less than one mile");
    expect(description).toContain("S.F. Travis Company");
    expect(description).toContain("Brevard County State Bank");
    expect(description).toContain("Parrish Grove Inn");
  });

  it("uses stable slugs for every manual tour stop", () => {
    for (const tour of tours) {
      expect(tour.stops).toHaveLength(tour.stopCount);
      expect(new Set(tour.stops.map((stop) => stop.slug)).size).toBe(tour.stops.length);
      expect(tour.stops.every((stop) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(stop.slug))).toBe(true);
    }
  });

  it("resolves landmark-specific images for Cocoa Village tour stops", () => {
    const tour = getTour("cocoa-village-historic-explorer");

    expect(tour).toBeDefined();

    const images = new Map(
      tour!.stops.map((stop) => [stop.slug, getTourStopImage(tour!, stop).imageUrl])
    );

    expect(images.get("porcher-house")).toBe("/images/cocoa-village/landmarks/porcher-house.jpg");
    expect(images.get("sf-travis-company")).toBe(
      "/images/cocoa-village/landmarks/sf-travis-company.jpg"
    );
    expect(images.get("historic-bank-corner")).toBe(
      "/images/cocoa-village/landmarks/brevard-county-state-bank.jpg"
    );
    expect(new Set(images.values()).size).toBeGreaterThan(6);
  });

  it("keeps internal editorial markers out of visitor-facing content", () => {
    const publicText = [
      ...destinations.flatMap((destination) => [
        destination.eyebrow,
        destination.summary,
        ...destination.introduction,
        ...destination.highlights,
        ...Object.values(destination.quickInfo)
      ]),
      ...tours.flatMap((tour) => [
        tour.title,
        tour.summary,
        tour.description,
        tour.accessibilitySummary,
        tour.staticRouteSummary,
        ...tour.highlights,
        ...tour.safetyNotes,
        ...tour.stops.flatMap((stop) => [stop.title, stop.summary, stop.visitorStory ?? ""])
      ])
    ].join(" ");

    expect(publicText).not.toMatch(/M0|M1|M2|M6|future milestone|future milestones|public discovery|preview only|FACT_CHECK_REQUIRED|editorial review/i);
  });

  it("filters tours by destination and category", () => {
    const filtered = filterTours({ destination: "cocoa-village", category: "History" });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.slug).toBe("cocoa-village-historic-explorer");
  });
});
