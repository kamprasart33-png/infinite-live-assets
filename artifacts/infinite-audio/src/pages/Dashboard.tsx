import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  BarChart2, Music, FileText, Users, DollarSign, TrendingUp,
  Zap, LogOut, Bell, Search, Plus, Play, ShieldCheck, ChevronRight,
  Send, ArrowUpRight, RefreshCw, AlertCircle, Loader2,
} from "lucide-react";
import {
  useDashboardMetrics, useRevenueHistory, useDailySales,
  useTracks, useTopTracks, useCustomers,
  useRecentTransactions, useActiveLicenses, useLicensesByType,
  useAstraCommand,
} from "@/hooks/use-dashboard-data";
import { centsToDisplay, timeAgo, type TopTrack, type Transaction, type Customer, type Track } from "@/lib/api";

// ─── Design tokens ───────────────────────────────────────────────────────────

const C = {
  cyan: "#06b6d4",
  cyanLight: "#22d3ee",
  purple: "#a855f7",
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
  card: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(6,182,212,0.3)",
  muted: "#6b7280",
  sub: "#9ca3af",
};

const chartTooltipStyle = {
  backgroundColor: "rgba(6,8,15,0.95)",
  border: `1px solid ${C.borderHover}`,
  borderRadius: 10,
  color: "#e5e7eb",
  fontSize: "0.8rem",
};

const PIE_COLORS = [C.cyan, C.purple, C.green, C.amber, "#f97316"];

// ─── Shared primitives ────────────────────────────────────────────────────────

function card(extra?: React.CSSProperties): React.CSSProperties {
  return { background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, ...extra };
}

function KpiCard({
  label, value, sub, up, loading,
}: {
  label: string; value: string; sub?: string; up?: boolean; loading?: boolean;
}) {
  return (
    <div style={card({ padding: "1.25rem 1.5rem" })}>
      <div style={{ fontSize: "0.72rem", color: C.muted, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: C.muted }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: "0.85rem" }}>Loading…</span>
        </div>
      ) : (
        <div style={{ fontSize: "1.75rem", fontWeight: 800, lineHeight: 1 }}>{value}</div>
      )}
      {sub && !loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.4rem", fontSize: "0.78rem", color: up ? C.green : C.red }}>
          <ArrowUpRight size={13} />{sub}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    active:   { bg: "rgba(34,197,94,0.15)",  color: C.green },
    pending:  { bg: "rgba(245,158,11,0.15)", color: C.amber },
    expired:  { bg: "rgba(239,68,68,0.15)",  color: C.red },
    inactive: { bg: "rgba(107,114,128,0.15)",color: C.muted },
  };
  const s = cfg[status.toLowerCase()] ?? cfg.inactive;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.65rem", borderRadius: 9999 }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function SectionLoader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: C.muted, gap: "0.5rem" }}>
      <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
      <span>Loading…</span>
    </div>
  );
}

function SectionError({ message }: { message: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: C.red, padding: "1rem", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
      <AlertCircle size={16} /> {message}
    </div>
  );
}

// ─── Section: Revenue ─────────────────────────────────────────────────────────

