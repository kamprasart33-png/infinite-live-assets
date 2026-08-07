import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  BarChart2, Music, FileText, Users, DollarSign, TrendingUp,
  Zap, LogOut, Bell, Search, Plus, Play, ShieldCheck, ChevronRight,
  RefreshCw, Send, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────────────────

const revenueHistory = [
  { month: "Sep", revenue: 18200 }, { month: "Oct", revenue: 21400 },
  { month: "Nov", revenue: 19800 }, { month: "Dec", revenue: 24100 },
  { month: "Jan", revenue: 22600 }, { month: "Feb", revenue: 26300 },
  { month: "Mar", revenue: 23900 }, { month: "Apr", revenue: 28700 },
  { month: "May", revenue: 27400 }, { month: "Jun", revenue: 31200 },
  { month: "Jul", revenue: 29800 }, { month: "Aug", revenue: 31200 },
];

const salesData = [
  { day: "Jul 25", sales: 1840 }, { day: "Jul 26", sales: 2100 },
  { day: "Jul 27", sales: 1650 }, { day: "Jul 28", sales: 2430 },
  { day: "Jul 29", sales: 890 },  { day: "Jul 30", sales: 1200 },
  { day: "Jul 31", sales: 980 },  { day: "Aug 1", sales: 2870 },
  { day: "Aug 2", sales: 2100 },  { day: "Aug 3", sales: 1760 },
  { day: "Aug 4", sales: 3100 },  { day: "Aug 5", sales: 2430 },
  { day: "Aug 6", sales: 1980 },  { day: "Aug 7", sales: 2430 },
];

const visitorData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  visitors: Math.floor(350 + Math.random() * 200),
  conversions: Math.floor(25 + Math.random() * 30),
}));

const licenseTypeData = [
  { name: "YouTube", value: 38 },
  { name: "Commercial", value: 29 },
  { name: "Film", value: 21 },
  { name: "Other", value: 12 },
];

const PIE_COLORS = ["#06b6d4", "#a855f7", "#22c55e", "#f59e0b"];

const tracks = [
  { id: 1, title: "Celestial Whispers", genre: "Ethereal Ambience", duration: "3:24", price: "$49", revenue: 2940, plays: 1842 },
  { id: 2, title: "Urban Pulse", genre: "Cinematic Trap", duration: "2:58", price: "$79", revenue: 4740, plays: 987 },
  { id: 3, title: "Golden Hour", genre: "Lo-Fi Chill", duration: "4:12", price: "$49", revenue: 2156, plays: 2340 },
  { id: 4, title: "Midnight Protocol", genre: "Dark Ambient", duration: "5:01", price: "$99", revenue: 3762, plays: 654 },
  { id: 5, title: "Sakura Dreams", genre: "Cinematic", duration: "3:47", price: "$69", revenue: 2898, plays: 1123 },
  { id: 6, title: "Neon District", genre: "Cinematic Trap", duration: "3:12", price: "$79", revenue: 5530, plays: 2876 },
  { id: 7, title: "Desert Wind", genre: "World Fusion", duration: "4:33", price: "$59", revenue: 1534, plays: 432 },
  { id: 8, title: "Digital Rain", genre: "Lo-Fi Chill", duration: "3:55", price: "$49", revenue: 2107, plays: 1654 },
];

const licenses = [
  { track: "Urban Pulse", licensee: "Sarah Chen", type: "Commercial", date: "Aug 7, 2026", amount: "$79", status: "Active" },
  { track: "Neon District", licensee: "Marcus Rodriguez", type: "YouTube", date: "Aug 6, 2026", amount: "$49", status: "Active" },
  { track: "Midnight Protocol", licensee: "Apex Studios", type: "Enterprise", date: "Aug 5, 2026", amount: "$499", status: "Active" },
  { track: "Celestial Whispers", licensee: "Emily Wong", type: "Film", date: "Aug 4, 2026", amount: "$299", status: "Pending" },
  { track: "Golden Hour", licensee: "TrendMedia Co", type: "Commercial", date: "Aug 3, 2026", amount: "$79", status: "Active" },
  { track: "Sakura Dreams", licensee: "PodcastPlus", type: "YouTube", date: "Jul 31, 2026", amount: "$49", status: "Expired" },
  { track: "Desert Wind", licensee: "FilmForge Ltd", type: "Film", date: "Jul 28, 2026", amount: "$299", status: "Active" },
  { track: "Digital Rain", licensee: "StreamNow", type: "YouTube", date: "Jul 25, 2026", amount: "$49", status: "Active" },
];

