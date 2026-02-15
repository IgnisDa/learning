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

http.route({
  path: "/.well-known/jwks.json",
  method: "GET",
  handler: httpAction(async () => {
    const jwks = process.env.JWKS;
    if (!jwks) {
      return new Response("JWKS not configured", { status: 500 });
    }
    return new Response(jwks, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }),
});

export default http;
