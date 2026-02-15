import appCss from "@/styles/index.css?url";
import { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  shellComponent: RootDocument,
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
    meta: [
      { charSet: "utf-8" },
      { title: "Electric SQL Tutorial" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  }),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Scripts />
      </body>
    </html>
  );
}
