import { z } from "zod";

export type WatchStatus =
  | "plan_to_watch"
  | "watching"
  | "completed"
  | "on_hold"
  | "dropped";

export const watchStatusSchema = z.enum([
  "plan_to_watch",
  "watching",
  "completed",
  "on_hold",
  "dropped",
]);

export const WATCH_STATUS_OPTIONS: Array<{
  label: string;
  value: WatchStatus;
}> = [
  { label: "Plan to watch", value: "plan_to_watch" },
  { label: "Watching", value: "watching" },
  { label: "Completed", value: "completed" },
  { label: "On hold", value: "on_hold" },
  { label: "Dropped", value: "dropped" },
];
