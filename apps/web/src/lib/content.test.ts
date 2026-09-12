import { describe, expect, it } from "vitest";
import { filterTours, getDestination, getTour } from "./content";

describe("public content", () => {
  it("finds the initial destination areas", () => {
    expect(getDestination("cocoa-village")?.name).toBe("Cocoa Village");
    expect(getDestination("cocoa-beach")?.name).toBe("Cocoa Beach");
    expect(getDestination("port-canaveral")?.name).toBe("Port Canaveral");
  });

  it("finds the pilot tour", () => {
    expect(getTour("cocoa-village-historic-explorer")?.stopCount).toBe(10);
  });

  it("filters tours by destination and category", () => {
    const filtered = filterTours({ destination: "cocoa-village", category: "History" });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.slug).toBe("cocoa-village-historic-explorer");
  });
});
