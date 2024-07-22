import test, { expect } from "@playwright/test";
import { devToolsPositions } from "../src/types/types";
import { buildUrl } from "../src/utils/url-utils";

test.describe("devtools", () => {
  test.describe("position", () => {
    devToolsPositions.forEach((position) => {
      test(`displays in the ${position}`, async ({ page }) => {
        await page.goto(position);

        if (position.includes("top")) page.locator(".top-0");
        if (position.includes("bottom")) page.locator(".bottom-0");
        if (position.includes("left")) page.locator(".left-0");
        if (position.includes("right")) page.locator(".right-0");
      });
    });
  });

  test.describe("defaults", () => {
    test("uses fallback defaults when no optional default overrides are provided", ({
      page,
    }) => {
      page.goto("/");
      page.getByLabel("Persona");
      // Should default to open
      page.getByRole("button", { name: "Close DevTools" });

      // Should display in top left by default
      page.locator(".top-0");
      page.locator(".left-0");

      // Should have close via outside click off by default
      expect(page.getByLabel("Close via outside click")).not.toBeChecked();

      // Should have close via escape on by default
      expect(page.getByLabel("Close via escape key")).not.toBeChecked();

      // Should have 0 Global delay by default
      expect(page.getByLabel("Global Delay")).toHaveAttribute("value", "0");
    });
  });

  test.describe("when defaultToOpen is false", () => {
    test("is initially closed", async ({ page }) => {
      page.goto(buildUrl("http://localhost:5173/", { openByDefault: false }));
      await expect(page.getByLabel("User")).not.toBeVisible();
      await expect(
        page.getByRole("button", { name: "Open DevTools" })
      ).toBeVisible();
    });
  });

  test.describe('when the "Copy Settings" button is clicked', () => {
    // Note: We don't need to test that the URL actually works here since all other tests do that via the visitUrl command.
    test.only("should copy the settings to the clipboard", async ({ page }) => {
      // Overriding ALL settings to assure they all show up in the generated URL, and are reflected upon load.
      page.goto(
        buildUrl("http://localhost:5173/", {
          openByDefault: false,
          delay: 100,
          userId: 2,
          position: "top-right",
          customResponses: [
            {
              delay: 1,
              handler: "DELETE /todo/:id",
              status: 201,
              response: "test",
            },
          ],
        })
      );

      // Must open via click since the URL above specifies DevTools should be closed by default.
      await page.getByRole("button", { name: "Open DevTools" }).click();

      await page.getByRole("button", { name: "Copy Settings" }).click();

      // Should change the button's label upon click
      page.getByRole("button", { name: "Copied ✅" }).then(() => {
        cy.window().then((win) => {
          win.navigator.clipboard.readText().then((text) => {
            const expectedUrl =
              "http://127.0.0.1:5173/todos?position=%22top-right%22&openByDefault=false&delay=100&customResponses=%5B%7B%22delay%22%3A1%2C%22handler%22%3A%22DELETE+%2Ftodo%2F%3Aid%22%2C%22status%22%3A201%2C%22response%22%3A%22test%22%7D%5D&userId=2";
            expect(text).to.eq(expectedUrl);
          });
        });
      });
    });
  });
});
