import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import RealLeaf from "./RealLeaf";

/**
 * Leaves that fall from the hero to the footer trees as the page scrolls.
 *
 * How it works: the layer is fixed to the viewport, and every leaf's position is
 * a pure function of page scroll progress, so scrolling *is* the fall - up as
 * well as down. Each leaf owns a slice of the scroll (`from` -> `to`), so they
 * release a few at a time instead of raining all at once. Near the end of the
 * page they stop drifting and settle onto the footer canopy.
 *
 * Two layers are rendered: `back` sits behind the section cards (leaves slide
 * under the white panels and reappear in the gaps) and `front` floats above.
 */
type Layer = "back" | "front";
type Visibility = "all" | "desktop" | "mobile";

type Spec = {
  id: string;
  x: number;      // vw where it starts
  drift: number;  // how far it wanders sideways
  size: number;   // px
  from: number;   // scroll progress it enters at
  to: number;     // scroll progress it lands at
  spin: number;   // total degrees of tumble
  sway: number;   // wobble frequency
  phase: number;
  tone: number;
  depth: number;  // 0 near .. 1 far
  land: number;   // vw it settles at, over a footer tree
  lands: boolean; // true = comes to rest on the footer trees
  startY: number; // vh it detaches from
  endY: number;   // vh it finishes at
  fromHero: boolean; // born off the hero canopy rather than drifting in from above
  visibility: Visibility;
  flipX: boolean;
  flipY: boolean;
};

/* where the footer trees stand, so a landing leaf comes to rest on one */
const CANOPY_X = [8, 24, 42, 58, 76, 91];

const HERO_STARTS: Array<{
  x: number;
  startY: number;
  drift: number;
  size: number;
  visibility: Visibility;
  flipX?: boolean;
  flipY?: boolean;
}> = [
  { x: 86, startY: 14, drift: -18, size: 42, visibility: "desktop" },
  { x: 95, startY: 24, drift: -24, size: 46, visibility: "desktop" },
  { x: 38, startY: 44, drift: -12, size: 38, visibility: "desktop", flipX: true },
  { x: 63, startY: 72, drift: -16, size: 44, visibility: "desktop", flipY: true },
  { x: 14, startY: 34, drift: 10, size: 34, visibility: "mobile" },
  { x: 64, startY: 68, drift: -12, size: 38, visibility: "mobile" },
];

/* deterministic pseudo-random so server/client and re-renders agree */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function build(count: number, layer: Layer): Spec[] {
  const base = layer === "front" ? 0 : 100;
  return Array.from({ length: count }, (_, i) => {
    const r = (n: number) => rand(base + i * 7.3 + n);
    const depth = r(1);
    const heroStart = layer === "front" ? HERO_STARTS[i] : undefined;
    // Hero leaves start from hand-picked points in the artwork: two above the
    // phone, one in the left background, and one near the man's feet. Mobile
    // gets its own two anchors so the crop still looks intentional.
    const fromHero = Boolean(heroStart);
    // Front-layer leaves can land visibly at the footer. Hero anchors use the
    // full page scroll, so they start in the hero and only reach bottom at the
    // last page.
    const lands = layer === "front" && (fromHero || i % 2 === 0);
    const span = 0.42 + r(2) * 0.4;
    const from = fromHero
      ? r(3) * 0.015                                 // released as soon as the hero scrolls
      : lands
        ? 0.16 + r(3) * 0.4
        : 0.14 + r(3) * (1 - span) * 0.8;
    return {
      id: `${layer}-${i}`,
      fromHero,
      x: heroStart?.x ?? 8 + r(4) * 86,
      startY: heroStart?.startY ?? -16,
      // and they sweep leftward across the page on the way down
      drift: heroStart?.drift ?? (r(5) - 0.5) * 34,
      size: heroStart?.size ?? (layer === "front" ? 28 : 22) + depth * (layer === "front" ? 26 : 22),
      from,
      to: lands ? 1 : from + span,
      lands,
      endY: lands ? 78 + r(12) * 7 : 124,
      spin: (r(6) > 0.5 ? 1 : -1) * (220 + r(7) * 400),
      sway: 2 + r(8) * 3,
      phase: r(9) * Math.PI * 2,
      tone: r(10),
      depth,
      land: CANOPY_X[Math.floor(r(11) * CANOPY_X.length)] + (r(13) - 0.5) * 5,
      visibility: heroStart?.visibility ?? "all",
      flipX: Boolean(heroStart?.flipX),
      flipY: Boolean(heroStart?.flipY),
    };
  });
}

