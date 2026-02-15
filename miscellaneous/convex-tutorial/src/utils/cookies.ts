export interface CookieOptions {
  days?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {},
): void {
  const {
    days = 30,
    path = "/",
    sameSite = "Lax",
    secure = window.location.protocol === "https:",
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  cookieString += `; path=${path}`;

  if (secure) cookieString += "; secure";

  cookieString += `; SameSite=${sameSite}`;

  document.cookie = cookieString;
}

export function getCookie(name: string): string | null {
  const nameEQ = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0)
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
  }

  return null;
}

export function removeCookie(name: string, path: string = "/"): void {
  setCookie(name, "", { days: -1, path });
}
