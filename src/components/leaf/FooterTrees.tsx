import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import RealLeaf from "./RealLeaf";

/**
 * The tree line the falling leaves end up on.
 *
 * Each canopy sways on its own idle rhythm and leans toward the cursor - the
 * trunk stays planted, so the lean reads as wind rather than a slide. A handful
 * of leaves lie where the field dropped them.
 */
type Tree = {
  x: number;      // % across the strip
  scale: number;
  delay: number;
  lean: number;   // how strongly this one answers the cursor
};

const TREES: Tree[] = [
  { x: 8, scale: 0.72, delay: 0.6, lean: 0.7 },
  { x: 24, scale: 1, delay: 0, lean: 1 },
  { x: 42, scale: 0.62, delay: 1.1, lean: 0.55 },
  { x: 58, scale: 0.86, delay: 0.35, lean: 0.85 },
  { x: 76, scale: 0.68, delay: 0.85, lean: 0.6 },
  { x: 91, scale: 0.94, delay: 0.2, lean: 0.95 },
];

/** leaves that already landed, resting on the ground line */
const FALLEN = [
  { x: 14, r: -14, s: 22, tone: 0.2 },
  { x: 31, r: 8, s: 17, tone: 0.7 },
  { x: 49, r: -24, s: 20, tone: 0.4 },
  { x: 66, r: 16, s: 15, tone: 0.8 },
  { x: 83, r: -8, s: 19, tone: 0.3 },
];

function Tree({ tree, tilt }: { tree: Tree; tilt: ReturnType<typeof useSpring> }) {
  const rotate = useTransform(tilt, (v) => v * 5 * tree.lean);

  return (
    <div
      className="absolute bottom-0 origin-bottom"
      style={{ left: `${tree.x}%`, transform: `translateX(-50%) scale(${tree.scale})` }}
    >
      <svg width="92" height="118" viewBox="0 0 92 118" aria-hidden="true">
        <defs>
          <linearGradient id={`canopy-${tree.x}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#7cc95a" />
            <stop offset="55%" stopColor="#4a9c33" />
            <stop offset="100%" stopColor="#2c6d24" />
          </linearGradient>
        </defs>

        {/* trunk + boughs stay planted */}
        <path
          d="M 46 118 C 45 100 44 88 44 78 C 44 70 40 63 33 57 M 44 84 C 49 78 56 73 64 69 M 44 95 C 41 90 37 86 32 83"
          fill="none"
          stroke="#1b4a2b"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* canopy leans with the wind */}
        <motion.g style={{ rotate, originX: "46px", originY: "76px" }}>
          <motion.g
            animate={{ rotate: [0, 2.2, -1.6, 0], y: [0, -1.5, 0.8, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: tree.delay }}
            style={{ originX: "46px", originY: "76px" }}
          >
            {/* one soft, irregular crown rather than stacked circles */}
            <path
              d="M 46 8
                 C 66 8 82 22 80 40
                 C 92 50 86 68 70 70
                 C 62 80 48 82 40 74
                 C 24 78 10 66 14 52
                 C 2 40 12 20 30 18
                 C 33 11 39 8 46 8 Z"
              fill={`url(#canopy-${tree.x})`}
            />
            {/* highlight side + a couple of leaf tufts breaking the outline */}
            <path
              d="M 40 16 C 28 20 20 30 20 42 C 20 50 24 57 31 61"
              fill="none"
              stroke="#a6e08a"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.5"
            />
            <ellipse cx="70" cy="26" rx="9" ry="6.5" fill="#5fb442" transform="rotate(-24 70 26)" />
            <ellipse cx="18" cy="62" rx="8" ry="5.5" fill="#3d8c2e" transform="rotate(18 18 62)" />
            <ellipse cx="58" cy="74" rx="7" ry="5" fill="#2f7527" transform="rotate(-8 58 74)" />
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}

export default function FooterTrees() {
  const reduced = useReducedMotion();
  const raw = useMotionValue(0);
  const tilt = useSpring(raw, { stiffness: 35, damping: 16 });
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        raw.set((e.clientX / window.innerWidth) * 2 - 1);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [raw, reduced]);

  return (
    <div ref={host} className="pointer-events-none relative h-[118px] w-full select-none" aria-hidden="true">
      {/* ground line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-lime/35 to-transparent" />

      {TREES.map((t) => (
        <Tree key={t.x} tree={t} tilt={tilt} />
      ))}

      {FALLEN.map((f) => (
        <div
          key={f.x}
          className="absolute bottom-[2px]"
          style={{ left: `${f.x}%`, transform: `rotate(${f.r}deg)` }}
        >
          <RealLeaf
            width={f.s}
            tint={`hue-rotate(${((f.tone - 0.5) * 26).toFixed(0)}deg) brightness(${(1.02 - f.tone * 0.25).toFixed(2)})`}
            className="opacity-85"
          />
        </div>
      ))}
    </div>
  );
}
