export function formatWatchStatus(status: string | null | undefined): string {
  if (!status) return "Plan to watch";
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
