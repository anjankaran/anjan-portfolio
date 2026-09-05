import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import RealLeaf from "./RealLeaf";

/**
 * The one place the full-detail public/assets/leaf_.svg earns its 104 KB: a
 * single hero-scale leaf drifting in the corner. It parallaxes on scroll and
 * tips toward the cursor, so the hero has depth before you touch anything.
 *
 * The artwork sits in the top quarter of a 2048x1657 canvas, so the box is
 * oversized and pushed down - what you see is just the leaf.
 */
export default function HeroLeaf() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const rise = useSpring(useTransform(scrollY, [0, 900], [0, -150]), {
    stiffness: 60,
    damping: 24,
  });
  const spin = useTransform(scrollY, [0, 900], [-6, 10]);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tiltX = useSpring(rawX, { stiffness: 30, damping: 16 });
  const tiltY = useSpring(rawY, { stiffness: 30, damping: 16 });
  const frame = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        rawX.set(((e.clientX / window.innerWidth) * 2 - 1) * 26);
        rawY.set(((e.clientY / window.innerHeight) * 2 - 1) * 14);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [rawX, rawY, reduced]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute -bottom-[300px] -left-52 hidden w-[520px] select-none lg:block"
      style={{ y: reduced ? 0 : rise, x: reduced ? 0 : tiltX, rotate: reduced ? -6 : spin }}
    >
      <motion.div
        style={{ y: reduced ? 0 : tiltY }}
        animate={reduced ? undefined : { rotate: [0, 2.5, -1.5, 0], y: [0, -10, 4, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      >
        <RealLeaf
          width={520}
          className="opacity-[0.72] blur-[1.5px] drop-shadow-[0_18px_26px_rgba(14,36,24,0.14)]"
        />
      </motion.div>
    </motion.div>
  );
}
