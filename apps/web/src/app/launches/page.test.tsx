import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LaunchFeedState } from "../../lib/launches";
import { LaunchesView } from "./launches-view";

const readyFeed: LaunchFeedState = {
  status: "ready",
  dataFreshness: "fresh",
  lastUpdatedAt: "2029-12-20T16:00:00Z",
  launches: [
    {
      id: "launch_library_2:fixture-falcon-9-space-coast",
      provider_source: "launch_library_2",
      provider_launch_id: "fixture-falcon-9-space-coast",
      name: "Falcon 9 | Space Coast Explorer Fixture Mission",
      slug: "falcon-9-space-coast-explorer-fixture-mission",
      launch_provider: { name: "SpaceX", abbreviation: "SpX" },
      rocket: { name: "Falcon 9", full_name: "Falcon 9 Block 5", image_url: null },
      mission: {
        name: "Space Coast Explorer Fixture Mission",
        description: "Deterministic fixture data for local launch UI development.",
        type: "Communications",
        orbit: "Low Earth Orbit"
      },
      pad: {
        name: "Space Launch Complex 40",
        location_name: "Cape Canaveral SFS, FL, USA",
        latitude: 28.561941,
        longitude: -80.577357
      },
      status: "scheduled",
      net: "2030-01-15T02:17:00Z",
      window_start: "2030-01-15T01:55:00Z",
      window_end: "2030-01-15T03:35:00Z",
      image_url: null,
      webcast_url: "https://www.youtube.com/watch?v=fixture",
      last_updated_at: "2029-12-20T16:00:00Z"
    }
  ]
};

describe("LaunchesPage", () => {
  it("renders the next launch and schedule from normalized data", () => {
    render(<LaunchesView feed={readyFeed} />);

    expect(screen.getByRole("heading", { name: "Space Coast Launches" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Falcon 9" })).toBeInTheDocument();
    expect(screen.getAllByText("Space Coast Explorer Fixture Mission").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Space Launch Complex 40").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: "Find Viewing Spots" })).toHaveAttribute("href", "#viewing-spots");
  });

  it("shows a clear unavailable state when launch data is unavailable", () => {
    render(
      <LaunchesView
        feed={{
          status: "unavailable",
          launches: [],
          dataFreshness: "unavailable",
          lastUpdatedAt: null,
          reason: "api_not_configured"
        }}
      />
    );

    expect(screen.getByText(/Launch data is temporarily unavailable/)).toBeInTheDocument();
    expect(screen.getAllByText("No Space Coast launches available")).toHaveLength(2);
  });

  it("warns when showing stale launch data", () => {
    render(<LaunchesView feed={{ ...readyFeed, dataFreshness: "stale" }} />);

    expect(screen.getByText(/Launch data is temporarily stale/)).toBeInTheDocument();
  });

  it("opens and closes the viewing spot drawer", () => {
    render(<LaunchesView feed={readyFeed} />);

    fireEvent.click(screen.getByRole("button", { name: "Select viewing spot Space View Park" }));
    expect(screen.getByRole("dialog", { name: /Space View Park viewing spot details/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close viewing spot details" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("selects viewing spots from map markers", () => {
    render(<LaunchesView feed={readyFeed} />);

    fireEvent.click(screen.getByRole("button", { name: "Select viewing spot Cocoa Riverfront Park" }));
    expect(screen.getByRole("dialog", { name: /Cocoa Riverfront Park viewing spot details/ })).toBeInTheDocument();
  });
});
