import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import { services, type Service } from "../data/content";

function Row({ items, reverse = false }: { items: Service[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const hoverRef = useRef(false);
  const velocityRef = useRef(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;

      const track = trackRef.current;
      const halfWidth = track ? track.scrollWidth / 2 : 0;
      const autoSpeed = reverse ? 0.018 : -0.018;
      const speed = hoverRef.current ? velocityRef.current : autoSpeed;

      if (halfWidth > 0) {
        if (!initializedRef.current) {
          xRef.current = reverse ? -halfWidth : 0;
          initializedRef.current = true;
        }
        xRef.current += speed * dt;
        while (xRef.current <= -halfWidth) xRef.current += halfWidth;
        while (xRef.current > 0) xRef.current -= halfWidth;
        if (track) track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reverse]);

  function updateMouseVelocity(clientX: number, left: number, width: number) {
    const ratio = (clientX - left) / width;
    const strength = Math.max(-1, Math.min(1, (0.5 - ratio) * 2));
    velocityRef.current = strength * 0.18;
  }

  return (
    <div
      className="overflow-hidden"
      onPointerEnter={(e) => {
        hoverRef.current = true;
        const box = e.currentTarget.getBoundingClientRect();
        updateMouseVelocity(e.clientX, box.left, box.width);
      }}
      onPointerMove={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        updateMouseVelocity(e.clientX, box.left, box.width);
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
        velocityRef.current = 0;
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max cursor-ew-resize gap-4 will-change-transform"
      >
        {loop.map((s, i) => (
          <div
            key={`${s.id}-${i}`}
            className={`service-card w-[260px] shrink-0 rounded-2xl border p-5 sm:w-[300px] ${
              s.highlight
                ? "service-card-highlight border-lime/25 bg-gradient-to-br from-lime-light to-white"
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

        <div className="flex flex-col gap-4">
          <Row items={rowTop} />
          <Row items={rowBottom} reverse />
        </div>
      </div>
    </section>
  );
}
