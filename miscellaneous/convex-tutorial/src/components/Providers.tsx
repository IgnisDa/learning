import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [{ convex, queryClient }] = useState(() => {
    const convexUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    const convex = new ConvexReactClient(convexUrl);
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
    return { convex, queryClient };
  });

  return (
    <ConvexAuthProvider client={convex}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexAuthProvider>
  );
}
