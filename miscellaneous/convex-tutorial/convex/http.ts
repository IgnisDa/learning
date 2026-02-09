import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/",
  method: "GET",
  handler: httpAction(async (_ctx, request) => {
    return new Response(`Hello from ${request.url}`);
  }),
});

export default http;
