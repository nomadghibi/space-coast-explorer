import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AnalyticsPage from "./page";

describe("AnalyticsPage", () => {
  it("renders the pilot analytics dashboard", () => {
    render(<AnalyticsPage />);

    expect(
      screen.getByRole("heading", { name: "Completed Visitor Experiences" })
    ).toBeInTheDocument();
    expect(screen.getByText("Cocoa Village Historic Explorer")).toBeInTheDocument();
    expect(screen.getByText("Demo metrics until API hosting is live")).toBeInTheDocument();
    expect(screen.getByText("Pilot Gate")).toBeInTheDocument();
  });
});
