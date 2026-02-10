import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { Providers } from "@/components/Providers";
import appCss from "@/styles/index.css?url";

export const Route = createRootRoute({
  shellComponent: RootDocument,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Convex Tutorial" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Scripts />
      </body>
    </html>
  );
}
