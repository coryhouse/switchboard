import test, { expect, Page } from "@playwright/test";
import * as personas from "../src/demo-app/mocks/data/personas.mocks";
import { buildUrl } from "./test-utils";

test.describe("log in / log out", () => {
  test("logs the user in successfully via the form, and logs the user out via the logout link", async ({
    page,
  }) => {
    await page.goto("/", {});

    const { email, password, id } = personas.noTodos.response;

    // The DevTools persona selector should initially reflect that the user is logged out.
    await expect(page.getByLabel("Persona")).toHaveValue("");

    await page.getByText("Email").fill(email);
    await page.getByText("Password").fill(password);
    await page.getByRole("button", { name: "Log In" }).click();
    await expect(page.getByRole("heading", { name: /Hi Cory/ })).toBeVisible();

    // The DevTools persona selector should now reflect that the user is logged in.
    await expect(page.getByLabel("Persona")).toHaveValue(id.toString());

    await page.getByRole("link", { name: "Logout" }).click({ force: true });
    // Now should be back on login page.
    await expect(page.getByRole("heading", { name: "Log In" })).toBeVisible();

    // And the DevTools persona selector should reflect that the user is logged out.
    await expect(page.getByLabel("Persona")).toHaveValue("");
  });
});

test.describe("new user", () => {
  test("shows a welcome message, supports adding a todo, and hides the delete feature", async ({
    page,
  }) => {
    page.goto(
      buildUrl("/", {
        userId: personas.noTodos.id,
        delay: 250, // just long enough that we can check for the loading indicator
      })
    );
    page.getByText("Welcome! Start entering your todos below.");

    await addTodo(page, "Write more tests");
    await toggleComplete(page, "Write more tests");

    // The delete button shouldn't display because the noTodos user doesn't have delete rights.
    await expect(page.getByText("Delete Write more tests")).not.toBeVisible();
  });
});

test.describe("existing admin user", () => {
  test("shows existing todos on initial load, supports adding a todo, toggling complete, and deleting the todo", async ({
    page,
  }) => {
    // Load Elon with 50ms delay
    page.goto(
      buildUrl("/", {
        userId: personas.manyTodos.id,
        delay: 50,
      })
    );

    // First, assure existing todos display
    await isInSection(page, "Stuff to do", "Ship Model S");

    await addTodo(page, "Write more tests");
    await toggleComplete(page, "Write more tests");

    // Now delete the todo added above
    await page.getByRole("button", { name: "Delete Write more tests" }).click();
    // await expect(page.getByText("Deleting...")).toBeVisible();
    await expect(page.getByText("Write more tests")).not.toBeVisible();
    await expect(page.getByText("Todo deleted")).toBeVisible();
  });
});

test.describe("when marking a todo complete", () => {
  test("times out the request and throws an error if the call takes longer than 2 seconds", async ({
    page,
  }) => {
    page.goto(
      buildUrl("/", {
        userId: personas.manyTodos.id,
        customResponses: [
          {
            delay: 2100,
            handler: "PUT /todo/:id",
          },
        ],
      })
    );

    await page.getByText("Ship Cybertruck").click();
    await expect(page.getByText("Toggling...")).toBeVisible();
    await expect(page.getByText("Toggling the todo failed.")).toBeVisible(); // Should show an error message after the timeout is reached.
  });
});

test.describe("when adding a todo", () => {
  test("shows a loading status while the todo toggle is in progress, and hides the loading status when done before the timeout", () => {
    // Note that this visits a URL with a short loading delay set via the URL
  });
});

// Helper functions used by the tests above.
// ------------------------------------------

// Use parent to search within the heading's <section>
async function isInSection(page: Page, headingText: string, text: string) {
  const heading = page.getByRole("heading", { name: headingText });
  await expect(heading).toBeVisible();
  const section = page.locator("section").filter({ has: heading });
  await expect(section.getByText(text)).toBeVisible();
}

async function addTodo(page: Page, todo: string) {
  const todoInput = page.getByLabel("Task");
  await expect(todoInput).toBeVisible();
  await expect(todoInput).toHaveValue("");
  await todoInput.fill(todo);
  await page.getByRole("button", { name: "Add", exact: true }).click();

  // Should show a loading toast while adding
  // await expect(page.getByText("Adding...")).toBeVisible();

  // New todo should display
  isInSection(page, "Stuff to do", todo);

  // Input should be cleared after submission
  await expect(page.getByText("Task")).toHaveValue("");
}

async function toggleComplete(page: Page, todo: string) {
  // Mark complete and assure it's marked with a line through
  await page.getByText(todo).click();
  await expect(page.getByText(todo)).toHaveClass(/line-through/);

  // Mark incomplete and assure line-through is removed.
  await page.getByText(todo).click();
  await expect(page.getByText(todo)).not.toHaveClass(/line-through/);
}
