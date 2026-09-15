import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  activateDevelopmentExplorerPass,
  expireDevelopmentExplorerPass,
  hasEntitlement,
  loadUserEntitlements
} from "./entitlements";

describe("Explorer Pass entitlements", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubEnv("NEXT_PUBLIC_ENABLE_DEV_EXPLORER_PASS", "true");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults to free access", () => {
    expect(loadUserEntitlements().plan).toBe("free");
  });

  it("activates a development Explorer Pass for 24 hours", () => {
    const now = new Date("2026-09-15T12:00:00.000Z");

    const entitlements = activateDevelopmentExplorerPass(now);

    expect(entitlements.plan).toBe("explorer_pass");
    expect(entitlements.status).toBe("active");
    expect(entitlements.expiresAt).toBe("2026-09-16T12:00:00.000Z");
    expect(hasEntitlement(entitlements, "full_stories")).toBe(true);
  });

  it("returns expired passes to free access", () => {
    const now = new Date("2026-09-15T12:00:00.000Z");
    activateDevelopmentExplorerPass(now);

    const entitlements = loadUserEntitlements(new Date("2026-09-16T12:00:01.000Z"));

    expect(entitlements.plan).toBe("free");
    expect(entitlements.status).toBe("expired");
  });

  it("can expire a development pass for testing", () => {
    const entitlements = expireDevelopmentExplorerPass(new Date("2026-09-15T12:00:00.000Z"));

    expect(entitlements.plan).toBe("free");
    expect(entitlements.status).toBe("expired");
  });
});
