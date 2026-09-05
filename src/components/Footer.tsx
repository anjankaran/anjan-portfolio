import { profile } from "../data/content";
import FooterTrees from "./leaf/FooterTrees";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-br from-[#123021] via-[#0e2418] to-[#0a1d14]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-lime/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-lime/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <a href="#top" className="flex items-center gap-2.5 text-[15px] font-extrabold tracking-tight text-white">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm shadow-black/10">
                <img src="/assets/logo.png" alt="" className="h-7 w-7 object-contain" />
              </span>
              {profile.name}
            </a>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-white/55">
              Full stack development, AI automation and Zoho engineering — building backend
              logic that runs itself.
            </p>
          </div>

          <div>
            <b className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lime-light">Connect</b>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={`mailto:${profile.email}`} className="text-[13px] text-white/65 hover:text-white">
                  {profile.email}
                </a>
              </li>
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-[13px] text-white/65 hover:text-white">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FooterTrees />

        <div className="relative mt-2 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-[12px] text-white/45 sm:flex-row">
          <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            Built with React, Tailwind &amp; Framer Motion
          </span>
        </div>
      </div>
    </footer>
  );
}
