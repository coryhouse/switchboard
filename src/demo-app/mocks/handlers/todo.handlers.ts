import { getRandomNumberBelow } from "../../../utils/number-utils";
import { http } from "msw";
import { Todo } from "../../demo-app-types";
import { getCustomResponseSettings, getUser } from "../mock-utils";
import { z } from "zod";

export const todoHandlers = [
  http.get("/todos", async () => {
    const setting = await getCustomResponseSettings("GET /todos");
    const user = getUser();
    if (!user)
      return new Response(null, {
        status: 401,
      });

    return new Response(
      setting?.response ?? JSON.stringify(user.response.todos),
      {
        status: setting?.status ?? 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }),

  http.post("/todo", async ({ request }) => {
    const todoResponseSchema = z.object({
      todo: z.string(),
    });
    const { todo } = todoResponseSchema.parse(await request.json());
    const user = getUser();
    if (!user)
      return new Response(null, {
        status: 401,
      });
    const defaultResp: Todo = {
      // TODO: Read the todos from memory so the reduce call below works.
      // They're in Todos.tsx's state, so how can we access them?
      // const maxTodoId = user.todos.reduce((max, t) => Math.max(max, t.id), 0);
      id: getRandomNumberBelow(100000),
      completed: false,
      todo,
    };

    const setting = await getCustomResponseSettings("POST /todo");
    return new Response(setting?.response ?? JSON.stringify(defaultResp), {
      status: setting?.status ?? 200,
      headers: { "Content-Type": "application/json" },
    });
  }),

  http.put("/todo/:id", async () => {
    const setting = await getCustomResponseSettings("PUT /todo/:id");
    return new Response(setting?.response ?? "", {
      status: setting?.status ?? 200,
    });
  }),

  http.delete("/todo/:id", async () => {
    const setting = await getCustomResponseSettings("DELETE /todo/:id");
    return new Response(setting?.response ?? "", {
      status: setting?.status ?? 200,
    });
  }),
];
