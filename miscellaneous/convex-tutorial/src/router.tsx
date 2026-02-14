import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ConvexReactClient } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";

export const getRouter = () => {
  const convex = new ConvexReactClient(
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000",
  );
  const convexQueryClient = new ConvexQueryClient(convex);
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
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: { queryClient, convex },
  });

  return router;
};
