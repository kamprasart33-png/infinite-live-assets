// Typed API client — all calls go through Vite's /api proxy in dev

const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Response types ────────────────────────────────────────────────────────

export interface DashboardMetrics {
  todayRevenueCents: number;
  monthlyRevenueCents: number;
  totalRevenueCents: number;
  totalSales: number;
  totalTracks: number;
  activeCustomers: number;
  activeLicenses: number;
  avgLicenseCents: number;
}

export interface RevenueMonth {
  month: string;
  revenue: number;
}

export interface DailySale {
  day: string;
  sales: number;
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  genre: string | null;
  duration: string | null;
  priceCents: number;
  plays: number;
  createdAt: string;
}

export interface TopTrack {
  id: number;
  title: string;
  genre: string | null;
  price_cents: number;
  plays: number;
  revenue_cents: number;
  license_count: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  status: string;
  totalSpentCents: number;
  createdAt: string;
}

export interface Transaction {
  id: number;
  trackId: number | null;
  customerId: number | null;
  trackTitle: string | null;
  customerName: string | null;
  customerEmail: string | null;
  licenseType: string;
  amountCents: number;
  status: string;
  createdAt: string;
}

export interface LicenseByType {
  license_type: string;
  count: number;
  revenue_cents: number;
}

export interface AstraResult {
  intent: string;
  label: string;
  data: unknown;
}

// ── API calls ─────────────────────────────────────────────────────────────

export const api = {
  metrics: {
    dashboard: () => get<DashboardMetrics>("/metrics/dashboard"),
    revenueHistory: () => get<RevenueMonth[]>("/metrics/revenue-history"),
    dailySales: () => get<DailySale[]>("/metrics/daily-sales"),
  },
  tracks: {
    all: () => get<Track[]>("/tracks"),
    topSelling: (limit = 10) => get<TopTrack[]>(`/tracks/top-selling?limit=${limit}`),
  },
  customers: {
    all: () => get<Customer[]>("/customers"),
    active: () => get<Customer[]>("/customers?filter=active"),
    newest: () => get<Customer[]>("/customers?filter=newest"),
  },
  transactions: {
    recent: (limit = 10) => get<Transaction[]>(`/transactions/recent?limit=${limit}`),
    activeLicenses: () => get<Transaction[]>("/transactions/active-licenses"),
    byType: () => get<LicenseByType[]>("/transactions/by-type"),
  },
  astra: {
    command: (command: string) => post<AstraResult>("/astra/command", { command }),
  },
};

// ── Formatting helpers ────────────────────────────────────────────────────

export function centsToDisplay(cents: number): string {
  if (cents >= 100_000) return `$${(cents / 100_000).toFixed(1)}k`.replace(".0k", "k");
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? "Just now" : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? "Yesterday" : `${days}d ago`;
}
