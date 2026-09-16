import { describe, expect, it } from "vitest";
import { formatLaunchDate, formatLaunchWindow, launchStatusLabel } from "./launches";

describe("launch formatting", () => {
  it("formats launch times in Eastern time", () => {
    expect(formatLaunchDate("2030-01-15T02:17:00Z")).toContain("EST");
    expect(formatLaunchDate(null)).toBe("Time pending");
  });

  it("formats launch windows without guessing missing values", () => {
    expect(
      formatLaunchWindow({
        window_start: "2030-01-15T01:55:00Z",
        window_end: "2030-01-15T03:35:00Z"
      })
    ).toContain("EST");
    expect(formatLaunchWindow({ window_start: null, window_end: null })).toBe(
      "Launch window pending"
    );
  });

  it("uses visitor-friendly status labels", () => {
    expect(launchStatusLabel("go")).toBe("Go");
    expect(launchStatusLabel("unknown")).toBe("Status pending");
  });
});
