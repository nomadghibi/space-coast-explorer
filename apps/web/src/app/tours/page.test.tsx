import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ToursPage from "./page";

describe("ToursPage", () => {
  it("uses visitor-friendly filters that preserve active selections", async () => {
    render(
      await ToursPage({
        searchParams: Promise.resolve({ destination: "cocoa-village" })
      })
    );

    expect(screen.getByText("Where are you going?")).toBeInTheDocument();
    expect(screen.getByText("What do you want?")).toBeInTheDocument();
    expect(screen.getByText("How much time?")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "History" })).toHaveAttribute(
      "href",
      "/tours?destination=cocoa-village&category=History"
    );
    expect(screen.getByRole("link", { name: "Any place" })).toHaveAttribute("href", "/tours");
  });
});