function RevenueSection() {
  const { data: metrics, isLoading: mLoading, error: mErr } = useDashboardMetrics();
  const { data: history, isLoading: hLoading } = useRevenueHistory();
  const { data: byType, isLoading: tLoading } = useLicensesByType();
  const { data: topTracks, isLoading: trLoading } = useTopTracks(5);

  const historyData = (history ?? []).map(r => ({
    month: r.month,
    revenue: Math.round(Number(r.revenue) / 100),
  }));

  const pieData = (byType ?? []).map(r => ({
    name: r.license_type,
    value: Math.round(Number(r.revenue_cents) / 100),
  }));

  const maxRevenue = topTracks ? Math.max(...topTracks.map(t => Number(t.revenue_cents))) : 1;

  return (
    <div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>Revenue Overview</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <KpiCard label="Today" value={mErr ? "—" : centsToDisplay(metrics?.todayRevenueCents ?? 0)} loading={mLoading} />
        <KpiCard label="This Month" value={mErr ? "—" : centsToDisplay(metrics?.monthlyRevenueCents ?? 0)} sub="Live data" up loading={mLoading} />
        <KpiCard label="Total Revenue" value={mErr ? "—" : centsToDisplay(metrics?.totalRevenueCents ?? 0)} loading={mLoading} />
        <KpiCard label="Avg License" value={mErr ? "—" : centsToDisplay(metrics?.avgLicenseCents ?? 0)} loading={mLoading} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
        <div style={card({ padding: "1.5rem" })}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem", color: C.sub }}>12-Month Revenue</div>
          {hLoading ? <SectionLoader /> : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.cyan} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.cyan} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke={C.cyan} strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={card({ padding: "1.25rem", flex: 1 })}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem", color: C.sub }}>By License Type</div>
            {tLoading ? <SectionLoader /> : (
              <>
                <ResponsiveContainer width="100%" height={130}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={55}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem 0.75rem" }}>
                  {pieData.map((d, i) => (
                    <span key={d.name} style={{ fontSize: "0.7rem", color: C.sub, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length], display: "inline-block" }} />
                      {d.name}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={card({ padding: "1.25rem", flex: 1 })}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.85rem", color: C.sub }}>Top Earners</div>
            {trLoading ? <SectionLoader /> : (topTracks ?? []).map((t: TopTrack) => (
              <div key={t.id} style={{ marginBottom: "0.65rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.25rem" }}>
                  <span>{t.title}</span>
                  <span style={{ color: C.cyan }}>{centsToDisplay(Number(t.revenue_cents))}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 9999 }}>
                  <div style={{ height: 4, width: `${maxRevenue > 0 ? Math.round((Number(t.revenue_cents) / maxRevenue) * 100) : 0}%`, background: `linear-gradient(90deg,${C.cyan},${C.purple})`, borderRadius: 9999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Music Library ───────────────────────────────────────────────────

function LibrarySection() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { data: tracks, isLoading, error } = useTracks();

  const genres = ["All", ...Array.from(new Set((tracks ?? []).map(t => t.genre).filter(Boolean) as string[]))];
  const filtered = (tracks ?? []).filter(t =>
    (filter === "All" || t.genre === filter) &&
    (!search || t.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Music Library</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.8rem", color: C.muted }}>{tracks?.length ?? "—"} tracks</span>
          <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: C.cyan, color: "#000", border: "none", borderRadius: 9999, padding: "0.5rem 1.1rem", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
            <Plus size={15} /> Add Track
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.muted }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tracks…"
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 10, padding: "0.55rem 0.75rem 0.55rem 2.25rem", color: "#fff", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {genres.slice(0, 6).map(g => (
            <button key={g} onClick={() => setFilter(g)} style={{ background: filter === g ? C.cyan : "rgba(255,255,255,0.05)", color: filter === g ? "#000" : C.sub, border: "none", borderRadius: 9999, padding: "0.4rem 0.9rem", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
              {g}
            </button>
          ))}
        </div>
      </div>

      {error ? <SectionError message="Failed to load tracks" /> : isLoading ? <SectionLoader /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1rem" }}>
          {filtered.map((t: Track) => (
            <div key={t.id}
              style={card({ padding: "1.25rem", transition: "border-color 0.2s" })}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.borderHover)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>{t.title}</div>
                  <div style={{ fontSize: "0.72rem", color: C.muted }}>{t.artist} · {t.duration ?? "—"}</div>
                </div>
                <button style={{ width: 32, height: 32, borderRadius: "50%", background: `rgba(6,182,212,0.15)`, border: `1px solid rgba(6,182,212,0.3)`, color: C.cyan, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Play size={13} fill={C.cyan} />
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: "rgba(168,85,247,0.15)", color: C.purple, fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: 9999 }}>{t.genre ?? "Unknown"}</span>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: C.cyan }}>{centsToDisplay(t.priceCents)}</span>
                  <button style={{ background: `rgba(6,182,212,0.1)`, border: `1px solid rgba(6,182,212,0.3)`, color: C.cyan, borderRadius: 8, padding: "0.25rem 0.65rem", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>License</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section: Licenses ────────────────────────────────────────────────────────

function LicensesSection() {
  const { data: metrics, isLoading: mLoading } = useDashboardMetrics();
  const { data: licenses, isLoading, error } = useActiveLicenses();

  return (
    <div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>License Management</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <KpiCard label="Active Licenses" value={String(metrics?.activeLicenses ?? "—")} loading={mLoading} />
        <KpiCard label="Total Sales" value={String(metrics?.totalSales ?? "—")} loading={mLoading} />
        <KpiCard label="Monthly Revenue" value={centsToDisplay(metrics?.monthlyRevenueCents ?? 0)} loading={mLoading} sub="Live" up />
        <KpiCard label="Avg License" value={centsToDisplay(metrics?.avgLicenseCents ?? 0)} loading={mLoading} />
      </div>

      {error ? <SectionError message="Failed to load licenses" /> : isLoading ? <SectionLoader /> : (
        <div style={card({ overflow: "hidden" })}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Track", "Customer", "Type", "Date", "Amount", "Status"].map(h => (
                  <th key={h} style={{ padding: "0.85rem 1.25rem", textAlign: "left", color: C.muted, fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(licenses ?? []).slice(0, 12).map((l: Transaction) => (
                <tr key={l.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "0.85rem 1.25rem", fontWeight: 600 }}>{l.trackTitle ?? "—"}</td>
                  <td style={{ padding: "0.85rem 1.25rem", color: C.sub }}>{l.customerName ?? "—"}</td>
                  <td style={{ padding: "0.85rem 1.25rem" }}>
                    <span style={{ background: "rgba(6,182,212,0.1)", color: C.cyan, fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.65rem", borderRadius: 9999 }}>{l.licenseType}</span>
                  </td>
                  <td style={{ padding: "0.85rem 1.25rem", color: C.muted }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700, color: C.green }}>{centsToDisplay(l.amountCents)}</td>
                  <td style={{ padding: "0.85rem 1.25rem" }}><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Section: Customers ───────────────────────────────────────────────────────

function CustomersSection() {
  const { data: metrics, isLoading: mLoading } = useDashboardMetrics();
  const { data: customers, isLoading, error } = useCustomers();

  return (
    <div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>Customers</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <KpiCard label="Total Customers" value={String(customers?.length ?? "—")} loading={isLoading} />
        <KpiCard label="Active" value={String(metrics?.activeCustomers ?? "—")} loading={mLoading} />
        <KpiCard label="Avg Spend" value={centsToDisplay(
          customers && customers.length > 0
            ? Math.round(customers.reduce((s, c) => s + c.totalSpentCents, 0) / customers.length)
            : 0
        )} loading={isLoading} />
        <KpiCard label="Total Revenue" value={centsToDisplay(metrics?.totalRevenueCents ?? 0)} loading={mLoading} />
      </div>

      {error ? <SectionError message="Failed to load customers" /> : isLoading ? <SectionLoader /> : (
        <div style={card({ overflow: "hidden" })}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {["Customer", "Email", "Total Spent", "Joined", "Status"].map(h => (
                  <th key={h} style={{ padding: "0.85rem 1.25rem", textAlign: "left", color: C.muted, fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(customers ?? []).map((c: Customer) => {
                const initials = c.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "0.85rem 1.25rem", color: C.muted }}>{c.email}</td>
                    <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700, color: C.green }}>{centsToDisplay(c.totalSpentCents)}</td>
                    <td style={{ padding: "0.85rem 1.25rem", color: C.muted }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "0.85rem 1.25rem" }}><StatusBadge status={c.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Section: Sales ───────────────────────────────────────────────────────────

function SalesSection() {
  const { data: metrics, isLoading: mLoading } = useDashboardMetrics();
  const { data: dailySales, isLoading: dLoading } = useDailySales();
  const { data: recent, isLoading: rLoading } = useRecentTransactions(6);

  const salesChartData = (dailySales ?? []).map(r => ({
    day: r.day,
    sales: Math.round(Number(r.sales) / 100),
  }));

  return (
    <div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>Sales</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <KpiCard label="Today" value={centsToDisplay(metrics?.todayRevenueCents ?? 0)} loading={mLoading} />
        <KpiCard label="Monthly" value={centsToDisplay(metrics?.monthlyRevenueCents ?? 0)} loading={mLoading} sub="Live" up />
        <KpiCard label="Total Sales" value={String(metrics?.totalSales ?? "—")} loading={mLoading} />
        <KpiCard label="Active Licenses" value={String(metrics?.activeLicenses ?? "—")} loading={mLoading} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
        <div style={card({ padding: "1.5rem" })}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem", color: C.sub }}>Daily Sales — Last 14 Days</div>
          {dLoading ? <SectionLoader /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Sales"]} />
                <Bar dataKey="sales" fill={C.cyan} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={card({ padding: "1.5rem" })}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem", color: C.sub }}>Recent Transactions</div>
          {rLoading ? <SectionLoader /> : (recent ?? []).map((tx: Transaction) => (
            <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{tx.trackTitle ?? "—"}</div>
                <div style={{ fontSize: "0.72rem", color: C.muted }}>{tx.customerName ?? "—"} · {timeAgo(tx.createdAt)}</div>
              </div>
              <span style={{ color: C.green, fontWeight: 700, fontSize: "0.9rem" }}>{centsToDisplay(tx.amountCents)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Analytics ───────────────────────────────────────────────────────

function AnalyticsSection() {
  const { data: metrics, isLoading: mLoading } = useDashboardMetrics();
  const { data: history, isLoading: hLoading } = useRevenueHistory();

  // Build visitor-like data from revenue history for the line chart
  const lineData = (history ?? []).map((r, i) => ({
    month: r.month,
    revenue: Math.round(Number(r.revenue) / 100),
    transactions: Math.round(Number(r.revenue) / 6500), // rough avg license
  }));

  return (
    <div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>Analytics</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <KpiCard label="Total Tracks" value={String(metrics?.totalTracks ?? "—")} loading={mLoading} />
        <KpiCard label="Active Customers" value={String(metrics?.activeCustomers ?? "—")} loading={mLoading} />
        <KpiCard label="Total Sales" value={String(metrics?.totalSales ?? "—")} loading={mLoading} />
        <KpiCard label="Total Revenue" value={centsToDisplay(metrics?.totalRevenueCents ?? 0)} loading={mLoading} />
      </div>

      <div style={card({ padding: "1.5rem" })}>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem", color: C.sub }}>Revenue & Transaction Volume — 12 Months</div>
        {hLoading ? <SectionLoader /> : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "0.78rem", color: C.muted }} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke={C.cyan} strokeWidth={2} dot={false} name="Revenue ($)" />
              <Line yAxisId="right" type="monotone" dataKey="transactions" stroke={C.purple} strokeWidth={2} dot={false} name="Transactions" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ─── Section: Astra AI ────────────────────────────────────────────────────────

interface AstraMessage {
  role: "user" | "astra";
  text?: string;
  label?: string;
  data?: unknown;
  error?: string;
}

function renderAstraData(intent: string, data: unknown): React.ReactNode {
  if (!data || typeof data !== "object") return null;

  // Dashboard metrics
  if (intent === "dashboard_metrics" || intent === "today_revenue" || intent === "monthly_revenue") {
    const d = data as Record<string, number>;
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.75rem" }}>
        {Object.entries(d).map(([k, v]) => {
          const label = k.replace(/([A-Z])/g, " $1").replace(/cents$/i, "").trim();
          const display = k.toLowerCase().includes("cents") ? centsToDisplay(Number(v)) : String(v);
          return (
            <div key={k} style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 8, padding: "0.5rem 0.75rem" }}>
              <div style={{ fontSize: "0.65rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ fontWeight: 700, color: C.cyan }}>{display}</div>
            </div>
          );
        })}
      </div>
    );
  }

  // Track list
  if (intent === "top_tracks" && Array.isArray(data)) {
    return (
      <div style={{ marginTop: "0.75rem" }}>
        {(data as TopTrack[]).slice(0, 5).map((t, i) => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.82rem" }}>
            <span style={{ color: C.muted, marginRight: "0.5rem" }}>#{i + 1}</span>
            <span style={{ flex: 1 }}>{t.title}</span>
            <span style={{ color: C.cyan, fontWeight: 700 }}>{centsToDisplay(Number(t.revenue_cents))}</span>
          </div>
        ))}
      </div>
    );
  }

  // Transaction / license list
  if ((intent === "active_licenses" || intent === "recent_transactions") && Array.isArray(data)) {
    return (
      <div style={{ marginTop: "0.75rem" }}>
        {(data as Transaction[]).slice(0, 5).map(tx => (
          <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.82rem" }}>
            <div>
              <div style={{ fontWeight: 600 }}>{tx.trackTitle ?? "—"}</div>
              <div style={{ fontSize: "0.72rem", color: C.muted }}>{tx.customerName} · {tx.licenseType}</div>
            </div>
            <span style={{ color: C.green, fontWeight: 700 }}>{centsToDisplay(tx.amountCents)}</span>
          </div>
        ))}
      </div>
    );
  }

  // Customer list
  if ((intent === "newest_customers" || intent === "active_customers") && Array.isArray(data)) {
    return (
      <div style={{ marginTop: "0.75rem" }}>
        {(data as Customer[]).slice(0, 5).map(c => {
          const initials = c.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
          return (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.82rem" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0 }}>{initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: "0.7rem", color: C.muted }}>{c.email}</div>
              </div>
              <StatusBadge status={c.status} />
            </div>
          );
        })}
      </div>
    );
  }

  // Unknown / suggestions
  if (intent === "unknown") {
    const d = data as { message: string; suggestions: string[] };
    return (
      <div style={{ marginTop: "0.5rem" }}>
        <div style={{ fontSize: "0.82rem", color: C.sub, marginBottom: "0.5rem" }}>{d.message}</div>
        {d.suggestions.map((s, i) => (
          <div key={i} style={{ fontSize: "0.78rem", color: C.cyan, padding: "0.2rem 0" }}>{s}</div>
        ))}
      </div>
    );
  }

  return null;
}

const STARTER_PROMPTS = [
  "Show today's revenue",
  "Find my top-selling tracks",
  "Show active licenses",
  "List my newest customers",
];

function AstraSection() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AstraMessage[]>([]);
  const astra = useAstraCommand();

  const submit = async (cmd?: string) => {
    const command = (cmd ?? input).trim();
    if (!command) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: command }]);
    try {
      const result = await astra.mutateAsync(command);
      setMessages(prev => [...prev, { role: "astra", label: result.label, data: result.data, text: undefined }]);
    } catch {
      setMessages(prev => [...prev, { role: "astra", error: "Astra failed to respond. Check the API connection." }]);
    }
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, rgba(6,182,212,0.1), rgba(168,85,247,0.1))`, border: `1px solid rgba(6,182,212,0.25)`, borderRadius: 16, padding: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "2rem" }}>
        <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid rgba(6,182,212,0.3)`, animation: "spin 8s linear infinite" }} />
          <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: `1px solid rgba(168,85,247,0.3)` }} />
          <div style={{ position: "absolute", inset: 18, borderRadius: "50%", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 24px rgba(6,182,212,0.4)` }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", color: C.cyan, textTransform: "uppercase", marginBottom: "0.35rem" }}>Astra AI · Live</div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.35rem" }}>Ask Astra anything about your catalog</h3>
          <p style={{ color: C.sub, fontSize: "0.875rem" }}>Query live data with natural language. Astra routes your command to the right business service.</p>
        </div>
      </div>

      {/* Starter prompts */}
      {messages.length === 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {STARTER_PROMPTS.map(p => (
            <button key={p} onClick={() => submit(p)} style={{ background: "rgba(6,182,212,0.08)", border: `1px solid rgba(6,182,212,0.25)`, color: C.cyan, borderRadius: 9999, padding: "0.45rem 1rem", fontSize: "0.8rem", cursor: "pointer", fontWeight: 500 }}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Conversation */}
      {messages.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem", maxHeight: 480, overflowY: "auto", paddingRight: "0.25rem" }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              background: m.role === "user" ? `rgba(6,182,212,0.12)` : "rgba(255,255,255,0.03)",
              border: `1px solid ${m.role === "user" ? "rgba(6,182,212,0.3)" : C.border}`,
              borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              padding: "0.85rem 1rem",
            }}>
              {m.role === "user" ? (
                <span style={{ fontSize: "0.875rem" }}>{m.text}</span>
              ) : m.error ? (
                <span style={{ fontSize: "0.875rem", color: C.red }}>{m.error}</span>
              ) : (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <Zap size={13} color={C.cyan} fill={C.cyan} />
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: C.cyan }}>{m.label}</span>
                  </div>
                  {renderAstraData(
                    messages.slice(0, i).filter(x => x.role === "user").slice(-1)[0]?.text
                      ? (() => {
                          const cmd = messages.slice(0, i).filter(x => x.role === "user").slice(-1)[0]!.text!;
                          // re-derive intent label from data
                          return (m.label ?? "").toLowerCase().includes("revenue") ? "today_revenue"
                            : (m.label ?? "").toLowerCase().includes("track") ? "top_tracks"
                            : (m.label ?? "").toLowerCase().includes("licen") ? "active_licenses"
                            : (m.label ?? "").toLowerCase().includes("customer") ? "newest_customers"
                            : (m.label ?? "").toLowerCase().includes("transaction") ? "recent_transactions"
                            : (m.label ?? "").toLowerCase().includes("metric") || (m.label ?? "").toLowerCase().includes("dashboard") ? "dashboard_metrics"
                            : "unknown";
                        })()
                      : "unknown",
                    m.data
                  )}
                </div>
              )}
            </div>
          ))}
          {astra.isPending && (
            <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "0.5rem", color: C.muted, fontSize: "0.82rem", padding: "0.5rem 0" }}>
              <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Astra is thinking…
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 14, padding: "0.85rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}
        onFocus={e => (e.currentTarget.style.borderColor = "rgba(6,182,212,0.3)")}
        onBlur={e => (e.currentTarget.style.borderColor = C.border)}
      >
        <Zap size={15} color={C.cyan} style={{ flexShrink: 0 }} />
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Ask Astra — &quot;Show today's revenue&quot;, &quot;Find my top-selling tracks&quot;…"
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "0.875rem" }}
        />
        <button
          onClick={() => submit()}
          disabled={astra.isPending || !input.trim()}
          style={{ background: input.trim() ? `linear-gradient(135deg,${C.cyan},${C.purple})` : "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "0.5rem 0.75rem", cursor: input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
        >
          {astra.isPending ? <Loader2 size={15} color="#fff" style={{ animation: "spin 1s linear infinite" }} /> : <Send size={15} color="#fff" />}
        </button>
      </div>

      {messages.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.75rem" }}>
          {STARTER_PROMPTS.map(p => (
            <button key={p} onClick={() => submit(p)} style={{ background: "transparent", border: `1px solid rgba(255,255,255,0.08)`, color: C.muted, borderRadius: 9999, padding: "0.3rem 0.7rem", fontSize: "0.72rem", cursor: "pointer" }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const NAV = [
  { id: "revenue",   label: "Revenue",       icon: BarChart2 },
  { id: "library",   label: "Music Library",  icon: Music },
  { id: "licenses",  label: "Licenses",       icon: FileText },
  { id: "customers", label: "Customers",      icon: Users },
  { id: "sales",     label: "Sales",          icon: DollarSign },
  { id: "analytics", label: "Analytics",      icon: TrendingUp },
  { id: "astra",     label: "Astra AI",       icon: Zap },
];

// ─── Dashboard Root ────────────────────────────────────────────────────────────

export default function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [active, setActive] = useState("revenue");
  const { data: metrics } = useDashboardMetrics();

  const SECTIONS: Record<string, React.ReactNode> = {
    revenue:   <RevenueSection />,
    library:   <LibrarySection />,
    licenses:  <LicensesSection />,
    customers: <CustomersSection />,
    sales:     <SalesSection />,
    analytics: <AnalyticsSection />,
    astra:     <AstraSection />,
  };

  const activeNav = NAV.find(n => n.id === active);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: "rgba(255,255,255,0.02)", borderRight: `1px solid rgba(255,255,255,0.07)`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 20 }}>
        {/* Logo */}
        <div style={{ padding: "1.25rem 1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={15} color="#fff" fill="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "-0.01em" }}>ASTRA</div>
              <div style={{ fontSize: "0.6rem", color: C.muted, letterSpacing: "0.05em" }}>COMMAND CENTER</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", overflow: "auto" }}>
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => setActive(item.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "0.65rem",
                background: isActive ? "rgba(6,182,212,0.12)" : "transparent",
                border: isActive ? "1px solid rgba(6,182,212,0.25)" : "1px solid transparent",
                borderRadius: 10, padding: "0.65rem 0.85rem",
                color: isActive ? C.cyan : C.muted,
                fontWeight: isActive ? 600 : 500, fontSize: "0.875rem",
                cursor: "pointer", marginBottom: "0.2rem", textAlign: "left",
                transition: "all 0.15s",
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#d1d5db"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = C.muted; }}
              >
                <Icon size={16} />
                {item.label}
                {item.id === "astra" && (
                  <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.cyan }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* User + sign out */}
        <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.75rem", marginBottom: "0.4rem" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg,${C.cyan},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0 }}>KS</div>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>Prasart K.</div>
              <div style={{ fontSize: "0.65rem", color: C.muted }}>Admin</div>
            </div>
            <Bell size={14} color={C.muted} style={{ marginLeft: "auto", cursor: "pointer" }} />
          </div>
          <button onClick={onSignOut} style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.65rem", background: "transparent", border: "1px solid transparent", borderRadius: 10, padding: "0.6rem 0.85rem", color: C.muted, fontWeight: 500, fontSize: "0.825rem", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = C.red; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; e.currentTarget.style.background = "rgba(239,68,68,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Top bar */}
        <header style={{ height: 56, borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.75rem", position: "sticky", top: 0, background: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {activeNav && <activeNav.icon size={16} color={C.cyan} />}
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{activeNav?.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {metrics && (
              <div style={{ fontSize: "0.72rem", color: C.muted }}>
                {metrics.totalTracks} tracks · {metrics.activeCustomers} customers · {metrics.activeLicenses} licenses
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 9999, padding: "0.25rem 0.75rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block" }} />
              <span style={{ fontSize: "0.72rem", color: C.green, fontWeight: 600 }}>LIVE</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 9999, padding: "0.25rem 0.75rem" }}>
              <TrendingUp size={12} color={C.cyan} />
              <span style={{ fontSize: "0.72rem", color: C.cyan, fontWeight: 600 }}>PostgreSQL</span>
            </div>
            <ShieldCheck size={14} color={C.muted} />
            <ChevronRight size={14} color={C.muted} />
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: "2rem 1.75rem", overflowY: "auto" }}>
          {SECTIONS[active]}
        </div>
      </main>
    </div>
  );
}
