import { createRouter } from "@tanstack/react-router";
import { queryClient } from "./components/Providers";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    context: { queryClient },
    defaultPreloadStaleTime: 0,
  });

  return router;
};
