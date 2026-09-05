import type { ChatEntry } from "../data/content";

// Tiny rule-based matcher — keyword overlap scoring, no external API.
// Good enough for an on-site demo without needing a backend or API key.
export function getAgentReply(input: string, knowledgeBase: ChatEntry[], fallback: string): string {
  const text = input.toLowerCase();

  let best: { score: number; reply: string } | null = null;

  for (const entry of knowledgeBase) {
    const score = entry.keywords.reduce(
      (acc, kw) => (text.includes(kw.toLowerCase()) ? acc + kw.length : acc),
      0,
    );
    if (score > 0 && (!best || score > best.score)) {
      best = { score, reply: entry.reply };
    }
  }

  return best?.reply ?? fallback;
}

export function agentTypingDelay(reply: string): number {
  const base = 350;
  const perChar = 8;
  return Math.min(base + reply.length * perChar, 1600);
}
