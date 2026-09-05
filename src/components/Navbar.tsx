import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { profile } from "../data/content";

const links = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#stack", label: "Stack" },
  { href: "#about", label: "About" },
  { href: "#agent", label: "AI Agent" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ ready }: { ready: boolean }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [activeHref, setActiveHref] = useState("");
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;

      if (open) {
        lastY.current = y;
        return;
      }

      if (goingDown && y > 120) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY.current = y;

      const isOverHero = y < 12;
      setOverHero(isOverHero);

      const highlightLine = 160;
      const hero = document.getElementById("top");
      if (hero && hero.getBoundingClientRect().bottom > highlightLine) {
        setActiveHref("");
        return;
      }

      const current = links.find((link) => {
        const element = document.getElementById(link.href.slice(1));
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return rect.top <= highlightLine && rect.bottom > highlightLine;
      });
      setActiveHref(current?.href ?? "");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  const hiddenNow = hidden && !overHero;

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={!ready ? { y: -30, opacity: 0 } : { y: hiddenNow ? -110 : 0, opacity: hiddenNow ? 0 : 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 w-full transition-colors duration-300 ${
        overHero
          ? "bg-transparent"
          : "bg-gradient-to-r from-[#123021] via-[#0e2418] to-[#0a1d14] shadow-md shadow-black/15"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-[15px] font-extrabold tracking-normal"
        >
          <span
            className={`flex items-center justify-center overflow-hidden transition-colors duration-300 ${
              overHero ? "h-11 w-11" : "h-10 w-10 rounded-lg bg-white shadow-sm shadow-black/10"
            }`}
          >
            <img src="/assets/logo.png" alt="" className={overHero ? "h-11 w-11 object-contain" : "h-8 w-8 object-contain"} />
          </span>
          <span className={overHero ? "text-[#0e2418]" : "text-white"}>{profile.name}</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                activeHref === l.href
                  ? overHero
                    ? "bg-lime text-white shadow-sm shadow-lime/20"
                    : "bg-white text-panel-3 shadow-sm shadow-black/10"
                  : overHero
                    ? "text-panel-3/75 hover:text-lime"
                    : "text-white/75 hover:text-lime-light"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#contact"
            className="rounded-full bg-lime px-4 py-2 text-[13px] font-bold text-white shadow-sm shadow-lime/30 transition-transform hover:scale-105"
          >
            Let's Talk
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className={`rounded-full border p-2 md:hidden ${
            overHero ? "border-panel-3/15 bg-white/70 text-panel-3" : "border-white/15 bg-white/10 text-white"
          }`}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-3 flex flex-col gap-1 rounded-2xl border border-white/10 bg-[#123021]/95 p-3 backdrop-blur-xl md:hidden"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                activeHref === l.href
                  ? "bg-white text-panel-3"
                  : "text-white/80 hover:bg-white/10 hover:text-lime-light"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-xl bg-lime px-4 py-3 text-center text-sm font-bold text-white"
          >
            Let's Talk
          </a>
        </motion.nav>
      )}
    </motion.header>
  );
}
