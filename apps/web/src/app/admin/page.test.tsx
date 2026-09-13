import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminPage from "./page";

describe("AdminPage", () => {
  it("renders the editorial dashboard", () => {
    render(<AdminPage />);

    expect(screen.getByRole("heading", { name: "Editorial Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Cocoa Village Historic Explorer")).toBeInTheDocument();
    expect(screen.getByText("CMS Launch Gate")).toBeInTheDocument();
  });
});
