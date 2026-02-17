import { getSession } from "../auth";

export async function requireAuth(request: Request) {
  return await getSession(request);
}
