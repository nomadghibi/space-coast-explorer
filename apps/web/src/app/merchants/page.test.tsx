import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MerchantsPage from "./page";

describe("MerchantsPage", () => {
  it("renders the merchant portal dashboard", () => {
    render(<MerchantsPage />);

    expect(screen.getByRole("heading", { name: "Local Business Console" })).toBeInTheDocument();
    expect(screen.getByText("Historic Village Cafe")).toBeInTheDocument();
    expect(screen.getByText("Before Public Access")).toBeInTheDocument();
  });
});
