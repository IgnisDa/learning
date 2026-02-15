import * as cookie from "cookie";

export interface CookieOptions {
  days?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  const {
    days = 30,
    path = "/",
    sameSite = "lax",
    secure = typeof window !== "undefined" &&
      window.location.protocol === "https:",
  } = options;

  const maxAge = days ? days * 24 * 60 * 60 : undefined;

  const serialized = cookie.serialize(name, value, {
    path,
    secure,
    maxAge,
    sameSite,
  });

  if (typeof document !== "undefined") document.cookie = serialized;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const cookies = cookie.parseCookie(document.cookie);
  return cookies[name] || null;
}

export function removeCookie(name: string, path: string = "/"): void {
  setCookie(name, "", { days: -1, path });
}
