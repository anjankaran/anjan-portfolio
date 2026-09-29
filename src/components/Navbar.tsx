import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { profile } from "../data/content";

const links = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

type Theme = "light" | "dark";

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const dark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
      aria-pressed={dark}
      onClick={onToggle}
      className={`group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border transition-[background-color,border-color,box-shadow] duration-500 ${
        dark
          ? "border-white/15 bg-white/10 shadow-[0_0_22px_rgba(230,245,218,0.16)]"
          : "border-panel-3/10 bg-white/75 shadow-sm shadow-panel-3/10 backdrop-blur"
      }`}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -35, scale: 0.72, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 35, scale: 0.72, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={dark ? "text-lime-light" : "text-lime"}
      >
        {dark ? <Moon size={18} className="text-lime-light drop-shadow-[0_0_10px_rgba(215,247,196,0.45)]" /> : <Sun size={18} />}
      </motion.span>
    </button>
  );
}

export default function Navbar({
  ready,
  theme,
  onToggleTheme,
}: {
  ready: boolean;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const dark = theme === "dark";
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [activeHref, setActiveHref] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

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
  }, []);

  // how far down the page you are - the same value the leaves fall on
  const { scrollY, scrollYProgress } = useScroll();
  const growth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const scrollSmooth = useSpring(scrollY, { stiffness: 300, damping: 40, mass: 0.4 });
  const navT = useTransform(scrollSmooth, [0, 160], [0, 1]);
  const navOuterTop = useTransform(navT, [0, 1], [0, 12]);
  const navOuterSide = useTransform(navT, [0, 1], [0, 24]);
  const navRadius = useTransform(navT, [0, 1], [0, 16]);
  const navMaxWidth = useTransform(navT, [0, 1], [1276, 1040]);
  const navPaddingY = useTransform(navT, [0, 1], [12, 7]);
  const navPadding = useMotionTemplate`${navPaddingY}px 24px`;
  const navBg = useMotionTemplate`rgba(10, 29, 20, ${useTransform(navT, [0, 1], [0, 0.94])})`;
  const navBorder = useMotionTemplate`rgba(255, 255, 255, ${useTransform(navT, [0, 1], [0, 0.1])})`;
  const navBlur = useMotionTemplate`blur(${useTransform(navT, [0, 1], [0, 14])}px)`;
  const navShadow = useMotionTemplate`0 16px 36px -12px rgba(0, 0, 0, ${useTransform(navT, [0, 1], [0, 0.55])})`;

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center pointer-events-none"
      style={{ paddingTop: navOuterTop, paddingLeft: navOuterSide, paddingRight: navOuterSide }}
    >
      <motion.div
        className="relative w-full overflow-visible border"
        style={{
          maxWidth: navMaxWidth,
          borderRadius: navRadius,
          borderColor: navBorder,
          background: navBg,
          backdropFilter: navBlur,
          WebkitBackdropFilter: navBlur,
          boxShadow: navShadow,
          pointerEvents: "auto",
        }}
      >
        {/* growth line: fills as you scroll the page */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: growth, borderRadius: navRadius }}
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-lime/70 via-lime to-lime-light"
        />

      <motion.div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4" style={{ padding: navPadding }}>
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5 text-[15px] font-extrabold tracking-normal"
        >
            <span className={`flex h-11 w-11 items-center justify-center overflow-hidden transition-colors duration-300 ${
              overHero ? "" : "rounded-lg bg-white shadow-sm shadow-black/10"
            }`}
          >
            <img src="/assets/logo.png" alt="" className="h-11 w-11 object-contain" />
          </span>
          <span className={overHero ? "text-[#2f7d1c]" : "text-white"}>{profile.name}</span>
        </a>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-xl px-4 py-2 text-[13px] font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                activeHref === l.href
                  ? overHero
                    ? "bg-lime text-white shadow-sm shadow-lime/20"
                    : dark
                      ? "bg-lime text-panel-3 shadow-sm shadow-lime/25"
                      : "bg-white text-panel-3 shadow-sm shadow-black/10"
                  : overHero
                    ? "text-panel-3/75 hover:bg-panel-3/5 hover:text-lime"
                    : "text-white/75 hover:bg-white/10 hover:text-lime-light"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <a
            href="#contact"
            className="rounded-xl bg-lime px-4 py-2 text-[13px] font-bold text-white shadow-sm shadow-lime/30 transition-transform hover:scale-105"
          >
            Let's Talk
          </a>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className={`rounded-xl border p-2 ${
              overHero ? "border-panel-3/15 bg-white/70 text-panel-3" : "border-white/15 bg-white/10 text-white"
            }`}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.div>

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
              className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${
                activeHref === l.href
                  ? dark
                    ? "bg-lime text-panel-3"
                    : "bg-white text-panel-3"
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
      </motion.div>
    </motion.header>
  );
}
