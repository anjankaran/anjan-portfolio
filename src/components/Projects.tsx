import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import { projects, type Project } from "../data/content";
import { useContactModal } from "../context/ContactModalContext";
import AppWindow from "./demos/AppWindow";
import AnalyticsDashboard from "./demos/AnalyticsDashboard";
import BusinessApp from "./demos/BusinessApp";
import ZohoCreatorApp from "./demos/ZohoCreatorApp";

const EASE = [0.22, 1, 0.36, 1] as const;

const kindStyle: Record<Project["kind"], string> = {
  Live: "bg-lime/20 text-lime-light border-lime/40",
  "Case Study": "bg-white/10 text-white/80 border-white/20",
  Demo: "bg-white text-panel-3 border-white",
};

const cardAngles = [-2.4, 1.9, -1.6, 2.2];
const cardOffsets = [-38, 30, -28, 42];
const demos = {
  analytics: { title: "acme-analytics / sales-overview", width: 940, height: 470, render: () => <AnalyticsDashboard /> },
  business: { title: "workspace / projects", width: 940, height: 470, render: () => <BusinessApp /> },
  zoho: { title: "creator / customer-management", width: 940, height: 470, render: () => <ZohoCreatorApp /> },
};

function StackCard({ p, index }: { p: Project; index: number }) {
  const rotateZ = cardAngles[index % cardAngles.length];
  const translateX = cardOffsets[index % cardOffsets.length];
  const demo = p.demo ? demos[p.demo] : null;
  const href = p.href ?? (p.kind === "Demo" ? "#agent" : "#contact");

  return (
    <div
      className="sticky flex h-[88vh] items-start justify-center [perspective:1400px]"
      style={{ top: `calc(6vh + ${index * 18}px)` }}
    >
      <motion.div
        style={{
          zIndex: index + 1,
          transformOrigin: "center bottom",
          transformStyle: "preserve-3d",
        }}
        initial={{ x: translateX, y: 165, rotateX: 22, rotateZ, scale: 0.88 }}
        whileInView={{ x: 0, y: 0, rotateX: 0, rotateZ: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.38 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="group relative flex h-[80vh] w-[97vw] max-w-[92rem] flex-col overflow-hidden rounded-[32px] border border-black/10 bg-gradient-to-br from-[#173a27] to-panel-3 p-5 shadow-2xl shadow-black/30 transition-[box-shadow,filter] duration-300 will-change-transform hover:shadow-lime/20 sm:p-8 lg:px-14 lg:py-8"
      >
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-white/35" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-white/[0.04]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime/15 blur-3xl transition-opacity group-hover:opacity-80" />

        <div className="absolute inset-x-5 top-5 z-10 flex items-start justify-between gap-3 sm:inset-x-8 sm:top-8 lg:inset-x-14">
          <span className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold ${kindStyle[p.kind]}`}>
            {p.kind}
          </span>
          <a href={href} aria-label={`Open ${p.title}`}>
            <ArrowUpRight
              size={24}
              className="text-white/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime-light"
            />
          </a>
        </div>

        {/* with a live window the card splits in two; without one it stays as it was */}
        <div
          className={`relative grid min-h-0 flex-1 content-center gap-3 xl:gap-5 ${
            demo ? "lg:grid-cols-[minmax(280px,0.52fr)_minmax(0,2.25fr)] lg:items-center" : "items-end"
          }`}
        >
          <div className="min-w-0 max-w-[23rem] -translate-y-8">
            <b className="block text-[24px] font-bold leading-[1.04] tracking-tight text-white sm:text-[32px]">
              {p.title}
            </b>
            <p className="mt-3 text-[13px] leading-relaxed text-white/68 sm:text-[14px]">
              {p.description}
            </p>
          </div>

          {demo && (
            <div
              className="hidden min-w-0 self-center justify-self-end sm:block"
              style={{
                width: "100%",
                maxWidth: `min(100%, calc((80vh - 8.5rem) * ${demo.width / demo.height}))`,
              }}
            >
              <AppWindow title={demo.title} baseWidth={demo.width} baseHeight={demo.height}>
                {demo.render()}
              </AppWindow>
            </div>
          )}
        </div>

        <div className="absolute inset-x-5 bottom-8 z-10 border-t border-white/15 pt-3 sm:inset-x-8 sm:bottom-10 lg:inset-x-14">
          <div className="font-mono text-[11px] font-semibold text-lime-light sm:text-[12px]">
            {p.tags.join(" · ")}
          </div>
          {p.metric && (
            <div className="mt-1.5 text-[13px] font-semibold leading-snug text-lime-light sm:text-[14px]">
              {p.metric}
            </div>
          )}
        </div>
      </motion.div>
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
            Real client case studies and running components - scroll to page through, and try the live ones.
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
