import { Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import WhatsAppChatPanel from "./WhatsAppChatPanel";

export default function AgentSection() {
  return (
    <section id="agent" className="px-2 py-6">
      <Reveal className="overflow-hidden rounded-[22px] border border-ink/10 bg-white shadow-sm shadow-black/5">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-7 sm:p-9">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime-light px-3 py-1.5 text-[11px] font-semibold text-lime">
              <Sparkles size={12} /> Live demo
            </span>
            <h2 className="mt-4 text-[26px] font-bold leading-tight tracking-tight">
              See a WhatsApp order bot in action
            </h2>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-fg/65">
              A working example of the WhatsApp Business automations I build for e-commerce and
              D2C brands — in production these connect to live order data via Zoho/APIs and reply
              instantly to status, return and invoice requests.
            </p>
            <ul className="mt-6 space-y-2.5 text-[13px] text-fg/60">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" /> This demo runs in your browser — production bots run on a backend + WhatsApp Business API
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" /> Same conversational flow used in real client bots
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" /> Try a quick reply below, or type your own message
              </li>
            </ul>
          </div>
          <div className="border-t border-ink/10 bg-panel-2 lg:border-l lg:border-t-0">
            <WhatsAppChatPanel />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
