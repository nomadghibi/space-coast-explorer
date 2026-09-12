import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3067",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "pnpm dev --port 3067",
    url: "http://localhost:3067",
    reuseExistingServer: true,
    timeout: 60_000
  },
  projects: [
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"] }
    }
  ]
});
