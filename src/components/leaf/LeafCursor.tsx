import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import RealLeaf, { LEAF_RATIO } from "./RealLeaf";

/**
 * A leaf that stands in for the mouse pointer.
 *
 * It trails the cursor on a spring so it drifts like something falling, turns to
 * face the direction of travel, and opens up over anything clickable.
 *
 * It only takes over on real pointing devices (`pointer: fine`) and never when
 * the visitor asked for reduced motion - and text fields keep the native caret,
 * because you cannot type accurately against a floating leaf.
 */
export default function LeafCursor() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [hot, setHot] = useState(false);   // over something interactive

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const angle = useMotionValue(-18);

  // the leaf lags a little, which is what makes it feel like a leaf
  const sx = useSpring(x, { stiffness: 340, damping: 30, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 340, damping: 30, mass: 0.35 });
  const sa = useSpring(angle, { stiffness: 90, damping: 16 });
  const scale = useSpring(1, { stiffness: 320, damping: 22 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    setActive(true);
    document.documentElement.classList.add("leaf-cursor");

    let last = 0;
    let px = 0;
    let py = 0;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      // point along the direction of travel, but only once it is really moving
      const dx = e.clientX - px;
      const dy = e.clientY - py;
      px = e.clientX;
      py = e.clientY;
      const now = performance.now();
      if (now - last > 40 && Math.hypot(dx, dy) > 3) {
        last = now;
        angle.set((Math.atan2(dy, dx) * 180) / Math.PI - 12);
      }

      const el = e.target as HTMLElement | null;
      setHot(!!el?.closest?.("a, button, [role='button'], input, select, textarea, label"));
    };

    const onDown = () => scale.set(0.82);
    const onUp = () => scale.set(1);
    const onLeave = () => { x.set(-200); y.set(-200); };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("leaf-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [angle, reduced, scale, x, y]);

  // The tip of the leaf is the hotspot, like the point of an arrow. The tip sits
  // at 97%/7% of the box, so the box is offset by that much and every transform
  // pivots there - the tip stays exactly on the pointer while it turns and scales.
  const W = 22;                        // small - this is a cursor, not a decoration
  const H = W * LEAF_RATIO;
  const left = useTransform(sx, (v) => v - W * 0.94);
  const top = useTransform(sy, (v) => v - H * 0.06);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[120] hidden lg:block"
      style={{ left, top, width: W, rotate: sa, scale, originX: 0.94, originY: 0.06 }}
    >
      <motion.div
        animate={{ opacity: hot ? 1 : 0.88 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <RealLeaf width={W} className="drop-shadow-[0_2px_4px_rgba(14,36,24,0.3)]" />
      </motion.div>
    </motion.div>
  );
}
