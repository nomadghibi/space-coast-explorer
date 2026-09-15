import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TourStopPage from "./page";

describe("TourStopPage premium gates", () => {
  it("keeps the free stop useful and gates the full story", async () => {
    render(
      await TourStopPage({
        params: Promise.resolve({
          slug: "cocoa-village-historic-explorer",
          stopSlug: "parrish-grove-inn"
        })
      })
    );

    expect(screen.getByRole("heading", { name: "Parrish Grove Inn / Pette House" })).toBeInTheDocument();
    expect(screen.getAllByText("Begin with restored historic lodging and the village's residential scale.").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /Read Full Story/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "Unlock the full experience" })).toBeInTheDocument();
    });
    expect(screen.getByText("$5.99 / 24 hours. The free walking tour still works from start to finish.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Continue Free" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Unlock the full experience" })).not.toBeInTheDocument();
    });
    expect(screen.getAllByRole("link", { name: "Directions" }).length).toBeGreaterThan(0);
  });
});
