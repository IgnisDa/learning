import { Queue, QueueOptions } from "bullmq";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("REDIS_URL is required");
}

const connection = {
  url: REDIS_URL,
};

const defaultJobOptions: QueueOptions["defaultJobOptions"] = {
  attempts: 3,
  removeOnFail: { age: 7 * 24 * 3600 },
  backoff: { delay: 1000, type: "exponential" },
  removeOnComplete: { count: 1000, age: 24 * 3600 },
};

export const tmdbEnrichQueue = new Queue("tmdb.enrich_show", {
  connection,
  defaultJobOptions,
});

export type TmdbEnrichJobData = {
  showId: string;
  tmdbId: number;
};
