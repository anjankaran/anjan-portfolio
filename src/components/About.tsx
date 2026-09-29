import Reveal from "./Reveal";
import { timeline } from "../data/content";

export default function About() {
  return (
    <section id="about" className="px-2 py-6">
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="relative min-h-[610px] overflow-hidden rounded-[22px] border border-black/10 bg-black shadow-md shadow-black/10">
          <img
            src="/assets/anjan.png"
            alt="Anjan Karan"
            className="absolute inset-0 h-full w-full object-contain object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102519] via-[#102519]/65 to-transparent" />
          <div className="relative z-10 flex min-h-[610px] flex-col justify-end p-7">
            <h2 className="text-[26px] font-bold leading-tight tracking-tight text-white">
              I turn manual processes into systems that run on their own.
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-white/75">
              I build full-stack products, AI-driven automations and Zoho solutions that make work
              feel simpler. I start with a clear data model, then connect the API, interface and
              automation layer into one dependable system — so teams spend less time copying data
              between tools and more time moving the business forward.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="rounded-[22px] border border-ink/10 bg-white p-7 shadow-sm shadow-black/5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lime">Career path</span>
              <h3 className="mt-1 text-[18px] font-bold text-fg/85">Journey</h3>
            </div>
            <span className="rounded-xl border border-lime/20 bg-lime/10 px-2.5 py-1 font-mono text-[10px] text-lime">
              6+ years
            </span>
          </div>
          <div className="relative mt-6 pl-8">
            <span className="absolute bottom-2 left-[9px] top-2 w-px bg-gradient-to-b from-lime/70 via-lime/30 to-transparent" />
            {timeline.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.08} className="relative pb-5 last:pb-0">
                <span className="absolute -left-8 top-0 flex h-5 w-5 items-center justify-center rounded-full border-4 border-white bg-lime shadow-[0_0_0_1px_rgba(79,154,42,0.25)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <div className="flex h-5 items-center">
                  <span className="font-mono text-[11px] font-semibold text-lime">{t.year}</span>
                </div>
                <div className="mt-2 rounded-2xl border border-ink/8 bg-panel-2/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-lime/30 hover:bg-lime/5">
                  <b className="mt-1 block text-[14px] font-bold text-fg/85">{t.title}</b>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-fg/60">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
