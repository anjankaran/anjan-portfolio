import { useMemo, useState } from "react";

/**
 * A working Zoho-Creator-style app: every nav item is its own view, and the
 * search, status filters and row selection all run for real.
 */
type Row = { name: string; company: string; email: string; status: "Active" | "Inactive" | "Trial"; owner: string };

const ROWS: Row[] = [
  { name: "Rahul Mehta", company: "TechCorp", email: "rahul@techcorp.com", status: "Active", owner: "Anjan" },
  { name: "Priya Sharma", company: "Greenscape", email: "priya@greenscape.com", status: "Active", owner: "Devi" },
  { name: "Arjun Patel", company: "BuildRight", email: "arjun@buildright.com", status: "Inactive", owner: "Anjan" },
  { name: "Sneha Iyer", company: "CloudNine", email: "sneha@cloudnine.com", status: "Trial", owner: "Devi" },
  { name: "Vikram Rao", company: "Northwind", email: "vikram@northwind.io", status: "Active", owner: "Anjan" },
  { name: "Meera Nair", company: "Lotus Foods", email: "meera@lotusfoods.in", status: "Trial", owner: "Ravi" },
];

const LEADS = [
  { name: "Kiran Desai", source: "Website", stage: "Qualified", value: "₹2,40,000" },
  { name: "Neha Gupta", source: "Referral", stage: "Contacted", value: "₹85,000" },
  { name: "Sameer Khan", source: "Campaign", stage: "New", value: "₹1,10,000" },
  { name: "Divya Menon", source: "Website", stage: "Qualified", value: "₹3,60,000" },
];

const PROJECTS = [
  { name: "Warehouse rollout", client: "BuildRight", stage: "Build", pct: 68 },
  { name: "CRM migration", client: "TechCorp", stage: "UAT", pct: 84 },
  { name: "Field app v2", client: "Northwind", stage: "Design", pct: 32 },
];

const INVOICES = [
  { id: "INV-2041", client: "TechCorp", amount: "₹1,84,000", status: "Paid" },
  { id: "INV-2040", client: "Greenscape", amount: "₹72,500", status: "Sent" },
  { id: "INV-2039", client: "CloudNine", amount: "₹41,200", status: "Overdue" },
];

const STATUS_STYLE: Record<string, { fg: string; bg: string }> = {
  Active: { fg: "#1a7f37", bg: "#e7f6ec" },
  Paid: { fg: "#1a7f37", bg: "#e7f6ec" },
  Qualified: { fg: "#1a7f37", bg: "#e7f6ec" },
  Inactive: { fg: "#b42318", bg: "#fdeceb" },
  Overdue: { fg: "#b42318", bg: "#fdeceb" },
  Trial: { fg: "#b45309", bg: "#fdf3e3" },
  Contacted: { fg: "#b45309", bg: "#fdf3e3" },
  Sent: { fg: "#2a78d6", bg: "#e8f1fc" },
  New: { fg: "#2a78d6", bg: "#e8f1fc" },
};

const NAV = ["Home", "Leads", "Customers", "Projects", "Invoices"] as const;
type Nav = (typeof NAV)[number];
const FILTERS = ["All", "Active", "Trial", "Inactive"] as const;

const Pill = ({ v }: { v: string }) => {
  const s = STATUS_STYLE[v] ?? { fg: "#4b5563", bg: "#eef1ef" };
  return (
    <span className="inline-block rounded-full px-2 py-[1px] text-[9px] font-bold" style={{ color: s.fg, background: s.bg }}>
      {v}
    </span>
  );
};

const TH = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
  <th className={`px-2.5 py-1.5 font-semibold ${right ? "text-right" : ""}`}>{children}</th>
);

