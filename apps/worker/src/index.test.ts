import { describe, expect, it } from "vitest";
import { workerHealth } from "./index";

describe("workerHealth", () => {
  it("returns worker health", () => {
    expect(workerHealth()).toEqual({ status: "ok", service: "worker" });
  });
});
