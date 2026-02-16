export function getSecureFlag(request: Request) {
  return new URL(request.url).protocol === "https:";
}