export default function ZohoCreatorApp() {
  const [nav, setNav] = useState<Nav>("Customers");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [picked, setPicked] = useState<string | null>("Rahul Mehta");

  const rows = useMemo(
    () =>
      ROWS.filter((r) => filter === "All" || r.status === filter).filter((r) =>
        (r.name + r.company + r.email).toLowerCase().includes(query.toLowerCase())
      ),
    [query, filter]
  );

  return (
    <div className="flex h-full w-full bg-[#fbfdfa] font-sans text-fg">
      <aside className="flex w-[112px] shrink-0 flex-col gap-0.5 border-r border-ink/8 bg-white px-2.5 py-3">
        <div className="mb-2.5 px-1.5 text-[13px] font-extrabold tracking-tight">
          <span className="text-[#e8695c]">z</span>
          <span className="text-[#f0bc5e]">o</span>
          <span className="text-[#2a78d6]">h</span>
          <span className="text-[#4f9a2a]">o</span>
        </div>
        {NAV.map((n) => (
          <button
            key={n}
            onClick={() => setNav(n)}
            className={`rounded-md px-2 py-[6px] text-left text-[10.5px] transition-colors ${
              nav === n ? "bg-lime-light font-semibold text-lime" : "text-fg/50 hover:bg-panel-2/70 hover:text-fg/75"
            }`}
          >
            {n}
          </button>
        ))}
        <div className="mt-auto rounded-md bg-panel-2 px-2 py-1.5">
          <div className="text-[9px] text-fg/45">Environment</div>
          <div className="text-[10.5px] font-bold text-lime">Production</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3.5">
        <div className="flex items-center justify-between">
          <div className="text-[12.5px] font-bold">
            {nav === "Customers" ? "Customer Management" : nav === "Home" ? "Overview" : nav}
          </div>
          <div className="flex items-center gap-2">
            {nav === "Customers" && (
              <div className="flex items-center gap-1.5 rounded-md border border-ink/10 bg-white px-2 py-[4px]">
                <span className="text-[10px] text-fg/30">⌕</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="w-[78px] bg-transparent text-[10px] outline-none placeholder:text-fg/30"
                />
              </div>
            )}
            <button className="rounded-md bg-lime px-2.5 py-[5px] text-[10px] font-bold text-white">
              + New {nav === "Customers" ? "Customer" : nav === "Home" ? "Record" : nav.replace(/s$/, "")}
            </button>
          </div>
        </div>

        {nav === "Home" && (
          <div className="flex min-h-0 flex-1 flex-col gap-2.5">
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { k: "Leads", v: "38" },
                { k: "Customers", v: "126" },
                { k: "Open projects", v: "9" },
                { k: "Unpaid", v: "₹1.1L" },
              ].map((s) => (
                <div key={s.k} className="rounded-lg border border-ink/8 bg-white px-3 py-2">
                  <div className="text-[9px] uppercase tracking-wide text-fg/40">{s.k}</div>
                  <div className="mt-0.5 text-[17px] font-bold leading-none tracking-tight">{s.v}</div>
                </div>
              ))}
            </div>
            <div className="min-h-0 flex-1 rounded-lg border border-ink/8 bg-white p-3">
              <div className="mb-2 text-[10.5px] font-semibold">Pipeline</div>
              <div className="flex items-center gap-1.5">
                {[
                  { label: "Capture", sub: "Leads", pct: 100 },
                  { label: "Automate", sub: "Process", pct: 72 },
                  { label: "Track", sub: "Manage", pct: 48 },
                  { label: "Scale", sub: "Grow", pct: 25 },
                ].map((st, i, arr) => (
                  <div key={st.label} className="flex flex-1 items-center gap-1.5">
                    <div className="flex-1">
                      <div className="text-[10.5px] font-bold leading-none">{st.label}</div>
                      <div className="mt-0.5 text-[9px] text-fg/40">{st.sub}</div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-panel-2">
                        <div className="h-full rounded-full bg-lime" style={{ width: `${st.pct}%` }} />
                      </div>
                    </div>
                    {i < arr.length - 1 && <span className="text-[11px] text-lime/50">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {nav === "Customers" && (
          <>
            <div className="flex gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full border px-2.5 py-[3px] text-[9.5px] font-semibold transition-colors ${
                    filter === f ? "border-lime bg-lime-light text-lime" : "border-ink/10 text-fg/45 hover:text-fg/70"
                  }`}
                >
                  {f}
                </button>
              ))}
              <span className="ml-auto self-center text-[9.5px] text-fg/40">{rows.length} records</span>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-ink/8 bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f6f9f4] text-left text-[8.5px] uppercase tracking-wide text-fg/40">
                    <TH>Name</TH>
                    <TH>Company</TH>
                    <TH>Email</TH>
                    <TH>Owner</TH>
                    <TH right>Status</TH>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.name}
                      onClick={() => setPicked(r.name)}
                      className={`cursor-pointer border-t border-ink/6 transition-colors ${
                        picked === r.name ? "bg-lime-light/60" : "hover:bg-panel-2/60"
                      }`}
                    >
                      <td className="px-2.5 py-[7px] text-[10.5px] font-medium">{r.name}</td>
                      <td className="px-2.5 py-[7px] text-[10px] text-fg/60">{r.company}</td>
                      <td className="px-2.5 py-[7px] text-[9.5px] text-fg/45">{r.email}</td>
                      <td className="px-2.5 py-[7px] text-[10px] text-fg/55">{r.owner}</td>
                      <td className="px-2.5 py-[7px] text-right"><Pill v={r.status} /></td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-2.5 py-6 text-center text-[10px] text-fg/35">
                        No customers match that search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {nav === "Leads" && (
          <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-ink/8 bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f6f9f4] text-left text-[8.5px] uppercase tracking-wide text-fg/40">
                  <TH>Lead</TH>
                  <TH>Source</TH>
                  <TH right>Value</TH>
                  <TH right>Stage</TH>
                </tr>
              </thead>
              <tbody>
                {LEADS.map((l) => (
                  <tr key={l.name} className="border-t border-ink/6 hover:bg-panel-2/50">
                    <td className="px-2.5 py-[7px] text-[10.5px] font-medium">{l.name}</td>
                    <td className="px-2.5 py-[7px] text-[10px] text-fg/55">{l.source}</td>
                    <td className="px-2.5 py-[7px] text-right text-[10.5px] font-semibold tabular-nums">{l.value}</td>
                    <td className="px-2.5 py-[7px] text-right"><Pill v={l.stage} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {nav === "Projects" && (
          <div className="min-h-0 flex-1 rounded-lg border border-ink/8 bg-white p-3">
            <ul className="space-y-3">
              {PROJECTS.map((p) => (
                <li key={p.name}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] font-medium">{p.name}</span>
                    <span className="text-[9.5px] text-fg/45">{p.client}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel-2">
                      <div className="h-full rounded-full bg-lime" style={{ width: `${p.pct}%` }} />
                    </div>
                    <span className="w-7 text-right text-[9.5px] tabular-nums text-fg/50">{p.pct}%</span>
                    <Pill v={p.stage} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {nav === "Invoices" && (
          <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-ink/8 bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f6f9f4] text-left text-[8.5px] uppercase tracking-wide text-fg/40">
                  <TH>Invoice</TH>
                  <TH>Client</TH>
                  <TH right>Amount</TH>
                  <TH right>Status</TH>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((iv) => (
                  <tr key={iv.id} className="border-t border-ink/6 hover:bg-panel-2/50">
                    <td className="px-2.5 py-[7px] font-mono text-[10px] text-fg/50">{iv.id}</td>
                    <td className="px-2.5 py-[7px] text-[10.5px]">{iv.client}</td>
                    <td className="px-2.5 py-[7px] text-right text-[10.5px] font-semibold tabular-nums">{iv.amount}</td>
                    <td className="px-2.5 py-[7px] text-right"><Pill v={iv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
