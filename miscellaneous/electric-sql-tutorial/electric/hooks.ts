import { useEffect, useState } from "react";
import { createShapeStream, type ShapeStream, type Row } from "./client";

interface UseShapeOptions {
  table: string;
  where?: string;
  columns?: string[];
}

interface ShapeData<T> {
  data: T[];
  isLoading: boolean;
  error: Error | null;
}

export function useShape<T extends Row<unknown> = Row<unknown>>(
  options: UseShapeOptions
): ShapeData<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let stream: ShapeStream<T> | null = null;
    let isMounted = true;

    async function setupStream() {
      try {
        stream = createShapeStream<T>(options);

        // Subscribe to changes
        stream.subscribe((messages) => {
          if (!isMounted) return;

          // Process messages and update local state
          const newData: T[] = [];

          for (const message of messages) {
            // Check if message is a ChangeMessage (has value property)
            if ('value' in message && message.value) {
              newData.push(message.value);
            }
          }

          setData(newData);
          setIsLoading(false);
        });
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to setup stream"),
          );
          setIsLoading(false);
        }
      }
    }

    setupStream();

    return () => {
      isMounted = false;
      if (stream) {
        stream.unsubscribeAll();
      }
    };
  }, [options.table, options.where, options.columns?.join(",")]);

  return { data, isLoading, error };
}
