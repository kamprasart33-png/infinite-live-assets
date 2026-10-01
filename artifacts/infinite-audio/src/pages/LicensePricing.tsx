import { useEffect, useState } from "react";
import { api, type LicensePrice } from "../lib/api";

export default function LicensePricing() {
  const [prices, setPrices] = useState<LicensePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);
    api.store.licensePrices()
      .then((rows) => {
        if (!active) return;
        setPrices(rows.filter((p) =>
          p.currency.toLowerCase() === "usd" &&
          Number.isSafeInteger(p.unit_amount) &&
          p.unit_amount > 0
        ).sort((a, b) => a.unit_amount - b.unit_amount));
      })
      .catch(() => {
        if (active) {
          setPrices([]);
          setFailed(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [attempt]);

  const money = (cents: number) => new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
  }).format(cents / 100);

  return (
    <section id="pricing" style={{ padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.25rem", fontWeight: 700 }}>
          Music License Pricing
        </h2>
        <p style={{ color: "#9ca3af", margin: "0.75rem auto 2rem", maxWidth: 640 }}>
          Choose a track, then select your license. Review the license terms
          and final price before payment.
        </p>
        <div role="status">
          {loading && <p>Loading license prices…</p>}
          {!loading && failed && (
            <div>
              <p>License prices are currently unavailable.</p>
              <button onClick={() => setAttempt((n) => n + 1)}
                style={{ padding: "0.75rem 1.25rem", borderRadius: 8,
                  background: "var(--cyan-500)", border: "none",
                  color: "#000", cursor: "pointer", fontWeight: 600 }}>
                Try Again
              </button>
            </div>
          )}
          {!loading && !failed && prices.length === 0 && (
            <p>No license options are currently available.</p>
          )}
        </div>
        {!loading && !failed && (
          <div style={{ display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem", textAlign: "left" }}>
            {prices.map((price) => (
              <div key={price.price_id} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "1.5rem", padding: "2rem",
                display: "flex", flexDirection: "column",
              }}>
                <h3 style={{ fontSize: "1.4rem", margin: "0 0 1rem" }}>
                  {price.product_metadata?.license_type || price.product_name}
                </h3>
                <div style={{ fontSize: "2.25rem", fontWeight: 700,
                  color: "var(--cyan-400)" }}>
                  {money(price.unit_amount)}
                </div>
                <p style={{ color: "#9ca3af", marginTop: "0.25rem" }}>
                  per track
                </p>
                {price.product_description && (
                  <p style={{ color: "#d1d5db", lineHeight: 1.6 }}>
                    {price.product_description}
                  </p>
                )}
                <a href="/store" style={{
                  display: "block", textAlign: "center", marginTop: "auto",
                  padding: "1rem", borderRadius: "0.75rem",
                  background: "var(--cyan-500)", color: "#000",
                  fontWeight: 700, textDecoration: "none",
                }}>
                  Choose a Track
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
