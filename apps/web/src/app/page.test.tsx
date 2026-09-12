import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the M1 public homepage", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: "Explore Florida's Space Coast" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore Tours" })).toHaveAttribute("href", "/tours");
    expect(screen.getByText("Cocoa Village Historic Explorer")).toBeInTheDocument();
  });
});
