import Reveal from "./Reveal";
import { profile } from "../data/content";
import { useContactModal } from "../context/ContactModalContext";

export default function Contact() {
  const { openModal } = useContactModal();

  return (
    <section id="contact" className="px-2 py-6">
      <Reveal className="flex flex-wrap items-center justify-between gap-8 rounded-[22px] border border-lime/25 bg-gradient-to-r from-lime-light to-white p-9 shadow-sm shadow-black/5">
        <div>
          <h2 className="text-[clamp(1.6rem,4vw,2.2rem)] font-extrabold leading-tight tracking-tight">
            Have a workflow worth
            <br />
            automating?
          </h2>
          <p className="mt-3 text-sm text-fg/70">Let's talk — replies within a day.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3.5">
          <button
            onClick={openModal}
            className="rounded-full bg-lime px-7 py-4 text-sm font-bold text-panel-3 transition-transform hover:scale-105"
          >
            Start a project →
          </button>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-ink/15 bg-white px-6 py-4 text-sm font-semibold text-fg hover:bg-ink/5"
          >
            {profile.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
