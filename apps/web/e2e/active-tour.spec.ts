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
  await expect(page.getByText("1 of 10 stops")).toBeVisible();
});

test("mobile denied location tour can be completed manually", async ({ context, page }) => {
  await context.clearPermissions();
  await page.addInitScript(() => window.localStorage.clear());

  await page.goto("/tours/cocoa-village-historic-explorer/start");
  await page.getByRole("button", { name: "Continue Without Location" }).click();
  await expect(page.getByText("0 of 10 stops")).toBeVisible();
  await page.getByRole("button", { name: "stops" }).click();

  for (let index = 0; index < 10; index += 1) {
    await page.getByRole("button", { name: "Mark Completed" }).first().click();
  }

  await expect(page.getByRole("heading", { name: "You Completed the Cocoa Village Historic Explorer" })).toBeVisible();
});
