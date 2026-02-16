export function dateInputToMs(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const ms = Date.parse(`${trimmed}T00:00:00`);
  return Number.isNaN(ms) ? null : ms;
}

export function toDateInputValue(value: number | null): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatMsDate(value: number | null): string {
  if (!value) {
    return "Not set";
  }
  return new Date(value).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
