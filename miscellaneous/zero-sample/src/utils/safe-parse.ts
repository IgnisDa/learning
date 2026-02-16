export async function safeJsonParse(request: Request): Promise<unknown> {
  return request.json().catch(() => null);
}

export async function safeTextParse(response: Response): Promise<string> {
  return response.text().catch(() => "");
}
