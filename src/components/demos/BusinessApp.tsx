import { useMemo, useState } from "react";

/**
 * A working project workspace. Every sidebar tab renders its own view, the
 * tasks tick off, the filters filter, and the numbers follow whatever you do.
 *
 * Authored against AppWindow's 760x490 canvas, so type here is ~10px and lands
 * around 8px once the card scales it down.
 */
type Task = { id: string; name: string; owner: string; progress: number; done: boolean; due: string };

const INITIAL: Task[] = [
  { id: "t1", name: "Website Redesign", owner: "Design", progress: 82, done: false, due: "Fri" },
  { id: "t2", name: "API Integration", owner: "Backend", progress: 64, done: false, due: "Mon" },
  { id: "t3", name: "Billing Module", owner: "Backend", progress: 45, done: false, due: "Wed" },
  { id: "t4", name: "Onboarding Flow", owner: "Product", progress: 100, done: true, due: "done" },
  { id: "t5", name: "Mobile QA Pass", owner: "QA", progress: 28, done: false, due: "Thu" },
  { id: "t6", name: "Vendor Portal", owner: "Backend", progress: 12, done: false, due: "Next wk" },
];

const ACTIVITY = [
  { who: "Priya", what: "moved Billing Module to review", when: "2m" },
  { who: "Arjun", what: "closed 3 QA tickets", when: "18m" },
  { who: "System", what: "deployed build #284 to staging", when: "1h" },
  { who: "Sneha", what: "invoice #INV-1042 marked paid", when: "3h" },
  { who: "Priya", what: "added 2 members to Vendor Portal", when: "5h" },
];

const INVOICES = [
  { id: "INV-1042", client: "TechCorp", amount: "₹1,84,000", status: "paid" as const },
  { id: "INV-1041", client: "Greenscape", amount: "₹72,500", status: "sent" as const },
  { id: "INV-1040", client: "BuildRight", amount: "₹3,29,000", status: "paid" as const },
  { id: "INV-1039", client: "CloudNine", amount: "₹41,200", status: "overdue" as const },
];

const PILL = {
  paid: { label: "Paid", fg: "#1a7f37", bg: "#e7f6ec" },
  sent: { label: "Sent", fg: "#2a78d6", bg: "#e8f1fc" },
  overdue: { label: "Overdue", fg: "#b42318", bg: "#fdeceb" },
};

const TABS = ["Overview", "Projects", "Tasks", "Invoices"] as const;
type Tab = (typeof TABS)[number];

const Card = ({ title, extra, children }: { title: string; extra?: string; children: React.ReactNode }) => (
  <div className="rounded-lg border border-ink/8 bg-white p-2.5">
    <div className="mb-1.5 flex items-baseline justify-between">
      <span className="text-[10.5px] font-semibold">{title}</span>
      {extra && <span className="text-[9px] text-fg/40">{extra}</span>}
    </div>
    {children}
  </div>
);

