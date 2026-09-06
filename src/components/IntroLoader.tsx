import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "logo" | "tagline" | "exit";

const TIMING: Record<Exclude<Phase, "logo">, number> = {
  tagline: 1200,
  exit: 2600,
};

export default function IntroLoader({ onReveal }: { onReveal: () => void }) {
  const [phase, setPhase] = useState<Phase>("logo");
  const [mounted, setMounted] = useState(true);

  const onRevealRef = useRef(onReveal);
  useEffect(() => {
    onRevealRef.current = onReveal;
  }, [onReveal]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timers = [
      window.setTimeout(() => setPhase("tagline"), TIMING.tagline),
      window.setTimeout(() => {
        setPhase("exit");
        onRevealRef.current();
      }, TIMING.exit),
      window.setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = prevOverflow;
      }, TIMING.exit + 600),
    ];

    return () => {
      timers.forEach(window.clearTimeout);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "exit" ? 0 : 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
        >
          <div className="absolute inset-0 bg-[url('/assets/hero_image.png')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.94),rgba(247,250,245,0.82)_42%,rgba(247,250,245,0.96)_100%)]" />

          <motion.div
            animate={{ scale: phase === "exit" ? 1.06 : 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative flex flex-col items-center px-4 text-center"
          >
            <motion.video
              src="/assets/logo_animation.mp4"
              poster="/assets/logo.png"
              autoPlay
              muted
              playsInline
              preload="auto"
              aria-label="Anjan Karan logo animation"
              initial={{ opacity: 0, scale: 0.82, y: 12 }}
              animate={{
                opacity: 1,
                scale: phase === "exit" ? 0.94 : 1,
                y: phase === "exit" ? -6 : 0,
              }}
              transition={{ duration: 0.8, ease: EASE }}
              className="h-52 w-52 object-contain opacity-85 mix-blend-multiply drop-shadow-[0_24px_42px_rgba(14,36,24,0.18)] sm:h-60 sm:w-60"
              style={{ filter: "brightness(1.2) contrast(1.45) saturate(1.08)" }}
            >
              <track kind="captions" />
            </motion.video>

            <AnimatePresence>
              {(phase === "tagline" || phase === "exit") && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="mt-5 text-[11px] font-semibold uppercase text-panel-3/60"
                >
                  Full Stack | AI Automation | Zoho
                </motion.div>
              )}
            </AnimatePresence>

            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase === "logo" ? 0.35 : 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-5 h-[2px] w-20 origin-center bg-lime"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
