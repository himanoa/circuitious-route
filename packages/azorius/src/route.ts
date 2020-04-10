import { Handler } from "./handler";

export type Route = {
  matcher: RegExp;
  handler: Handler;
};