const customers = [
  { initials: "SC", name: "Sarah Chen", email: "sarah@creates.io", licenses: 12, spend: "$892", lastActive: "Today", status: "Active" },
  { initials: "MR", name: "Marcus Rodriguez", email: "marcus@mindful.co", licenses: 8, spend: "$631", lastActive: "Yesterday", status: "Active" },
  { initials: "EW", name: "Emily Wong", email: "emily@wfilms.com", licenses: 5, spend: "$1,240", lastActive: "3 days ago", status: "Active" },
  { initials: "AP", name: "Apex Studios", email: "legal@apexstudios.io", licenses: 3, spend: "$1,497", lastActive: "1 week ago", status: "Active" },
  { initials: "TM", name: "TrendMedia Co", email: "music@trendmedia.co", licenses: 21, spend: "$1,659", lastActive: "Today", status: "Active" },
  { initials: "JK", name: "Jake Kim", email: "jake@beatmakers.fm", licenses: 2, spend: "$128", lastActive: "2 weeks ago", status: "Inactive" },
  { initials: "PL", name: "PodcastPlus", email: "studio@podcastplus.com", licenses: 15, spend: "$735", lastActive: "5 days ago", status: "Active" },
  { initials: "FF", name: "FilmForge Ltd", email: "license@filmforge.com", licenses: 7, spend: "$2,093", lastActive: "2 days ago", status: "Active" },
];

const astraInsights = [
  { icon: TrendingUp, color: "#22c55e", title: "Promote Track #17 — Neon District", desc: "Demand score jumped to 94 this week. Increasing visibility could yield +$520 in licenses.", action: "Promote Now" },
  { icon: RefreshCw, color: "#f59e0b", title: "3 licenses expiring in 7 days", desc: "Sarah Chen, PodcastPlus, and StreamNow have renewals due. Send automated reminders.", action: "Send Reminders" },
  { icon: Zap, color: "#06b6d4", title: "YouTube demand spike for Lo-Fi Chill", desc: "Search volume for lo-fi study music up 340% this week. Your catalog is perfectly positioned.", action: "Capitalize" },
  { icon: Users, color: "#a855f7", title: "Re-engage Jake Kim", desc: "High-value customer hasn't licensed in 60 days. Last purchase: Urban Pulse. Suggest similar tracks.", action: "Re-engage" },
  { icon: DollarSign, color: "#22c55e", title: "Raise price on Urban Pulse to $89", desc: "Demand elasticity model suggests $89 increases revenue without reducing conversion rate.", action: "Update Price" },
];

const trafficSources = [
  { source: "Google Search", visitors: 4210, conv: "9.2%", revenue: "$12,400" },
  { source: "Direct", visitors: 3180, conv: "11.4%", revenue: "$9,840" },
  { source: "YouTube", visitors: 2640, conv: "6.8%", revenue: "$7,210" },
  { source: "Twitter / X", visitors: 1420, conv: "4.1%", revenue: "$3,180" },
  { source: "TikTok", visitors: 950, conv: "3.7%", revenue: "$2,090" },
];

const topTracks = [
  { title: "Neon District", revenue: 5530, pct: 100 },
  { title: "Urban Pulse", revenue: 4740, pct: 86 },
  { title: "Midnight Protocol", revenue: 3762, pct: 68 },
  { title: "Sakura Dreams", revenue: 2898, pct: 52 },
  { title: "Celestial Whispers", revenue: 2940, pct: 53 },
];

// ─── Sub-components ─────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, up }: { label: string; value: string; sub?: string; up?: boolean }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.25rem 1.5rem" }}>
      <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ fontSize: "1.75rem", fontWeight: 800, lineHeight: 1 }}>{value}</div>
      {sub && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.4rem", fontSize: "0.78rem", color: up ? "#22c55e" : "#ef4444" }}>
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{sub}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    Active: { bg: "rgba(34,197,94,0.15)", color: "#22c55e" },
    Pending: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
    Expired: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
    Inactive: { bg: "rgba(107,114,128,0.15)", color: "#6b7280" },
  };
  const s = cfg[status] ?? cfg.Inactive;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.65rem", borderRadius: 9999 }}>{status}</span>
  );
}

const chartTooltipStyle = {
  backgroundColor: "rgba(6,8,15,0.95)",
  border: "1px solid rgba(6,182,212,0.3)",
  borderRadius: 10,
  color: "#e5e7eb",
  fontSize: "0.8rem",
};

// ─── Section: Revenue ───────────────────────────────────────────────────────

