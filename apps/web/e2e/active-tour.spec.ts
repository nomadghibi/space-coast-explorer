import { expect, test } from "@playwright/test";

test("mobile location-assisted tour detects arrival and updates progress", async ({ context, page }) => {
  await context.grantPermissions(["geolocation"]);
  await context.setGeolocation({ latitude: 28.35532, longitude: -80.72606, accuracy: 10 });
  await page.addInitScript(() => window.localStorage.clear());

  await page.goto("/tours/cocoa-village-historic-explorer/start");
  await page.getByRole("button", { name: "Enable Location" }).click();

  await page.getByRole("button", { name: "arrive" }).click();
  await expect(page.getByText("You have arrived.").first()).toBeVisible();
  await page.getByRole("button", { name: "stops" }).click();
  await page.getByRole("button", { name: "Mark Completed" }).first().click();
  await expect(page.getByText("1 of 11 stops complete")).toBeVisible();
});

test("scenario A: free visitor can finish the official tour without payment", async ({ context, page }) => {
  await context.clearPermissions();
  await page.addInitScript(() => window.localStorage.clear());

  await page.goto("/tours/cocoa-village-historic-explorer/start");
  await page.getByRole("button", { name: "Continue Without Location" }).click();
  await expect(page.getByText("0 of 11 stops complete")).toBeVisible();
  await page.getByRole("button", { name: "Finish Tour" }).click();

  await expect(page.getByRole("heading", { name: "You Completed the Cocoa Village Historic Explorer" })).toBeVisible();
  await expect(page.getByText("You finished with 0 of 11 stops completed")).toBeVisible();
});

test("scenario B: free visitor sees premium gate and can continue free", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());

  await page.goto("/tours/cocoa-village-historic-explorer/stops/parrish-grove-inn");
  await expect(page.getByRole("heading", { name: "Parrish Grove Inn / Pette House" })).toBeVisible();
  await page.getByRole("button", { name: /Read Full Story/i }).click();
  await expect(page.getByRole("dialog", { name: "Unlock the full experience" })).toBeVisible();
  await expect(page.getByText("$5.99 / 24 hours. The free walking tour still works from start to finish.")).toBeVisible();
  await page.getByRole("button", { name: "Continue Free" }).click();
  await expect(page.getByRole("dialog", { name: "Unlock the full experience" })).toBeHidden();
  await expect(page.getByRole("link", { name: "Next Stop", exact: true })).toBeVisible();
});

test("scenario C: development Explorer Pass unlocks and expiration returns to free", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.clear();
    window.localStorage.setItem(
      "space-coast-explorer:explorer-pass",
      JSON.stringify({
        plan: "explorer_pass",
        status: "active",
        startsAt: "2026-09-15T12:00:00.000Z",
        expiresAt: "2099-09-16T12:00:00.000Z",
        provider: "development",
        providerReference: "playwright-dev-pass"
      })
    );
  });

  await page.goto("/tours/cocoa-village-historic-explorer/stops/parrish-grove-inn");
  await expect(page.getByRole("button", { name: "Read Full Story", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Read Full Story", exact: true }).click();
  await expect(page.getByText("Look at how the quieter Delannoy Avenue fabric differs")).toBeVisible();

  await page.evaluate(() => {
    window.localStorage.removeItem("space-coast-explorer:explorer-pass");
  });
  await page.goto("/tours");
  await page.goto("/tours/cocoa-village-historic-explorer/stops/parrish-grove-inn");
  await page.getByRole("button", { name: /Read Full Story/i }).click();
  await expect(page.getByRole("dialog", { name: "Unlock the full experience" })).toBeVisible();
});

test("scenario D: upgrade prompt appears after engagement and does not block the tour", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());

  await page.goto("/tours/cocoa-village-historic-explorer/start");
  await page.getByRole("button", { name: "Continue Without Location" }).click();
  await page.getByRole("button", { name: "stops" }).click();

  for (let index = 0; index < 3; index += 1) {
    await page.getByRole("button", { name: "Mark Completed" }).first().click();
  }

  await expect(page.getByLabel("Explorer Pass upgrade prompt")).toBeVisible();
  await page.getByRole("button", { name: "Continue Free" }).click();
  await expect(page.getByLabel("Explorer Pass upgrade prompt")).toBeHidden();
  await expect(page.getByRole("button", { name: "Mark Completed" }).first()).toBeVisible();
});
