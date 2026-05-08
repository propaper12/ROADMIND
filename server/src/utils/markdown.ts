export function escapeMarkdown(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
}

export function bulletList(items: string[]): string {
  return items.map((i) => `- ${escapeMarkdown(i)}`).join("\n");
}
