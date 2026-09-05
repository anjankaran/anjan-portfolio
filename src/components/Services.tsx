import Reveal from "./Reveal";
import { services, type Service } from "../data/content";

function Row({ items, reverse = false }: { items: Service[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className="flex w-max gap-4 animate-marquee-cards"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {loop.map((s, i) => (
          <div
            key={`${s.id}-${i}`}
            className={`w-[260px] shrink-0 rounded-2xl border p-5 sm:w-[300px] ${
              s.highlight
                ? "border-lime/25 bg-gradient-to-br from-lime-light to-white"
                : "border-ink/10 bg-panel-2"
            }`}
          >
            <div className="font-mono text-[11px] text-lime">{s.id}</div>
            <b className="mt-3 block text-[16px] font-bold">{s.title}</b>
            <p className="mt-2 text-[13px] leading-relaxed text-fg/65">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Services() {
  const half = Math.ceil(services.length / 2);
  const rowTop = services.slice(0, half);
  const rowBottom = services.slice(half);

  return (
    <section id="services" className="px-2 py-6">
      <div className="overflow-hidden rounded-[22px] border border-ink/10 bg-white p-6 shadow-sm shadow-black/5 sm:p-7">
        <Reveal className="mb-5 flex items-baseline justify-between gap-4">
          <h2 className="text-[19px] font-bold tracking-tight">What I Build</h2>
          <a href="#work" className="text-xs text-fg/55 hover:text-lime">
            See case studies →
          </a>
        </Reveal>

        <div className="marquee-pause flex flex-col gap-4">
          <Row items={rowTop} />
          <Row items={rowBottom} reverse />
        </div>
      </div>
    </section>
  );
}
