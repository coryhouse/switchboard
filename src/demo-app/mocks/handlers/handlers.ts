import { RequestHandler } from "msw";
import { RequestHandlerConfig } from "../../demo-app-types";
import { getLoginHandlers } from "./login.handlers";
import { getTodoHandlers } from "./todo.handlers";
import { getUserHandlers } from "./user.handlers";

// Returns mock API request handlers.
// Accepts config for generating customizable responses in each handler.
export function requestHandlers(
  configRef: React.MutableRefObject<RequestHandlerConfig>
): RequestHandler[] {
  return [
    ...getLoginHandlers(configRef),
    ...getTodoHandlers(configRef),
    ...getUserHandlers(configRef),
  ];
}
