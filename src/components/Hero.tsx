import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { stats } from "../data/content";
import HeroLeaf from "./leaf/HeroLeaf";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const roles = ["AI & Automation", "Zoho Developer", "Data Analyst", "Problem Solver"];

function splitStat(value: string) {
  const match = value.match(/^([^0-9]*)([0-9,]+)(.*)$/);
  if (!match) return { prefix: "", target: 0, suffix: value };

  return {
    prefix: match[1],
    target: Number(match[2].replace(/,/g, "")),
    suffix: match[3],
  };
}

function AnimatedStatValue({ value, active }: { value: string; active: boolean }) {
  const reduced = useReducedMotion();
  const { prefix, target, suffix } = useMemo(() => splitStat(value), [value]);
  const [current, setCurrent] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!active || reduced) return;

    let frame = 0;
    const start = performance.now();
    const duration = 1900;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, reduced, target]);

  const display = active && reduced ? target : current;

  return `${prefix}${display.toLocaleString("en-IN")}${suffix}`;
}

export default function Hero({ ready }: { ready: boolean }) {
  const [roleIndex, setRoleIndex] = useState(0);
  // the copy drifts up a touch slower than the page, so the hero has depth
  const { scrollY } = useScroll();
  const copyY = useTransform(scrollY, [0, 700], [0, 70]);
  const copyFade = useTransform(scrollY, [0, 560], [1, 0.35]);

  useEffect(() => {
    const id = window.setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 1900);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden bg-ink bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/hero_imageee.png')" }}
    >
      <div className="hero-light pointer-events-none absolute inset-0" />
      <div className="hero-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-28" />

      <HeroLeaf />

      <div className="relative mx-auto flex min-h-[650px] max-w-[1320px] items-center px-5 pb-16 pt-[92px] sm:px-8 lg:min-h-[760px] lg:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          style={{ y: copyY, opacity: copyFade }}
          className="hero-copy max-w-[610px] pb-4 lg:pb-6"
        >
          <motion.div variants={item} className="text-[15px] font-bold text-lime">
            &lt; Hello, I&apos;m /&gt;
          </motion.div>

          <motion.h1
            variants={item}
            className="text-balance mt-4 text-5xl font-extrabold leading-[0.98] tracking-normal text-panel-3 sm:text-6xl lg:text-7xl"
          >
            Anjan <span className="text-lime">Karan</span>
          </motion.h1>

          <motion.div variants={item} className="mt-4 flex flex-wrap items-baseline gap-2 text-[20px] font-bold text-panel-3">
            <span>Full Stack Developer</span>
            <span className="text-panel-3/35">|</span>
            <span className="relative inline-flex min-w-[170px] overflow-hidden align-baseline font-serif text-[24px] font-semibold italic text-lime">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[roleIndex]}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>

          <motion.p variants={item} className="mt-5 max-w-[470px] text-[16px] leading-relaxed text-panel-3/70">
            I design, build and automate digital systems that turn ideas into real-world solutions.
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
                <span className="text-base font-bold text-panel-3">
                  <AnimatedStatValue value={s.value} active={ready} />
                </span>
                <span className="hero-stat-label text-[11px] text-panel-3/60">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
