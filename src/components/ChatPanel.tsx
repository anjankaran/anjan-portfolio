import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, User } from "lucide-react";
import { portfolioFallback, portfolioGreeting, portfolioKnowledgeBase, portfolioSuggestions, profile } from "../data/content";
import { agentTypingDelay, getAgentReply } from "../lib/agent";

type Message = { id: number; role: "agent" | "user"; text: string };

let idSeq = 1;

const initialMessages: Message[] = [
  { id: idSeq++, role: "agent", text: portfolioGreeting(profile.name.split(" ")[0]) },
];

export default function ChatPanel({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(raw: string) {
    const text = raw.trim();
    if (!text || typing) return;

    const userMsg: Message = { id: idSeq++, role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    const reply = getAgentReply(text, portfolioKnowledgeBase, portfolioFallback);
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: idSeq++, role: "agent", text: reply }]);
      setTyping(false);
    }, agentTypingDelay(reply));
  }

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        className={`flex-1 space-y-3 overflow-y-auto px-4 py-4 ${compact ? "max-h-[360px]" : "max-h-[420px]"}`}
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-end gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  m.role === "agent" ? "bg-lime/15 text-lime" : "bg-ink/8 text-fg/70"
                }`}
              >
                {m.role === "agent" ? <Bot size={14} /> : <User size={14} />}
              </span>
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "agent"
                    ? "rounded-bl-sm border border-ink/10 bg-panel-2 text-fg/90"
                    : "rounded-br-sm bg-lime text-panel-3"
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime/15 text-lime">
              <Bot size={14} />
            </span>
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-ink/10 bg-panel-2 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-fg/50"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {messages.length < 3 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {portfolioSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] text-fg/70 shadow-sm shadow-black/5 hover:border-lime/40 hover:text-lime"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-ink/10 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about my stack, Zoho work, availability…"
          className="flex-1 rounded-full border border-ink/10 bg-panel-2 px-4 py-2.5 text-[13px] text-fg placeholder:text-fg/40 outline-none focus:border-lime/40"
        />
        <button
          type="submit"
          aria-label="Send"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime text-panel-3 transition-transform hover:scale-105 disabled:opacity-40"
          disabled={!input.trim() || typing}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
