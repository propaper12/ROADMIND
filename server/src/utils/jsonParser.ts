export function extractJsonObject(text: string): string {
  let s = text.trim();
  const fence = /^```(?:json)?\s*\n?([\s\S]*?)\n?```$/im;
  const m = s.match(fence);
  if (m?.[1]) {
    s = m[1].trim();
  } else if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "").trim();
  }
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    s = s.slice(start, end + 1);
  }
  return s;
}

export function safeJsonParse(text: string): unknown | null {
  try {
    const extracted = extractJsonObject(text);
    return JSON.parse(extracted) as unknown;
  } catch {
    return null;
  }
}
