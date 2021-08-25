export function checkPropertiesExists(obj: Record<string, unknown>) {
  for (const key in obj) {
    if (obj[key] !== null && obj[key] != '') return false;
  }
  return true;
}
