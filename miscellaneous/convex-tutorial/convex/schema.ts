import { api, internal } from "./_generated/api";
import { internalAction, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: { user: v.string(), body: v.string() },
  handler: async ({ db, scheduler }, { user, body }) => {
    await db.insert("messages", { body, user });

    if (body.startsWith("/wiki")) {
      const topic = body.slice(body.indexOf(" ") + 1);
      await scheduler.runAfter(0, internal.chat.getWikipediaSummary, {
        topic,
      });
    }
  },
});

export const getMessages = query({
  args: {},
  handler: async ({ db }) => {
    const messages = await db.query("messages").order("desc").take(50);
    return messages.reverse();
  },
});

export const getWikipediaSummary = internalAction({
  args: { topic: v.string() },
  handler: async ({ scheduler }, { topic }) => {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURIComponent(topic)}`,
    );

    const summary = getSummaryFromJSON(await response.json());
    await scheduler.runAfter(0, api.chat.sendMessage, {
      body: summary,
      user: "Wikipedia",
    });
  },
});

function getSummaryFromJSON(data: any) {
  const firstPageId = Object.keys(data.query.pages)[0];
  return data.query.pages[firstPageId].extract;
}
