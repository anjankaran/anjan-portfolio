import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { profile, stats } from "../data/content";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function Hero({ ready }: { ready: boolean }) {
  return (
    <section
      id="top"
      className="relative w-full overflow-hidden bg-ink bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/hero_imageee.png')" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(247,250,245,0.84)_0%,rgba(247,250,245,0.62)_34%,rgba(247,250,245,0.22)_62%,rgba(247,250,245,0)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/80 to-transparent" />

      <div className="relative mx-auto flex min-h-[650px] max-w-[1320px] items-center px-5 pb-16 pt-[92px] sm:px-8 lg:min-h-[760px] lg:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          className="max-w-[610px] pb-4 lg:pb-6"
        >
          <motion.div
            variants={item}
            className="flex items-center gap-3 text-[11px] font-semibold uppercase text-lime"
          >
            Full Stack | AI | Automation
            <span className="hidden h-px w-16 bg-lime/45 sm:inline-block" />
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance mt-5 text-5xl font-extrabold leading-[0.98] tracking-normal text-panel-3 sm:text-6xl lg:text-7xl"
          >
            Backend Logic
            <br />
            That Runs <span className="font-serif font-normal italic text-lime">Itself.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-[460px] text-[16px] leading-relaxed text-panel-3/70">
            {profile.summary}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-6">
            <a
              href="#work"
              className="group flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-bold text-white shadow-sm shadow-lime/30 transition-transform hover:scale-105"
            >
              View Work
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-11 flex flex-wrap gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex min-w-[120px] flex-col rounded-2xl border border-panel-3/10 bg-white/75 px-4 py-3 shadow-sm shadow-panel-3/5 backdrop-blur"
              >
                <span className="text-base font-bold text-panel-3">{s.value}</span>
                <span className="text-[11px] text-panel-3/60">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
