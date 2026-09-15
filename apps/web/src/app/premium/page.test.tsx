import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PremiumPage from "./page";

describe("PremiumPage", () => {
  it("positions free access as useful while previewing premium upgrades", () => {
    render(<PremiumPage />);

    expect(screen.getByRole("heading", { name: "Keep the basics free. Unlock the richer trip." })).toBeInTheDocument();
    expect(screen.getByText("Worth using on its own")).toBeInTheDocument();
    expect(screen.getByText("The guided layer")).toBeInTheDocument();
    expect(screen.getByText("Audio Narration")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Use Free Tour" })).toHaveAttribute(
      "href",
      "/tours/cocoa-village-historic-explorer/start"
    );
  });
});
