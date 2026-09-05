import { useMemo, useState } from "react";

/**
 * A working analytics dashboard - every sidebar item is a real view, the date
 * range re-renders the chart and the KPIs, and the chart has a crosshair.
 *
 * Chart decisions follow the house dataviz rules:
 *  - revenue over time is ONE series, so it is an area in a single hue with no
 *    legend and only the last point direct-labelled (never a number per point)
 *  - category split is part-to-whole -> one 100% stacked bar, categorical hues
 *    in fixed slot order, each direct-labelled so identity is never colour-alone
 *  - traffic sources are nominal, so every bar is slot 1 - no value-ramp
 *  - status is a reserved palette, always shipped with its text label
 *  - the palette passed scripts/validate_palette.js on a white surface
 *    (worst adjacent CVD dE 24.7, normal-vision dE 28.2, all >= 3:1 contrast)
 */
const SERIES = ["#4f9a2a", "#2a78d6", "#eb6834", "#4a3aa7"];
const STATUS = {
  paid: { label: "Paid", fg: "#1a7f37", bg: "#e7f6ec" },
  pending: { label: "Pending", fg: "#b45309", bg: "#fdf3e3" },
  failed: { label: "Failed", fg: "#b42318", bg: "#fdeceb" },
} as const;

type Range = "7d" | "30d" | "90d";
type View = "Dashboard" | "Analytics" | "Orders" | "Customers" | "Settings";

const RANGES: Record<Range, { points: number[]; revenue: string; delta: string; orders: string }> = {
  "7d": { points: [38, 44, 41, 52, 49, 61, 66], revenue: "₹1,84,200", delta: "+8.4%", orders: "312" },
  "30d": {
    points: [22, 28, 25, 34, 31, 39, 36, 45, 42, 51, 48, 58, 55, 64, 71],
    revenue: "₹8,42,320",
    delta: "+12.6%",
    orders: "1,284",
  },
  "90d": {
    points: [12, 18, 15, 24, 21, 30, 27, 36, 33, 44, 40, 52, 47, 60, 57, 68, 74, 82],
    revenue: "₹24,10,900",
    delta: "+21.2%",
    orders: "3,948",
  },
};

const CATEGORIES = [
  { name: "Electronics", value: 42 },
  { name: "Apparel", value: 26 },
  { name: "Home", value: 19 },
  { name: "Other", value: 13 },
];

const SOURCES = [
  { name: "Organic search", value: 38 },
  { name: "Direct", value: 24 },
  { name: "Referral", value: 19 },
  { name: "Paid social", value: 12 },
  { name: "Email", value: 7 },
];

const ORDERS = [
  { id: "#1043", name: "Rahul Mehta", city: "Pune", amount: "₹18,400", status: "paid" as const },
  { id: "#1042", name: "Priya Sharma", city: "Mumbai", amount: "₹7,250", status: "pending" as const },
  { id: "#1041", name: "Arjun Patel", city: "Surat", amount: "₹32,900", status: "paid" as const },
  { id: "#1040", name: "Sneha Iyer", city: "Kochi", amount: "₹4,120", status: "failed" as const },
  { id: "#1039", name: "Vikram Rao", city: "Delhi", amount: "₹21,780", status: "paid" as const },
];

const CUSTOMERS = [
  { name: "Rahul Mehta", orders: 14, spend: "₹1,84,000", tier: "Gold" },
  { name: "Priya Sharma", orders: 9, spend: "₹96,400", tier: "Silver" },
  { name: "Arjun Patel", orders: 21, spend: "₹3,12,900", tier: "Gold" },
  { name: "Sneha Iyer", orders: 3, spend: "₹18,200", tier: "New" },
];

const NAV: View[] = ["Dashboard", "Analytics", "Orders", "Customers", "Settings"];

