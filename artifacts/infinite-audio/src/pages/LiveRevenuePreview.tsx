import { useEffect, useState } from "react";
import { api, type DashboardMetrics } from "../lib/api";

export interface LandingMetricsState {
  metrics: DashboardMetrics | null;
  error: boolean;
}

export function useLandingMetrics(isSignedIn: boolean): LandingMetricsState {
  const [state, setState] = useState<LandingMetricsState>({ metrics: null, error: false });
  useEffect(() => {
    setState({ metrics: null, error: false });
    if (!isSignedIn) return;
    let active = true;
    let pending = false;
    async function refresh() {
      if (pending) return;
      pending = true;
      try {
        const metrics = await api.metrics.dashboard();
        if (active) setState({ metrics, error: false });
      } catch {
        if (active) setState({ metrics: null, error: true });
      } finally {
        pending = false;
      }
    }
    void refresh();
    const timer = window.setInterval(() => void refresh(), 60000);
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [isSignedIn]);
  return isSignedIn ? state : { metrics: null, error: false };
}

export function landingMoney(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
  }).format(cents / 100);
}

export function LiveRevenuePreview({
  isSignedIn, report,
}: { isSignedIn: boolean; report: LandingMetricsState }) {
  const m = report.metrics;
  const status = !isSignedIn ? "Sign in to view live sales and revenue."
    : report.error ? "Revenue is unavailable. Open the dashboard or try again shortly."
    : !m ? "Loading live sales..."
    : "Completed live purchases. Updates every minute.";
  const values = [
    { label: "Today's Revenue", value: m ? landingMoney(m.todayRevenueCents) : "—" },
    { label: "This Month's Revenue", value: m ? landingMoney(m.monthlyRevenueCents) : "—" },
    { label: "Active Licenses", value: m ? String(m.activeLicenses) : "—" },
    { label: "Total Sales", value: m ? String(m.totalSales) : "—" },
  ];
  return (
    <section style={{ padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontSize: "2.25rem", textAlign: "center", marginBottom: "1rem" }}>
          Live Sales Dashboard
        </h2>
        <p role="status" style={{ color: "#9ca3af", textAlign: "center", marginBottom: "2rem" }}>
          {status}
        </p>
        {isSignedIn && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem", marginBottom: "2rem",
          }}>
            {values.map(item => (
              <div key={item.label} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(6,182,212,0.25)",
                borderRadius: 14, padding: "1.25rem",
              }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--cyan-400)" }}>
                  {item.value}
                </div>
                <div style={{ color: "#9ca3af", marginTop: "0.5rem" }}>{item.label}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          <a href={isSignedIn ? "/dashboard" : "/login"} style={{
            display: "inline-block", padding: "0.85rem 1.5rem", borderRadius: 10,
            background: "linear-gradient(135deg, var(--cyan-500), var(--purple-500))",
            color: "#fff", fontWeight: 700, textDecoration: "none",
          }}>
            {isSignedIn ? "Open Dashboard" : "Sign In to View Dashboard"}
          </a>
        </div>
      </div>
    </section>
  );
}
