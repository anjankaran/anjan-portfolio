import Reveal from "./Reveal";
import { stack } from "../data/content";

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...stack, ...stack];
  return (
    <div
      className={`flex w-max gap-3 ${reverse ? "animate-marquee-slow" : "animate-marquee"}`}
      style={reverse ? { animationDirection: "reverse" } : undefined}
    >
      {items.map((t, i) => (
        <span
          key={`${t.label}-${i}`}
          className={`whitespace-nowrap rounded-full border px-5 py-2.5 font-mono text-[13px] shadow-sm shadow-black/5 ${
            t.featured
              ? "border-lime bg-lime text-panel-3"
              : "border-ink/10 bg-white text-fg/80"
          }`}
        >
          {t.label}
        </span>
      ))}
    </div>
  );
}

export default function Stack() {
  return (
    <section id="stack" className="relative z-20 px-2 py-6">
      <div className="overflow-hidden rounded-[22px] border border-ink/10 bg-panel-2 py-6">
        <Reveal className="mb-4 flex items-baseline justify-between px-6 sm:px-7">
          <h2 className="text-[19px] font-bold tracking-tight">Stack</h2>
          <span className="text-xs text-fg/50">Daily drivers</span>
        </Reveal>

        <div className="marquee-pause flex flex-col gap-3">
          <div className="overflow-hidden">
            <Row />
          </div>
          <div className="overflow-hidden">
            <Row reverse />
          </div>
        </div>
      </div>
    </section>
  );
}
