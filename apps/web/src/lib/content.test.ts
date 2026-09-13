import { describe, expect, it } from "vitest";
import { destinations, filterTours, getDestination, getTour, tours } from "./content";

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

    expect(pilot?.startPoint?.title).toBe("Historic Cocoa Village Playhouse");
    expect(pilot?.startPoint?.address).toContain("300 Brevard Avenue");
    expect(pilot?.startPoint?.parkingNotes.length).toBeGreaterThan(0);
  });

  it("uses stable slugs for every manual tour stop", () => {
    for (const tour of tours) {
      expect(tour.stops).toHaveLength(tour.stopCount);
      expect(new Set(tour.stops.map((stop) => stop.slug)).size).toBe(tour.stops.length);
      expect(tour.stops.every((stop) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(stop.slug))).toBe(true);
    }
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
