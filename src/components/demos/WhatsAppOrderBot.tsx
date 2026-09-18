import { useState } from "react";

const replies: Record<string, { body: string; time: string }> = {
  track: { body: "Order #ORD-4821 is out for delivery 📦\nExpected today by 6:00 PM.", time: "10:42 AM" },
  invoice: { body: "Done — your invoice has been resent to your email 📧", time: "10:43 AM" },
  return: { body: "No worries. I can start a return in under a minute. What is your order ID?", time: "10:44 AM" },
};

export default function WhatsAppOrderBot() {
  const [selected, setSelected] = useState("track");
  const reply = replies[selected];
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#efeae2] font-sans">
      <div className="flex h-[430px] w-[650px] flex-col overflow-hidden rounded-xl border border-[#d5cfc5] bg-[#efeae2] shadow-sm">
        <div className="flex items-center gap-3 bg-[#075e54] px-5 py-3 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9fdd3] text-sm font-bold text-[#075e54]">OA</div>
          <div><div className="text-[12px] font-semibold">Order Assistant</div><div className="text-[9px] text-white/70">online · replies instantly</div></div>
          <div className="ml-auto text-[10px] text-white/70">WhatsApp Business API</div>
        </div>
        <div className="flex-1 space-y-2 p-5 text-[11px]">
          <div className="mx-auto w-fit rounded bg-[#fff3c7] px-3 py-1 text-[9px] text-[#8b7c57]">TODAY</div>
          <div className="max-w-[290px] rounded-lg rounded-tl-none bg-white px-3 py-2 text-[#35443e] shadow-sm">Hi there 👋 I can check your order, resend an invoice, or start a return.<span className="ml-2 text-[8px] text-black/35">10:41</span></div>
          <div className="ml-auto max-w-[230px] rounded-lg rounded-tr-none bg-[#d9fdd3] px-3 py-2 text-[#35443e] shadow-sm">Can you track my order? <span className="ml-2 text-[8px] text-black/35">10:42</span></div>
          <div className="max-w-[290px] whitespace-pre-line rounded-lg rounded-tl-none bg-white px-3 py-2 text-[#35443e] shadow-sm">{reply.body}<span className="ml-2 text-[8px] text-black/35">{reply.time}</span></div>
        </div>
        <div className="border-t border-[#d5cfc5] bg-white/70 p-3"><div className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-[#6b7a73]">Try a workflow</div><div className="flex gap-2">{[["track", "📦 Track order"], ["return", "↩ Start return"], ["invoice", "🧾 Resend invoice"]].map(([key, label]) => <button key={key} onClick={() => setSelected(key)} className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold transition ${selected === key ? "border-[#128c7e] bg-[#d9fdd3] text-[#075e54]" : "border-[#c9d2cd] bg-white text-[#53615b] hover:border-[#128c7e]"}`}>{label}</button>)}</div></div>
      </div>
    </div>
  );
}
