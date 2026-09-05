import { motion } from "framer-motion";
import { Server, Terminal, Workflow } from "lucide-react";
import Reveal from "./Reveal";
import { timeline } from "../data/content";

export default function About() {
  return (
    <section id="about" className="px-2 py-6">
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="rounded-[22px] border border-black/10 bg-gradient-to-br from-[#173a27] to-panel-3 p-7 shadow-md shadow-black/10">
          <div className="flex gap-3">
            {[Server, Terminal, Workflow].map((Icon, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-lime/25 bg-lime/10 text-lime-light"
              >
                <Icon size={18} />
              </motion.span>
            ))}
          </div>
          <h2 className="mt-6 text-[26px] font-bold leading-tight tracking-tight text-white">
            I turn manual processes into systems that run on their own.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-white/65">
            Anjan Karan is a full stack developer specializing in AI-driven automation and the
            Zoho ecosystem. He designs the data model first, then builds the API, the UI and the
            automation layer around it — so businesses stop copy-pasting between tools and start
            trusting a single source of truth.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="rounded-[22px] border border-ink/10 bg-white p-7 shadow-sm shadow-black/5">
          <h3 className="text-[15px] font-bold text-fg/85">Journey</h3>
          <div className="mt-5 space-y-5">
            {timeline.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.08}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-lime" />
                    {i < timeline.length - 1 && <span className="mt-1 w-px flex-1 bg-ink/10" />}
                  </div>
                  <div className="pb-1">
                    <span className="font-mono text-[11px] text-lime">{t.year}</span>
                    <b className="mt-1 block text-[14px] font-bold">{t.title}</b>
                    <p className="mt-1 text-[13px] leading-relaxed text-fg/60">{t.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
