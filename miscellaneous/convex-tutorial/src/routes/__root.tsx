import appCss from "@/styles/index.css?url";
import { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router";
import { ConvexReactClient } from "convex/react";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
}>()({
  shellComponent: RootDocument,
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
    meta: [
      { charSet: "utf-8" },
      { title: "Convex Tutorial" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  }),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const context = useRouteContext({ from: Route.id });

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
