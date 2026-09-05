import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCheck, MoreVertical, Paperclip, Send, Smile } from "lucide-react";
import { waFallback, waGreeting, waKnowledgeBase, waSuggestions, waBotName, waBotSubtitle } from "../data/content";
import { agentTypingDelay, getAgentReply } from "../lib/agent";

type Message = { id: number; role: "bot" | "user"; text: string; time: string };

let idSeq = 1;

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function makeInitialMessages(): Message[] {
  return [{ id: idSeq++, role: "bot", text: waGreeting, time: timeNow() }];
}

// The "AI Agent" section's project showcase: a simulated WhatsApp Business
// order bot, styled with our own palette (not WhatsApp's brand colors).
export default function WhatsAppChatPanel() {
  const [messages, setMessages] = useState<Message[]>(makeInitialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(raw: string) {
    const text = raw.trim();
    if (!text || typing) return;

    setMessages((m) => [...m, { id: idSeq++, role: "user", text, time: timeNow() }]);
    setInput("");
    setTyping(true);

    const reply = getAgentReply(text, waKnowledgeBase, waFallback);
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: idSeq++, role: "bot", text: reply, time: timeNow() }]);
      setTyping(false);
    }, agentTypingDelay(reply));
  }

  return (
    <div className="flex h-full flex-col">
      {/* WhatsApp-style header, themed with our own green */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-[#123021] via-[#0e2418] to-[#0a1d14] px-4 py-3 text-white">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-base">
          🤖
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <b className="block truncate text-[14px] font-semibold">{waBotName}</b>
          <span className="block truncate text-[11px] text-white/70">
            {typing ? "typing…" : waBotSubtitle}
          </span>
        </div>
        <div className="flex items-center text-white/80">
          <MoreVertical size={17} />
        </div>
      </div>

      {/* chat wallpaper */}
      <div
        ref={scrollRef}
        className="max-h-[460px] flex-1 space-y-2 overflow-y-auto bg-panel-2 px-3 py-4"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12px 12px, rgba(14,36,24,0.05) 1.4px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] whitespace-pre-line px-3 py-2 text-[13.5px] leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "rounded-2xl rounded-tr-sm bg-lime-light text-fg"
                    : "rounded-2xl rounded-tl-sm bg-white text-fg"
                }`}
              >
                {m.text}
                <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-fg/45">
                  {m.time}
                  {m.role === "user" && <CheckCheck size={13} className="text-lime" />}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-fg/40"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {messages.length < 3 && (
        <div className="flex flex-wrap gap-2 bg-panel-2 px-3 pb-2.5">
          {waSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-lime/30 bg-white px-3 py-1.5 text-[11.5px] font-medium text-lime shadow-sm hover:bg-lime-light"
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
        className="flex items-center gap-2 border-t border-ink/10 bg-white p-2.5"
      >
        <div className="flex flex-1 items-center gap-2 rounded-full bg-panel-2 px-3.5 py-2.5">
          <Smile size={18} className="shrink-0 text-fg/45" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            className="flex-1 bg-transparent text-[13.5px] text-fg placeholder:text-fg/40 outline-none"
          />
          <Paperclip size={17} className="shrink-0 text-fg/45" />
        </div>
        <button
          type="submit"
          aria-label="Send"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime text-panel-3 transition-transform hover:scale-105 disabled:opacity-40"
          disabled={!input.trim() || typing}
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