function Leaf({
  spec,
  progress,
  pointerX,
  pointerY,
  still,
}: {
  spec: Spec;
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  still: boolean;
}) {
  const edge = (spec.size / 2 / window.innerWidth) * 100;
  /** 0 before it is released, 1 once it has landed */
  const t = useTransform(progress, [spec.from, spec.to], [0, 1], { clamp: true });

  // fall: just above the fold, down past the bottom, easing as it settles
  const y = useTransform(t, (v) => {
    const eased = 1 - Math.pow(1 - v, spec.lands ? 2.2 : 1.7);  // landing leaves brake harder
    return spec.startY + eased * (spec.endY - spec.startY);      // vh
  });

  // sideways: a wobble that decays as it lands, plus a nudge toward its tree
  const x = useTransform(t, (v) => {
    const wobble = Math.sin(v * spec.sway * Math.PI * 2 + spec.phase) * spec.drift * (1 - v * 0.65);
    const settle = Math.max(0, (v - 0.72) / 0.28);  // last quarter drifts to the canopy
    const next = spec.x + wobble + (spec.land - spec.x) * settle * settle;
    return Math.min(100 - edge, Math.max(edge, next));
  });

  const rotate = useTransform(t, (v) => {
    const settling = Math.min(1, Math.max(0, (v - 0.78) / 0.22));
    const rest = 1 - settling;
    const tumble = v * spec.spin * (0.35 + 0.65 * rest);
    const wobble = Math.sin(v * spec.sway * 4 + spec.phase) * 18 * rest;
    if (!spec.lands) return tumble + wobble;
    // ease onto a flat-ish resting angle instead of spinning forever
    const restAngle = spec.spin > 0 ? 16 : -16;
    return tumble * rest + wobble + restAngle * settling;
  });

  // leaves nearer the camera answer the cursor more
  const px = useTransform(pointerX, (v) => v * (10 + spec.depth * 26));
  const py = useTransform(pointerY, (v) => v * (5 + spec.depth * 12));

  const opacity = useTransform(
    t,
    spec.fromHero ? [0, 0.001, 0.9, 1] : [0, 0.06, 0.9, 1],
    spec.fromHero ? [1, 1, 1, 0.92] : [0, 1, 1, 0.92]
  );

  const left = useTransform([x, px] as MotionValue<number>[], ([a, b]: number[]) => `calc(${a}vw + ${b}px)`);
  const topPos = useTransform([y, py] as MotionValue<number>[], ([a, b]: number[]) => `calc(${a}vh + ${b}px)`);

  return (
    <motion.div
      className={`absolute will-change-transform ${
        spec.visibility === "desktop" ? "hidden lg:block" : spec.visibility === "mobile" ? "lg:hidden" : ""
      }`}
      style={{
        top: 0,
        left: 0,
        width: spec.size,
        x: left,
        y: topPos,
        rotate: still ? spec.spin * 0.2 : rotate,
        scaleX: spec.flipX ? -1 : 1,
        scaleY: spec.flipY ? -1 : 1,
        opacity: still ? 0.5 : opacity,
      }}
    >
      {/* The blur and the colour shift live on the static child, never on the
          animated element - a filter on the transformed node would force a
          repaint every frame. The tint keeps a field of the same artwork from
          looking like one leaf photocopied. */}
      <RealLeaf
        width={spec.size}
        tint={`hue-rotate(${((spec.tone - 0.5) * 26).toFixed(0)}deg) saturate(${(0.85 + spec.tone * 0.35).toFixed(2)}) brightness(${(1.08 - spec.tone * 0.3).toFixed(2)})`}
        className={`drop-shadow-[0_4px_6px_rgba(14,36,24,0.14)] ${spec.depth > 0.62 ? "blur-[1.4px]" : ""}`}
      />
    </motion.div>
  );
}

export default function LeafFall({ layer = "back", count = 9 }: { layer?: Layer; count?: number }) {
  const reduced = useReducedMotion();
  const specs = useMemo(() => build(count, layer), [count, layer]);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.6 });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointerX = useSpring(rawX, { stiffness: 40, damping: 18 });
  const pointerY = useSpring(rawY, { stiffness: 40, damping: 18 });

  // only the front layer bothers tracking the cursor; one listener, passive
  const enabled = layer === "front" && !reduced;
  const frame = useRef(0);
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        rawX.set((e.clientX / window.innerWidth) * 2 - 1);
        rawY.set((e.clientY / window.innerHeight) * 2 - 1);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [enabled, rawX, rawY]);

  // don't paint leaves until the browser is idle after first paint
  const [alive, setAlive] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setAlive(true), 400);
    return () => window.clearTimeout(id);
  }, []);
  if (!alive) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 overflow-hidden ${
        layer === "back" ? "z-[-1]" : "z-40"
      }`}
    >
      {specs.map((s) => (
        <Leaf
          key={s.id}
          spec={s}
          progress={progress}
          pointerX={pointerX}
          pointerY={pointerY}
          still={!!reduced}
        />
      ))}
    </div>
  );
}
