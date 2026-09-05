import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { profile } from "../data/content";
import { useContactModal } from "../context/ContactModalContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const projectTypes = [
  "Website",
  "Web App",
  "Mobile App",
  "Zoho Automation",
  "AI Automation / Agent",
  "Other",
];

export default function ContactModal() {
  const { open, closeModal } = useContactModal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState(projectTypes[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeModal]);

  useEffect(() => {
    if (!open) {
      const t = window.setTimeout(() => setSent(false), 300);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const subject = `New project inquiry — ${type}`;
    const body = `Name: ${name}\nEmail: ${email}\nProject type: ${type}\n\n${message}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setSent(true);
    window.setTimeout(() => {
      closeModal();
      setName("");
      setEmail("");
      setType(projectTypes[0]);
      setMessage("");
    }, 1400);
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-2xl shadow-black/25"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <div>
                <h3 className="text-[18px] font-bold tracking-tight">Start a project</h3>
                <p className="mt-0.5 text-[12px] text-fg/55">Tell me a bit about what you need.</p>
              </div>
              <button
                aria-label="Close"
                onClick={closeModal}
                className="rounded-full p-1.5 text-fg/50 hover:bg-ink/5 hover:text-fg"
              >
                <X size={18} />
              </button>
            </div>

            {sent ? (
              <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime/15 text-lime">
                  <Send size={20} />
                </span>
                <p className="text-[14px] font-semibold text-fg">Opening your email app…</p>
                <p className="max-w-xs text-[12px] text-fg/55">
                  If nothing happens, email me directly at {profile.email}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 px-6 py-5">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-fg/70">Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-ink/10 bg-panel-2 px-3.5 py-2.5 text-[13.5px] text-fg placeholder:text-fg/40 outline-none focus:border-lime/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-fg/70">Email</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-ink/10 bg-panel-2 px-3.5 py-2.5 text-[13.5px] text-fg placeholder:text-fg/40 outline-none focus:border-lime/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-fg/70">Project type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl border border-ink/10 bg-panel-2 px-3.5 py-2.5 text-[13.5px] text-fg outline-none focus:border-lime/40"
                  >
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-fg/70">Project details</label>
                  <textarea
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What are you looking to build?"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-ink/10 bg-panel-2 px-3.5 py-2.5 text-[13.5px] text-fg placeholder:text-fg/40 outline-none focus:border-lime/40"
                  />
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-lime px-5 py-3 text-[13.5px] font-bold text-panel-3 transition-transform hover:scale-[1.02]"
                >
                  Send message
                  <Send size={15} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
