import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const convexClient = new ConvexReactClient(
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000",
  );
  const convexQueryClient = new ConvexQueryClient(convexClient);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: convexQueryClient.queryFn(),
        queryKeyHashFn: convexQueryClient.hashFn(),
      },
    },
  });
  convexQueryClient.connect(queryClient);
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { queryClient, convexClient, convexQueryClient },
    Wrap: ({ children }) => (
      <ConvexProvider client={convexQueryClient.convexClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ConvexProvider>
    ),
  });

  return router;
};
