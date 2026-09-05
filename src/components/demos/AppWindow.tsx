import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Chrome for the live product demos.
 *
 * Each demo is authored at one fixed design width so its type and spacing stay
 * exact, then scaled to whatever the card gives it. That keeps a real, working
 * UI inside the card instead of a screenshot.
 */
type AppWindowProps = {
  title: string;
  /** design width the child is authored against */
  baseWidth?: number;
  /** design height; the frame keeps this aspect ratio */
  baseHeight?: number;
  accent?: string;
  children: ReactNode;
};

export default function AppWindow({
  title,
  baseWidth = 760,
  baseHeight = 490,
  accent = "#4f9a2a",
  children,
}: AppWindowProps) {
  const holder = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / baseWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);

  return (
    <div className="overflow-hidden rounded-xl border border-ink/10 bg-white shadow-[0_18px_40px_-24px_rgba(14,36,24,0.45)]">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-ink/8 bg-[#f6f9f4] px-3 py-2">
        <span className="flex gap-1.5">
          <i className="h-2 w-2 rounded-full bg-[#e8695c]" />
          <i className="h-2 w-2 rounded-full bg-[#f0bc5e]" />
          <i className="h-2 w-2 rounded-full bg-[#63c47a]" />
        </span>
        <div className="ml-1 flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white/80 px-2 py-1">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
          <span className="truncate font-mono text-[10px] text-fg/45">{title}</span>
        </div>
      </div>

      {/* the app itself, scaled to fit the card */}
      <div ref={holder} style={{ height: baseHeight * scale }} className="relative overflow-hidden">
        <div
          style={{
            width: baseWidth,
            height: baseHeight,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
