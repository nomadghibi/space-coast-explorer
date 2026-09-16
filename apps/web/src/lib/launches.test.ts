import { describe, expect, it } from "vitest";
import {
  countdownState,
  formatLaunchDate,
  formatLaunchWindow,
  launchMissionName,
  launchStatusLabel,
  launchVehicleName
} from "./launches";

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

  it("formats countdowns from launch timestamps without layout-shifting strings", () => {
    expect(countdownState("2030-01-01T03:04:05Z", Date.parse("2030-01-01T01:00:00Z"))).toMatchObject({
      label: "T-02:04:05",
      expired: false
    });
  });

  it("handles unknown and expired countdowns safely", () => {
    expect(countdownState(null).label).toBe("T pending");
    expect(countdownState("2030-01-01T00:00:00Z", Date.parse("2030-01-01T00:00:01Z"))).toMatchObject({
      label: "T+00:00:00",
      expired: true
    });
  });

  it("derives vehicle and mission labels from normalized launch data", () => {
    const launch = {
      name: "Falcon 9 | Starlink Group XX",
      rocket: null,
      mission: null
    };
    expect(launchVehicleName(launch as never)).toBe("Falcon 9");
    expect(launchMissionName(launch as never)).toBe("Starlink Group XX");
  });
});
