export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN;
if (!RAILWAY_TOKEN) throw new Error("Missing Railway token");
export const RAILWAY_PROJECT_ID = process.env.RAILWAY_PROJECT_ID;
if (!RAILWAY_PROJECT_ID) throw new Error("Missing Railway Project ID");

export const RAILWAY_API_URL =
  process.env.RAILWAY_API_URL || "https://backboard.railway.app/graphql/v2";

export const headers = {
  headers: { Authorization: `Bearer ${RAILWAY_TOKEN}` },
};
