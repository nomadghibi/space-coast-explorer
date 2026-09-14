import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getTour } from "../lib/content";
import { RoutePreview } from "./route-preview";

describe("RoutePreview", () => {
  it("shows every mapped pilot location", () => {
    const tour = getTour("cocoa-village-historic-explorer");

    expect(tour).toBeDefined();
    render(<RoutePreview tour={tour!} />);

    expect(screen.getByText("8 Cocoa Village locations")).toBeInTheDocument();
    expect(screen.getByText("Parrish Grove Inn / Pette House")).toBeInTheDocument();
    expect(screen.getByText("Cocoa Village Playhouse")).toBeInTheDocument();
  });
});
