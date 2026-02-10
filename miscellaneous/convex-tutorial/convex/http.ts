import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/",
  method: "GET",
  handler: httpAction(async (_ctx, request) => {
    return new Response(`Hello from ${request.url}`);
  }),
});

export default http;
