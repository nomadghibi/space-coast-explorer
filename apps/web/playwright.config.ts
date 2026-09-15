import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3071",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "NEXT_PUBLIC_ENABLE_DEV_EXPLORER_PASS=true pnpm dev --port 3071",
    env: {
      NEXT_PUBLIC_ENABLE_DEV_EXPLORER_PASS: "true"
    },
    url: "http://localhost:3071",
    reuseExistingServer: false,
    timeout: 60_000
  },
  projects: [
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] }
    }
  ]
});
