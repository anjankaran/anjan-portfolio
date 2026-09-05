import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { projects, type Project } from "../data/content";
import { useContactModal } from "../context/ContactModalContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const kindStyle: Record<Project["kind"], string> = {
  Live: "bg-lime/20 text-lime-light border-lime/40",
  "Case Study": "bg-white/10 text-white/80 border-white/20",
  Demo: "bg-white text-panel-3 border-white",
};

const cardAngles = [-1.8, 1.3, -1, 1.6];
const cardOffsets = [-26, 20, -16, 28];

function StackCard({ p, index }: { p: Project; index: number }) {
  const rotateZ = cardAngles[index % cardAngles.length];
  const translateX = cardOffsets[index % cardOffsets.length];

  return (
    <div
      className="sticky flex h-[88vh] items-start justify-center [perspective:1400px]"
      style={{ top: `calc(6vh + ${index * 18}px)` }}
    >
      <motion.a
        href={p.href ?? (p.kind === "Demo" ? "#agent" : "#contact")}
        style={{
          zIndex: index + 1,
          transformOrigin: "center bottom",
          transformStyle: "preserve-3d",
        }}
        initial={{
          x: translateX,
          y: 120,
          rotateX: 18,
          rotateZ,
          scale: 0.9,
        }}
        whileInView={{
          x: 0,
          y: 0,
          rotateX: 0,
          rotateZ: 0,
          scale: 1,
        }}
        viewport={{ once: true, amount: 0.38 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="group relative flex h-[80vh] w-[97vw] max-w-6xl flex-col justify-between overflow-hidden rounded-[32px] border border-black/10 bg-gradient-to-br from-[#173a27] to-panel-3 p-8 shadow-2xl shadow-black/30 will-change-transform transition-[box-shadow,filter] duration-300 hover:shadow-lime/20 sm:p-14"
      >
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-white/35" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-white/[0.04]" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime/15 blur-3xl transition-opacity group-hover:opacity-80" />

        <div className="relative flex items-start justify-between gap-3">
          <span className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${kindStyle[p.kind]}`}>
            {p.kind}
          </span>
          <ArrowUpRight
            size={24}
            className="text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime-light"
          />
        </div>

        <div className="relative">
          <span className="block font-mono text-[13px] text-lime-light">{p.category}</span>
          <b className="mt-2 block text-[36px] font-bold leading-[1.05] tracking-tight text-white sm:text-[52px]">
            {p.title}
          </b>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-[17px]">
            {p.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] text-white/60"
              >
                {t}
              </span>
            ))}
          </div>

          {p.metric && (
            <div className="mt-6 border-t border-white/15 pt-4 text-[15px] font-semibold text-lime-light">
              {p.metric}
            </div>
          )}
        </div>
      </motion.a>
    </div>
  );
}

export default function Projects() {
  const { openModal } = useContactModal();

  return (
    <section id="work" className="relative isolate z-0 px-2 py-6">
      <Reveal className="mb-2 flex flex-wrap items-baseline justify-between gap-3 px-1">
        <div>
          <h2 className="text-[19px] font-bold tracking-tight">Selected Work</h2>
          <p className="mt-1 text-xs text-fg/50">
            A mix of real client case studies and live demos - scroll to page through.
          </p>
        </div>
        <button onClick={openModal} className="text-xs text-fg/55 hover:text-lime">
          Start a project &gt;
        </button>
      </Reveal>

      <div className="relative">
        {projects.map((p, i) => (
          <StackCard key={p.id} p={p} index={i} />
        ))}
        <div className="h-[78vh]" aria-hidden="true" />
      </div>
    </section>
  );
}
