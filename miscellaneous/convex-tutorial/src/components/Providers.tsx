import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { useState, type ReactNode } from "react";

const convex = new ConvexReactClient("http://localhost:3000");
const convexQueryClient = new ConvexQueryClient(convex);
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: convexQueryClient.queryFn(),
      queryKeyHashFn: convexQueryClient.hashFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

export function Providers({ children }: { children: ReactNode }) {
  const [convex] = useState(() => {
    const convex = new ConvexReactClient(
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000",
    );
    return convex;
  });

  return (
    <ConvexAuthProvider client={convex}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexAuthProvider>
  );
}
