import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronDown, X } from "lucide-react";
import ChatPanel from "./ChatPanel";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-3 w-[92vw] max-w-[360px] overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-2xl shadow-black/15"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime/15 text-lime">
                  <Bot size={16} />
                </span>
                <div className="leading-tight">
                  <b className="block text-[13px] font-bold">Portfolio Agent</b>
                  <span className="flex items-center gap-1.5 text-[11px] text-fg/50">
                    <span className="h-1.5 w-1.5 animate-blink rounded-full bg-lime" /> online
                  </span>
                </div>
              </div>
              <button
                aria-label="Minimize chat"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-fg/50 hover:bg-ink/5 hover:text-fg"
              >
                <ChevronDown size={18} />
              </button>
            </div>
            <ChatPanel compact />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle AI agent chat"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-panel-3 shadow-xl shadow-lime/20"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X size={20} /> : <Bot size={22} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
