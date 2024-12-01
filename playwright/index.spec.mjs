import { test, expect } from "@playwright/test";

const secretInformation = /my favourite colour is /i;
const correctPassword = "myPassword1!";
const incorrectPassword = "some_incorrect_password";

test.beforeEach(async ({ page }) => {
  // Waiting for `commit` instead of `load` as if script runs first, it will
  // likely block and so the `load` event may not fire until after the script has already blocked and completed.
  await page.goto("/", { waitUntil: "commit" });
});

test("when password has been entered correctly on the first try", async ({ page }) => {
  // Using blocks to limit lifetime of temporary variables.
  {
    // Enter correct password into next prompt.
    // The promise chain is delegated to Playwright, so that it can provide a meaningful failure message if any part of the chain rejects.
    const promise = page
      .waitForEvent("dialog", {
        timeout: 1_000,
        predicate: async (dialog) => dialog.type() === "prompt" || (await dialog.dismiss(), false),
      })
      .then((prompt) => prompt.accept(correctPassword));
    await expect(promise, "should prompt user for password").resolves.toBeUndefined();
  }

  {
    const promise = page.waitForEvent("dialog", {
      timeout: 1_000,
      predicate: async (dialog) => dialog.type() === "alert" || (await dialog.dismiss(), false),
    });
    await expect(
      promise,
      "should display secret info via alert after correct password has been entered"
    ).resolves.toBeDefined();

    // Awaiting same promise twice, but should be ok. Promise must have fulfilled, otherwise above lines
    // would reject.
    const alert = await promise;
    expect(alert.message(), "alert message should match secret information").toMatch(
      secretInformation
    );
    await alert.dismiss();
  }

  {
    // Haven't found a way with Playwright to assert that "no further prompt appears".
    // Instead just waiting for next prompt and asserting that the operation times out
    // and the promise rejects.
    const promise = page.waitForEvent("dialog", {
      timeout: 1_000,
      predicate: async (dialog) => dialog.type() === "prompt" || (await dialog.dismiss(), false),
    });

    await expect(
      promise,
      "should not display any further prompts once correct password has been entered"
    ).rejects.toThrowError(/timeout \d+ms exceeded while waiting for event "dialog"/i);
  }
});

test("when password is entered incorrectly three times", async ({ page }) => {
  for (let attempt = 1; attempt <= 3; attempt++) {
    {
      const promise = page
        .waitForEvent("dialog", {
          timeout: 1_000,
          predicate: async (dialog) => {
            if (dialog.type() === "prompt") {
              return true;
            } else if (dialog.type() === "alert") {
              expect(dialog.message()).not.toMatch(secretInformation);
            }
            await dialog.dismiss();
            return false;
          },
        })
        .then((dialog) => dialog.accept(incorrectPassword));

      await expect(
        promise,
        `should prompt user for password (attempt #${attempt})`
      ).resolves.toBeUndefined();
    }
  }

  {
    const promise = page.waitForEvent("dialog", {
      timeout: 1_000,
      predicate: async (dialog) => dialog.type() === "prompt" || (await dialog.dismiss(), false),
    });

    await expect(
      promise,
      "should not display any further prompts after three incorrect passwords"
    ).rejects.toThrowError(/timeout \d+ms exceeded while waiting for event "dialog"/i);
  }
});
