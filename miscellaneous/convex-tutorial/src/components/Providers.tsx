import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { useState, type ReactNode } from "react";

function getConvexUrl() {
  if (typeof window !== "undefined") {
    return import.meta.env.VITE_CONVEX_URL || window.location.origin;
  }
  return import.meta.env.VITE_CONVEX_URL || "https://placeholder.convex.cloud";
}

export function Providers({ children }: { children: ReactNode }) {
  const [{ convex, queryClient }] = useState(() => {
    const convexUrl = getConvexUrl();
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
