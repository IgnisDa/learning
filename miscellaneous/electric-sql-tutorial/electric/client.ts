import { ShapeStream, type Row } from "@electric-sql/client";

const ELECTRIC_URL =
  import.meta.env.VITE_ELECTRIC_URL || "http://localhost:5133";

export interface ElectricConfig {
  url: string;
}

export function getElectricUrl(): string {
  return ELECTRIC_URL;
}

// Helper to create a shape stream for a table
export function createShapeStream<T extends Row<unknown> = Row<unknown>>(params: {
  table: string;
  where?: string;
  columns?: string[];
}) {
  const baseUrl = `${ELECTRIC_URL}/v1/shape`;
  
  // Build URL with query parameters
  const url = new URL(baseUrl);
  url.searchParams.set('table', params.table);
  if (params.where) {
    url.searchParams.set('where', params.where);
  }
  if (params.columns) {
    url.searchParams.set('columns', params.columns.join(','));
  }

  return new ShapeStream<T>({
    url: url.toString(),
  });
}

export { ShapeStream };
export type { Row };
