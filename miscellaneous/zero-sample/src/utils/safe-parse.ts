export async function safeJsonParse(request: Request) {
  return (await request.json().catch(() => null)) as unknown;
}

export async function safeTextParse(response: Response) {
  return response.text().catch(() => "");
}
