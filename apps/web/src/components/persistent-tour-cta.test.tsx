import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { createTourSession, markStopCompleted } from "@space-coast-explorer/maps";
import { tours } from "../lib/content";
import { saveTourSession } from "../lib/tour-session";
import { PersistentTourCta } from "./persistent-tour-cta";

describe("PersistentTourCta", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts a new tour when no saved progress exists", () => {
    const tour = tours[0]!;

    render(<PersistentTourCta tour={tour} />);

    expect(screen.getByRole("link", { name: "Start Tour" })).toHaveAttribute(
      "href",
      `/tours/${tour.slug}/start`
    );
  });

  it("continues a tour when saved progress exists", async () => {
    const tour = tours[0]!;
    const firstStopSlug = tour.stops[0]!.slug;
    const session = markStopCompleted(
      createTourSession(tour.slug, firstStopSlug),
      tour.stops.map((stop) => stop.slug),
      firstStopSlug
    );
    saveTourSession(session);

    render(<PersistentTourCta tour={tour} />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Continue Tour" })).toBeInTheDocument();
    });
    expect(screen.getByText(`1 of ${tour.stopCount} complete`)).toBeInTheDocument();
  });

  it("continues a started tour before any stop is completed", async () => {
    const tour = tours[0]!;
    const firstStopSlug = tour.stops[0]!.slug;
    saveTourSession(createTourSession(tour.slug, firstStopSlug));

    render(<PersistentTourCta tour={tour} />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Continue Tour" })).toBeInTheDocument();
    });
    expect(screen.getByText(`0 of ${tour.stopCount} complete`)).toBeInTheDocument();
  });
});