export default function BusinessApp() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [tasks, setTasks] = useState(INITIAL);
  const [only, setOnly] = useState<"All" | "Open" | "Done">("All");

  const done = tasks.filter((t) => t.done).length;
  const active = tasks.length - done;
  const avg = Math.round(tasks.reduce((a, t) => a + t.progress, 0) / tasks.length);

  const toggle = (id: string) =>
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done, progress: !t.done ? 100 : 55 } : t)));

  const shown = useMemo(
    () => tasks.filter((t) => (only === "All" ? true : only === "Done" ? t.done : !t.done)),
    [tasks, only]
  );

  const bar = (t: Task) => (
    <div className="mt-[3px] h-1 overflow-hidden rounded-full bg-panel-2">
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${t.progress}%`, background: t.done ? "#4f9a2a" : "#2a78d6" }}
      />
    </div>
  );

  return (
    <div className="flex h-full w-full bg-panel-2 font-sans text-fg">
      <aside className="flex w-[118px] shrink-0 flex-col gap-0.5 border-r border-ink/8 bg-white px-2.5 py-3">
        <div className="mb-2.5 flex items-center gap-1.5 px-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-panel-3 text-[9px] font-bold text-lime-light">
            W
          </span>
          <span className="text-[11px] font-bold">Workspace</span>
        </div>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-2 py-[6px] text-left text-[10.5px] transition-colors ${
              tab === t ? "bg-lime-light font-semibold text-lime" : "text-fg/50 hover:bg-panel-2/70 hover:text-fg/75"
            }`}
          >
            {t}
          </button>
        ))}
        <div className="mt-auto rounded-md bg-panel-2 px-2 py-1.5">
          <div className="text-[9px] text-fg/45">Plan</div>
          <div className="text-[10.5px] font-bold text-lime">Business</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12.5px] font-bold">{tab === "Overview" ? "Good morning, Anjan" : tab}</div>
            <div className="text-[9.5px] text-fg/45">
              {active} active · {done} completed this week
            </div>
          </div>
          <button className="rounded-md bg-lime px-2.5 py-1 text-[10px] font-bold text-white">+ New</button>
        </div>

        {tab === "Overview" && (
          <>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "In progress", value: String(active), tone: "#2a78d6" },
                { label: "Completed", value: String(done), tone: "#4f9a2a" },
                { label: "Avg. progress", value: `${avg}%`, tone: "#4a3aa7" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-ink/8 bg-white px-3 py-2">
                  <div className="text-[9px] uppercase tracking-wide text-fg/40">{s.label}</div>
                  <div className="mt-0.5 text-[17px] font-bold leading-none" style={{ color: s.tone }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-[1.3fr_1fr] gap-2.5">
              <Card title="Project Progress" extra="click to complete">
                <ul className="space-y-[7px]">
                  {tasks.map((t) => (
                    <li key={t.id}>
                      <button onClick={() => toggle(t.id)} className="w-full text-left">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`flex h-3 w-3 items-center justify-center rounded-[3px] border text-[8px] leading-none ${
                              t.done ? "border-lime bg-lime text-white" : "border-ink/20 text-transparent"
                            }`}
                          >
                            ✓
                          </span>
                          <span className={`flex-1 truncate text-[10.5px] ${t.done ? "text-fg/35 line-through" : ""}`}>
                            {t.name}
                          </span>
                          <span className="text-[9.5px] tabular-nums text-fg/45">{t.progress}%</span>
                        </div>
                        {bar(t)}
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card title="Recent Activity">
                <ul className="space-y-[7px]">
                  {ACTIVITY.map((a, i) => (
                    <li key={i} className="flex gap-1.5">
                      <span className="mt-[4px] h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                      <div className="min-w-0">
                        <div className="text-[10px] leading-snug">
                          <b className="font-semibold">{a.who}</b> <span className="text-fg/55">{a.what}</span>
                        </div>
                        <div className="text-[8.5px] text-fg/35">{a.when} ago</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </>
        )}

        {tab === "Projects" && (
          <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-ink/8 bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-panel-2 text-left text-[8.5px] uppercase tracking-wide text-fg/40">
                  <th className="px-2.5 py-1.5 font-semibold">Project</th>
                  <th className="px-2.5 py-1.5 font-semibold">Team</th>
                  <th className="px-2.5 py-1.5 font-semibold">Due</th>
                  <th className="w-[34%] px-2.5 py-1.5 font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} className="border-t border-ink/6 hover:bg-panel-2/50">
                    <td className="px-2.5 py-[7px] text-[10.5px] font-medium">{t.name}</td>
                    <td className="px-2.5 py-[7px] text-[10px] text-fg/55">{t.owner}</td>
                    <td className="px-2.5 py-[7px] text-[10px] text-fg/45">{t.due}</td>
                    <td className="px-2.5 py-[7px]">
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-panel-2">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${t.progress}%`, background: t.done ? "#4f9a2a" : "#2a78d6" }}
                          />
                        </div>
                        <span className="w-7 text-right text-[9.5px] tabular-nums text-fg/50">{t.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "Tasks" && (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <div className="flex gap-1">
              {(["All", "Open", "Done"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setOnly(f)}
                  className={`rounded-full border px-2.5 py-[3px] text-[9.5px] font-semibold transition-colors ${
                    only === f ? "border-lime bg-lime-light text-lime" : "border-ink/10 text-fg/45 hover:text-fg/70"
                  }`}
                >
                  {f}
                </button>
              ))}
              <span className="ml-auto self-center text-[9.5px] text-fg/40">{shown.length} shown</span>
            </div>
            <div className="min-h-0 flex-1 rounded-lg border border-ink/8 bg-white p-2.5">
              <ul className="space-y-[9px]">
                {shown.map((t) => (
                  <li key={t.id}>
                    <button onClick={() => toggle(t.id)} className="w-full text-left">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border text-[9px] leading-none ${
                            t.done ? "border-lime bg-lime text-white" : "border-ink/20 text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        <span className={`flex-1 truncate text-[11px] ${t.done ? "text-fg/35 line-through" : ""}`}>
                          {t.name}
                        </span>
                        <span className="rounded-full bg-panel-2 px-1.5 py-[1px] text-[9px] text-fg/50">{t.owner}</span>
                        <span className="w-9 text-right text-[9.5px] tabular-nums text-fg/45">{t.due}</span>
                      </div>
                    </button>
                  </li>
                ))}
                {shown.length === 0 && (
                  <li className="py-6 text-center text-[10px] text-fg/35">Nothing here - try another filter.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {tab === "Invoices" && (
          <div className="flex min-h-0 flex-1 flex-col gap-2.5">
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "Outstanding", value: "₹1,13,700" },
                { label: "Paid this month", value: "₹5,13,000" },
                { label: "Overdue", value: "₹41,200" },
              ].map((k) => (
                <div key={k.label} className="rounded-lg border border-ink/8 bg-white px-3 py-2">
                  <div className="text-[9px] uppercase tracking-wide text-fg/40">{k.label}</div>
                  <div className="mt-0.5 text-[15px] font-bold leading-none tracking-tight">{k.value}</div>
                </div>
              ))}
            </div>
            <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-ink/8 bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-panel-2 text-left text-[8.5px] uppercase tracking-wide text-fg/40">
                    <th className="px-2.5 py-1.5 font-semibold">Invoice</th>
                    <th className="px-2.5 py-1.5 font-semibold">Client</th>
                    <th className="px-2.5 py-1.5 text-right font-semibold">Amount</th>
                    <th className="px-2.5 py-1.5 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {INVOICES.map((iv) => {
                    const p = PILL[iv.status];
                    return (
                      <tr key={iv.id} className="border-t border-ink/6 hover:bg-panel-2/50">
                        <td className="px-2.5 py-[7px] font-mono text-[10px] text-fg/50">{iv.id}</td>
                        <td className="px-2.5 py-[7px] text-[10.5px]">{iv.client}</td>
                        <td className="px-2.5 py-[7px] text-right text-[10.5px] font-semibold tabular-nums">
                          {iv.amount}
                        </td>
                        <td className="px-2.5 py-[7px] text-right">
                          <span
                            className="inline-block rounded-full px-2 py-[1px] text-[9px] font-bold"
                            style={{ color: p.fg, background: p.bg }}
                          >
                            {p.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
