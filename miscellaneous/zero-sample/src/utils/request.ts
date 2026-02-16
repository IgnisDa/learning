export function getSecureFlag(request: Request): boolean {
  return new URL(request.url).protocol === "https:";
}
