import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { tours } from "../lib/content";
import { TourCard } from "./tour-card";

describe("TourCard", () => {
  it("prioritizes starting while preserving detail navigation", () => {
    const tour = tours[0]!;

    render(<TourCard tour={tour} />);

    expect(screen.getByRole("link", { name: "Start" })).toHaveAttribute(
      "href",
      `/tours/${tour.slug}/start`
    );
    expect(screen.getByRole("link", { name: "Details" })).toHaveAttribute(
      "href",
      `/tours/${tour.slug}`
    );
  });
});
