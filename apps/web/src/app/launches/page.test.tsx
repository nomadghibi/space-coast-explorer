import { render, screen } from "@testing-library/react";
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
    expect(screen.getAllByText("Falcon 9 | Space Coast Explorer Fixture Mission")).toHaveLength(2);
    expect(screen.getAllByText("Space Launch Complex 40")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Explore Tours Nearby" })).toHaveAttribute(
      "href",
      "/tours"
    );
  });

  it("shows a clear unavailable state when the API is not connected", () => {
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

    expect(screen.getByText(/Launch API hosting is not connected/)).toBeInTheDocument();
    expect(screen.getAllByText("No Space Coast launches available")).toHaveLength(2);
  });

  it("warns when showing stale launch data", () => {
    render(<LaunchesView feed={{ ...readyFeed, dataFreshness: "stale" }} />);

    expect(screen.getByText(/Launch data is temporarily stale/)).toBeInTheDocument();
  });
});
