import { Queue, type QueueOptions } from "bullmq";
import { redisConnection } from "./redis";

const defaultJobOptions = {
  attempts: 3,
  removeOnFail: { age: 7 * 24 * 3600 },
  backoff: { delay: 1000, type: "exponential" },
  removeOnComplete: { count: 1000, age: 24 * 3600 },
} satisfies QueueOptions["defaultJobOptions"];

export const tmdbEnrichQueue = new Queue("tmdb.enrich_show", {
  defaultJobOptions,
  connection: redisConnection,
});

export type TmdbEnrichJobData = { showId: string; tmdbId: number };