function RevenueSection() {
  return (
    <div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>Revenue Overview</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <KpiCard label="Today" value="$2,430" sub="↑18% vs yesterday" up />
        <KpiCard label="This Month" value="$31,200" sub="↑12% vs last month" up />
        <KpiCard label="Total Revenue" value="$184,500" sub="↑34% YTD" up />
        <KpiCard label="Avg License" value="$67" sub="↑$4 vs last month" up />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem", color: "#9ca3af" }}>12-Month Revenue</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueHistory}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.25rem", flex: 1 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem", color: "#9ca3af" }}>By License Type</div>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={licenseTypeData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={55}>
                  {licenseTypeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem 0.75rem" }}>
              {licenseTypeData.map((d, i) => (
                <span key={d.name} style={{ fontSize: "0.7rem", color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: PIE_COLORS[i], display: "inline-block" }} />{d.name} {d.value}%
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.25rem", flex: 1 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.85rem", color: "#9ca3af" }}>Top Earners</div>
            {topTracks.map(t => (
              <div key={t.title} style={{ marginBottom: "0.65rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.25rem" }}>
                  <span>{t.title}</span><span style={{ color: "#06b6d4" }}>${t.revenue.toLocaleString()}</span>
                </div>
                <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 9999 }}>
                  <div style={{ height: 4, width: `${t.pct}%`, background: "linear-gradient(90deg,#06b6d4,#a855f7)", borderRadius: 9999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Music Library ──────────────────────────────────────────────────

function LibrarySection() {
  const [filter, setFilter] = useState("All");
  const genres = ["All", "Ethereal Ambience", "Cinematic Trap", "Lo-Fi Chill", "Cinematic", "Dark Ambient"];
  const filtered = filter === "All" ? tracks : tracks.filter(t => t.genre === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Music Library</h2>
        <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "#06b6d4", color: "#000", border: "none", borderRadius: 9999, padding: "0.5rem 1.1rem", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
          <Plus size={15} /> Add Track
        </button>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
          <input placeholder="Search tracks…" style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "0.55rem 0.75rem 0.55rem 2.25rem", color: "#fff", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {genres.map(g => (
            <button key={g} onClick={() => setFilter(g)} style={{ background: filter === g ? "#06b6d4" : "rgba(255,255,255,0.05)", color: filter === g ? "#000" : "#9ca3af", border: "none", borderRadius: 9999, padding: "0.4rem 0.9rem", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
              {g === "All" ? "All" : g.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1rem" }}>
        {filtered.map(t => (
          <div key={t.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.25rem", transition: "border-color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(6,182,212,0.3)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: "0.2rem" }}>{t.title}</div>
                <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>KHMER SMOKE · {t.duration}</div>
              </div>
              <button style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)", color: "#06b6d4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Play size={13} fill="#06b6d4" />
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: 9999 }}>{t.genre}</span>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#06b6d4" }}>{t.price}</span>
                <button style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", color: "#06b6d4", borderRadius: 8, padding: "0.25rem 0.65rem", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>License</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Licenses ───────────────────────────────────────────────────────

function LicensesSection() {
  return (
    <div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>License Management</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <KpiCard label="Commercial" value="18" />
        <KpiCard label="Enterprise" value="4" />
        <KpiCard label="Total Issued" value="127" sub="↑8 this month" up />
        <KpiCard label="This Month" value="$8,940" sub="↑14%" up />
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["Track", "Licensee", "Type", "Date", "Amount", "Status"].map(h => (
                <th key={h} style={{ padding: "0.85rem 1.25rem", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {licenses.map((l, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "0.85rem 1.25rem", fontWeight: 600 }}>{l.track}</td>
                <td style={{ padding: "0.85rem 1.25rem", color: "#9ca3af" }}>{l.licensee}</td>
                <td style={{ padding: "0.85rem 1.25rem" }}>
                  <span style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.65rem", borderRadius: 9999 }}>{l.type}</span>
                </td>
                <td style={{ padding: "0.85rem 1.25rem", color: "#6b7280" }}>{l.date}</td>
                <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700, color: "#22c55e" }}>{l.amount}</td>
                <td style={{ padding: "0.85rem 1.25rem" }}><StatusBadge status={l.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section: Customers ──────────────────────────────────────────────────────

function CustomersSection() {
  return (
    <div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>Customers</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <KpiCard label="Total Customers" value="847" sub="↑24 this month" up />
        <KpiCard label="Active" value="124" sub="↑11%" up />
        <KpiCard label="Avg Spend" value="$217" sub="↑$18 vs last month" up />
        <KpiCard label="Avg Rating" value="4.8★" />
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              {["Customer", "Email", "Licenses", "Total Spend", "Last Active", "Status"].map(h => (
                <th key={h} style={{ padding: "0.85rem 1.25rem", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "0.85rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#06b6d4,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0 }}>{c.initials}</div>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ padding: "0.85rem 1.25rem", color: "#6b7280" }}>{c.email}</td>
                <td style={{ padding: "0.85rem 1.25rem", color: "#9ca3af", textAlign: "center" }}>{c.licenses}</td>
                <td style={{ padding: "0.85rem 1.25rem", fontWeight: 700, color: "#22c55e" }}>{c.spend}</td>
                <td style={{ padding: "0.85rem 1.25rem", color: "#6b7280" }}>{c.lastActive}</td>
                <td style={{ padding: "0.85rem 1.25rem" }}><StatusBadge status={c.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Section: Sales ──────────────────────────────────────────────────────────

function SalesSection() {
  return (
    <div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>Sales</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <KpiCard label="Today's Sales" value="$2,430" sub="↑18%" up />
        <KpiCard label="Weekly" value="$14,820" sub="↑9%" up />
        <KpiCard label="Monthly" value="$31,200" sub="↑12%" up />
        <KpiCard label="Conversion Rate" value="8.4%" sub="↑1.2pp" up />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem", color: "#9ca3af" }}>Daily Sales — Last 14 Days</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Sales"]} />
              <Bar dataKey="sales" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem", color: "#9ca3af" }}>Recent Transactions</div>
          {[
            { track: "Neon District", buyer: "TrendMedia Co", amount: "$79", time: "2h ago" },
            { track: "Urban Pulse", buyer: "Sarah Chen", amount: "$79", time: "4h ago" },
            { track: "Golden Hour", buyer: "PodcastPlus", amount: "$49", time: "6h ago" },
            { track: "Midnight Protocol", buyer: "Apex Studios", amount: "$499", time: "Yesterday" },
            { track: "Celestial Whispers", buyer: "Jake Kim", amount: "$49", time: "Yesterday" },
            { track: "Digital Rain", buyer: "StreamNow", amount: "$49", time: "2d ago" },
          ].map((tx, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{tx.track}</div>
                <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{tx.buyer} · {tx.time}</div>
              </div>
              <span style={{ color: "#22c55e", fontWeight: 700, fontSize: "0.9rem" }}>{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Analytics ──────────────────────────────────────────────────────

function AnalyticsSection() {
  return (
    <div>
      <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "1.5rem" }}>Analytics</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <KpiCard label="Page Views" value="12,400" sub="↑22% this month" up />
        <KpiCard label="Unique Visitors" value="847" sub="↑18%" up />
        <KpiCard label="Conversion Rate" value="8.4%" sub="↑1.2pp" up />
        <KpiCard label="Avg Session" value="3m 42s" sub="↑28s" up />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem", color: "#9ca3af" }}>Visitors & Conversions — 30 Days</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "0.78rem", color: "#6b7280" }} />
              <Line type="monotone" dataKey="visitors" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="conversions" stroke="#a855f7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem", color: "#9ca3af" }}>Top Traffic Sources</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                {["Source", "Visitors", "Conv.", "Revenue"].map(h => (
                  <th key={h} style={{ padding: "0.5rem 0.5rem", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: "0.7rem" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trafficSources.map((s, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "0.6rem 0.5rem", fontWeight: 600 }}>{s.source}</td>
                  <td style={{ padding: "0.6rem 0.5rem", color: "#9ca3af" }}>{s.visitors.toLocaleString()}</td>
                  <td style={{ padding: "0.6rem 0.5rem", color: "#22c55e" }}>{s.conv}</td>
                  <td style={{ padding: "0.6rem 0.5rem", color: "#06b6d4", fontWeight: 700 }}>{s.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Astra AI ───────────────────────────────────────────────────────

function AstraSection() {
  const [message, setMessage] = useState("");
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(168,85,247,0.1))", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 16, padding: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "2rem" }}>
        <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(6,182,212,0.3)", animation: "spin 8s linear infinite" }} />
          <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "1px solid rgba(168,85,247,0.3)" }} />
          <div style={{ position: "absolute", inset: 18, borderRadius: "50%", background: "linear-gradient(135deg,#06b6d4,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(6,182,212,0.4)" }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", color: "#06b6d4", textTransform: "uppercase", marginBottom: "0.35rem" }}>Astra AI · Online</div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.35rem" }}>Good morning, Prasart.</h3>
          <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>Today's revenue is up 18%. Your top opportunity is <span style={{ color: "#06b6d4", fontWeight: 600 }}>Neon District</span>. I've found 5 actions to grow your catalog.</p>
        </div>
      </div>

      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Insights</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
        {astraInsights.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "1.1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = `${ins.color}44`)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            >
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${ins.color}18`, border: `1px solid ${ins.color}33`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={18} color={ins.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.2rem" }}>{ins.title}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{ins.desc}</div>
              </div>
              <button style={{ background: `${ins.color}18`, border: `1px solid ${ins.color}44`, color: ins.color, borderRadius: 8, padding: "0.4rem 0.9rem", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                {ins.action}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "1rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Ask Astra anything about your catalog…" style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "0.875rem" }} />
        <button style={{ background: "linear-gradient(135deg,#06b6d4,#a855f7)", border: "none", borderRadius: 8, padding: "0.5rem 0.75rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Send size={15} color="#fff" />
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const navItems = [
  { id: "revenue", label: "Revenue", icon: BarChart2 },
  { id: "library", label: "Music Library", icon: Music },
  { id: "licenses", label: "Licenses", icon: FileText },
  { id: "customers", label: "Customers", icon: Users },
  { id: "sales", label: "Sales", icon: DollarSign },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "astra", label: "Astra AI", icon: Zap },
];

// ─── Dashboard Root ──────────────────────────────────────────────────────────

export default function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [active, setActive] = useState("revenue");

  const sections: Record<string, React.ReactNode> = {
    revenue: <RevenueSection />,
    library: <LibrarySection />,
    licenses: <LicensesSection />,
    customers: <CustomersSection />,
    sales: <SalesSection />,
    analytics: <AnalyticsSection />,
    astra: <AstraSection />,
  };

  const activeNav = navItems.find(n => n.id === active);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh" }}>
        {/* Logo */}
        <div style={{ padding: "1.25rem 1.25rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#06b6d4,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={15} color="#fff" fill="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "-0.01em" }}>ASTRA</div>
              <div style={{ fontSize: "0.6rem", color: "#6b7280", letterSpacing: "0.05em" }}>COMMAND CENTER</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "1rem 0.75rem", overflow: "auto" }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button key={item.id} onClick={() => setActive(item.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "0.65rem",
                background: isActive ? "rgba(6,182,212,0.12)" : "transparent",
                border: isActive ? "1px solid rgba(6,182,212,0.25)" : "1px solid transparent",
                borderRadius: 10, padding: "0.65rem 0.85rem",
                color: isActive ? "#06b6d4" : "#6b7280",
                fontWeight: isActive ? 600 : 500, fontSize: "0.875rem",
                cursor: "pointer", marginBottom: "0.2rem", textAlign: "left",
                transition: "all 0.15s"
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#d1d5db"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#6b7280"; }}
              >
                <Icon size={16} />
                {item.label}
                {item.id === "astra" && (
                  <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#06b6d4", animation: "pulse 1.5s ease-in-out infinite" }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* User + Sign out */}
        <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.6rem 0.75rem", marginBottom: "0.4rem" }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#06b6d4,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, flexShrink: 0 }}>KS</div>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600 }}>Prasart K.</div>
              <div style={{ fontSize: "0.65rem", color: "#6b7280" }}>Admin</div>
            </div>
            <Bell size={14} color="#6b7280" style={{ marginLeft: "auto", cursor: "pointer" }} />
          </div>
          <button onClick={onSignOut} style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.65rem", background: "transparent", border: "1px solid transparent", borderRadius: 10, padding: "0.6rem 0.85rem", color: "#6b7280", fontWeight: 500, fontSize: "0.825rem", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; e.currentTarget.style.background = "rgba(239,68,68,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Top bar */}
        <header style={{ height: 56, borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.75rem", position: "sticky", top: 0, background: "rgba(0,0,0,0.95)", backdropFilter: "blur(12px)", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {activeNav && <activeNav.icon size={16} color="#06b6d4" />}
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{activeNav?.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 9999, padding: "0.25rem 0.75rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <span style={{ fontSize: "0.72rem", color: "#22c55e", fontWeight: 600 }}>ASTRA LIVE</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 9999, padding: "0.25rem 0.75rem" }}>
              <TrendingUp size={12} color="#06b6d4" />
              <span style={{ fontSize: "0.72rem", color: "#06b6d4", fontWeight: 600 }}>Score 94%</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldCheck size={14} color="#6b7280" />
              <ChevronRight size={14} color="#6b7280" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: "2rem 1.75rem", overflowY: "auto" }}>
          {sections[active]}
        </div>
      </main>
    </div>
  );
}
