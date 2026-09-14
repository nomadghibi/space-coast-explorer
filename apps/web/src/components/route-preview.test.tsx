import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getTour } from "../lib/content";
import { RoutePreview } from "./route-preview";

describe("RoutePreview", () => {
  it("shows every mapped pilot location", () => {
    const tour = getTour("cocoa-village-historic-explorer");

    expect(tour).toBeDefined();
    render(<RoutePreview tour={tour!} />);

    expect(screen.getByText("8 Cocoa Village locations")).toBeInTheDocument();
    expect(screen.getAllByText("Parrish Grove Inn / Pette House").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cocoa Village Playhouse").length).toBeGreaterThan(0);
  });

  it("reveals stop info when a mapped stop is selected", async () => {
    const tour = getTour("cocoa-village-historic-explorer");

    expect(tour).toBeDefined();
    render(<RoutePreview tour={tour!} />);

    fireEvent.click(screen.getByRole("button", { name: "Stop 7: S.F. Travis & Company" }));

    expect(screen.getByText("Selected Stop")).toBeInTheDocument();
    expect(screen.getAllByText("S.F. Travis & Company").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Pause near a long-running local business tied to Cocoa's commerce history.")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read More" })).toHaveAttribute(
      "href",
      "/tours/cocoa-village-historic-explorer/stops/sf-travis-company"
    );
  });
});
