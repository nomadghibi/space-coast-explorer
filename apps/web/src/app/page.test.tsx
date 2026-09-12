import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the public homepage", () => {
    const { container } = render(<HomePage />);
    expect(screen.getByRole("heading", { name: "Explore Florida's Space Coast" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore Tours" })).toHaveAttribute("href", "/tours");
    expect(screen.getByText("Cocoa Village Historic Explorer")).toBeInTheDocument();
    expect(container).not.toHaveTextContent("M1");
    expect(container).not.toHaveTextContent("M2");
    expect(container).not.toHaveTextContent("M6");
    expect(container).not.toHaveTextContent("future milestone");
    expect(container).not.toHaveTextContent("FACT_CHECK_REQUIRED");
  });
});