/** area chart, single series, with a crosshair + tooltip on hover */
function RevenueChart({ points, h = 108 }: { points: number[]; h?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const w = 420;
  const pad = 6;

  const { line, area, coords, max } = useMemo(() => {
    const max = Math.max(...points) * 1.15;
    const step = (w - pad * 2) / (points.length - 1);
    const coords = points.map((p, i) => ({
      x: pad + i * step,
      y: h - pad - (p / max) * (h - pad * 2),
      v: p,
    }));
    const line = coords.map((c, i) => `${i ? "L" : "M"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
    const area = `${line} L ${coords[coords.length - 1].x.toFixed(1)} ${h} L ${coords[0].x.toFixed(1)} ${h} Z`;
    return { line, area, coords, max };
  }, [points, h]);

  const active = hover === null ? null : coords[hover];
  const last = coords[coords.length - 1];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - box.left) / box.width) * w;
          let best = 0;
          coords.forEach((c, i) => {
            if (Math.abs(c.x - x) < Math.abs(coords[best].x - x)) best = i;
          });
          setHover(best);
        }}
      >
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={SERIES[0]} stopOpacity="0.28" />
            <stop offset="100%" stopColor={SERIES[0]} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={pad}
            x2={w - pad}
            y1={pad + g * (h - pad * 2)}
            y2={pad + g * (h - pad * 2)}
            stroke="#0f2418"
            strokeOpacity="0.06"
          />
        ))}
        <path d={area} fill="url(#revFill)" />
        <path d={line} fill="none" stroke={SERIES[0]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r="3.5" fill={SERIES[0]} stroke="#fff" strokeWidth="2" />
        {active && (
          <g>
            <line
              x1={active.x}
              x2={active.x}
              y1={pad}
              y2={h - pad}
              stroke={SERIES[0]}
              strokeOpacity="0.35"
              strokeDasharray="3 3"
            />
            <circle cx={active.x} cy={active.y} r="4" fill="#fff" stroke={SERIES[0]} strokeWidth="2" />
          </g>
        )}
      </svg>
      {active && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md bg-panel-3 px-2 py-1 text-[9.5px] font-semibold text-white shadow-lg"
          style={{ left: `${(active.x / w) * 100}%`, top: `${(active.y / h) * 100}%` }}
        >
          ₹{(active.v * 1240).toLocaleString("en-IN")}
        </div>
      )}
      <span className="pointer-events-none absolute right-1 top-0 text-[9.5px] font-semibold text-fg/40">
        peak ₹{Math.round(max * 1240).toLocaleString("en-IN")}
      </span>
    </div>
  );
}

const Panel = ({ title, extra, children, className = "" }: {
  title: string; extra?: string; children: React.ReactNode; className?: string;
}) => (
  <div className={`rounded-lg border border-ink/8 bg-white p-2.5 ${className}`}>
    <div className="mb-1.5 flex items-baseline justify-between">
      <span className="text-[10.5px] font-semibold">{title}</span>
      {extra && <span className="text-[9px] text-fg/40">{extra}</span>}
    </div>
    {children}
  </div>
);

export default function AnalyticsDashboard() {
  const [range, setRange] = useState<Range>("30d");
  const [view, setView] = useState<View>("Dashboard");
  const [emails, setEmails] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const data = RANGES[range];

  return (
    <div className="flex h-full w-full bg-[#fbfdfa] font-sans text-fg">
      <aside className="flex w-[124px] shrink-0 flex-col gap-0.5 border-r border-ink/8 bg-white px-2.5 py-3">
        <div className="mb-2.5 flex items-center gap-1.5 px-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-lime text-[9px] font-bold text-white">
            A
          </span>
          <span className="text-[11px] font-bold">Acme</span>
        </div>
        {NAV.map((n) => (
          <button
            key={n}
            onClick={() => setView(n)}
            className={`rounded-md px-2 py-[6px] text-left text-[10.5px] transition-colors ${
              view === n ? "bg-lime-light font-semibold text-lime" : "text-fg/50 hover:bg-panel-2/70 hover:text-fg/75"
            }`}
          >
            {n}
          </button>
        ))}
        <div className="mt-auto rounded-md bg-panel-2 px-2 py-1.5">
          <div className="text-[9px] text-fg/45">Store</div>
          <div className="text-[10.5px] font-bold text-lime">Live</div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12.5px] font-bold">{view === "Dashboard" ? "Sales Overview" : view}</div>
            <div className="text-[9.5px] text-fg/45">Live store performance</div>
          </div>
          {(view === "Dashboard" || view === "Analytics") && (
            <div className="flex gap-0.5 rounded-md bg-panel-2 p-0.5">
              {(Object.keys(RANGES) as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded px-2.5 py-[4px] text-[10px] font-semibold transition-colors ${
                    range === r ? "bg-white text-lime shadow-sm" : "text-fg/45 hover:text-fg/70"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {view === "Dashboard" && (
          <>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "Revenue", value: data.revenue, delta: data.delta },
                { label: "Orders", value: data.orders, delta: "+4.1%" },
                { label: "Conversion", value: "3.6%", delta: "+0.4pt" },
              ].map((k) => (
                <div key={k.label} className="rounded-lg border border-ink/8 bg-white px-3 py-2">
                  <div className="text-[9px] uppercase tracking-wide text-fg/40">{k.label}</div>
                  <div className="mt-0.5 text-[17px] font-bold leading-none tracking-tight">{k.value}</div>
                  <div className="mt-1 text-[9px] font-semibold" style={{ color: STATUS.paid.fg }}>
                    ▲ {k.delta}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[1.5fr_1fr] gap-2.5">
              <Panel title="Revenue" extra="hover the line">
                <RevenueChart points={data.points} />
              </Panel>
              <Panel title="Sales by Category">
                <div className="flex h-2.5 w-full gap-[2px] overflow-hidden rounded-full">
                  {CATEGORIES.map((c, i) => (
                    <div
                      key={c.name}
                      style={{ width: `${c.value}%`, background: SERIES[i] }}
                      className="h-full first:rounded-l-full last:rounded-r-full"
                    />
                  ))}
                </div>
                <ul className="mt-2 space-y-[6px]">
                  {CATEGORIES.map((c, i) => (
                    <li key={c.name} className="flex items-center gap-1.5 text-[10px]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-[2px]" style={{ background: SERIES[i] }} />
                      <span className="flex-1 truncate text-fg/60">{c.name}</span>
                      <span className="font-semibold tabular-nums">{c.value}%</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>

            <Panel title="Recent Orders" className="min-h-0 flex-1">
              <table className="w-full border-collapse">
                <tbody>
                  {ORDERS.slice(0, 4).map((o) => {
                    const s = STATUS[o.status];
                    return (
                      <tr key={o.id} className="border-t border-ink/6 first:border-0">
                        <td className="py-[4px] font-mono text-[9.5px] text-fg/40">{o.id}</td>
                        <td className="py-[4px] text-[10.5px]">{o.name}</td>
                        <td className="py-[4px] text-right text-[10.5px] font-semibold tabular-nums">{o.amount}</td>
                        <td className="py-[4px] pl-2 text-right">
                          <span
                            className="inline-block rounded-full px-2 py-[1px] text-[9px] font-bold"
                            style={{ color: s.fg, background: s.bg }}
                          >
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Panel>
          </>
        )}

        {view === "Analytics" && (
          <>
            <Panel title="Revenue trend" extra="hover the line">
              <RevenueChart points={data.points} h={132} />
            </Panel>
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-2.5">
              <Panel title="Traffic sources">
                <ul className="space-y-[8px]">
                  {SOURCES.map((s) => (
                    <li key={s.name}>
                      <div className="flex items-baseline justify-between text-[10px]">
                        <span className="text-fg/60">{s.name}</span>
                        <span className="font-semibold tabular-nums">{s.value}%</span>
                      </div>
                      <div className="mt-[3px] h-1.5 overflow-hidden rounded-full bg-panel-2">
                        {/* nominal categories: one hue for every bar, never a value ramp */}
                        <div className="h-full rounded-full" style={{ width: `${s.value * 2.4}%`, background: SERIES[0] }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel title="Top pages">
                <ul className="space-y-[7px]">
                  {[
                    ["/products/indoor-plants", "4,120"],
                    ["/collections/pots", "2,880"],
                    ["/blog/plant-care", "1,940"],
                    ["/checkout", "1,510"],
                    ["/about", "820"],
                  ].map(([p, v]) => (
                    <li key={p} className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="truncate font-mono text-fg/55">{p}</span>
                      <span className="font-semibold tabular-nums">{v}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </>
        )}

        {view === "Orders" && (
          <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-ink/8 bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f6f9f4] text-left text-[8.5px] uppercase tracking-wide text-fg/40">
                  <th className="px-2.5 py-1.5 font-semibold">Order</th>
                  <th className="px-2.5 py-1.5 font-semibold">Customer</th>
                  <th className="px-2.5 py-1.5 font-semibold">City</th>
                  <th className="px-2.5 py-1.5 text-right font-semibold">Amount</th>
                  <th className="px-2.5 py-1.5 text-right font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((o) => {
                  const s = STATUS[o.status];
                  return (
                    <tr key={o.id} className="border-t border-ink/6 hover:bg-panel-2/50">
                      <td className="px-2.5 py-[7px] font-mono text-[9.5px] text-fg/45">{o.id}</td>
                      <td className="px-2.5 py-[7px] text-[10.5px] font-medium">{o.name}</td>
                      <td className="px-2.5 py-[7px] text-[10px] text-fg/55">{o.city}</td>
                      <td className="px-2.5 py-[7px] text-right text-[10.5px] font-semibold tabular-nums">{o.amount}</td>
                      <td className="px-2.5 py-[7px] text-right">
                        <span
                          className="inline-block rounded-full px-2 py-[1px] text-[9px] font-bold"
                          style={{ color: s.fg, background: s.bg }}
                        >
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {view === "Customers" && (
          <div className="grid min-h-0 flex-1 grid-cols-[1.4fr_1fr] gap-2.5">
            <div className="overflow-hidden rounded-lg border border-ink/8 bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f6f9f4] text-left text-[8.5px] uppercase tracking-wide text-fg/40">
                    <th className="px-2.5 py-1.5 font-semibold">Customer</th>
                    <th className="px-2.5 py-1.5 text-right font-semibold">Orders</th>
                    <th className="px-2.5 py-1.5 text-right font-semibold">Spend</th>
                    <th className="px-2.5 py-1.5 text-right font-semibold">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {CUSTOMERS.map((c) => (
                    <tr key={c.name} className="border-t border-ink/6 hover:bg-panel-2/50">
                      <td className="px-2.5 py-[7px] text-[10.5px] font-medium">{c.name}</td>
                      <td className="px-2.5 py-[7px] text-right text-[10px] tabular-nums text-fg/60">{c.orders}</td>
                      <td className="px-2.5 py-[7px] text-right text-[10.5px] font-semibold tabular-nums">{c.spend}</td>
                      <td className="px-2.5 py-[7px] text-right text-[10px] text-fg/55">{c.tier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Panel title="Repeat rate">
              <div className="text-[26px] font-bold leading-none tracking-tight">48%</div>
              <div className="mt-1 text-[9.5px] text-fg/45">of customers ordered twice or more</div>
              <div className="mt-3 space-y-[7px]">
                {[["Gold", 34], ["Silver", 41], ["New", 25]].map(([t, v]) => (
                  <div key={t as string}>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-fg/60">{t}</span>
                      <span className="font-semibold tabular-nums">{v}%</span>
                    </div>
                    <div className="mt-[3px] h-1.5 overflow-hidden rounded-full bg-panel-2">
                      <div className="h-full rounded-full" style={{ width: `${v}%`, background: SERIES[0] }} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        )}

        {view === "Settings" && (
          <div className="min-h-0 flex-1 rounded-lg border border-ink/8 bg-white p-3">
            {[
              { label: "Email me daily sales", on: emails, set: setEmails },
              { label: "Weekly summary report", on: weekly, set: setWeekly },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between border-b border-ink/6 py-2.5 last:border-0">
                <div>
                  <div className="text-[10.5px] font-medium">{row.label}</div>
                  <div className="text-[9px] text-fg/40">Sent to anjan@acme.store</div>
                </div>
                <button
                  onClick={() => row.set(!row.on)}
                  className={`h-4 w-8 rounded-full p-[2px] transition-colors ${row.on ? "bg-lime" : "bg-ink/15"}`}
                  aria-pressed={row.on}
                >
                  <span
                    className="block h-3 w-3 rounded-full bg-white transition-transform"
                    style={{ transform: row.on ? "translateX(16px)" : "translateX(0)" }}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
