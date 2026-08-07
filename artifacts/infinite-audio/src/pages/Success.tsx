import { useSearch, useLocation } from "wouter";
import { useOrder } from "@/hooks/use-dashboard-data";
import { centsToDisplay } from "@/lib/api";

export default function Success() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session_id");

  const { data: order, isLoading, error } = useOrder(sessionId);

  const licenseDoc = order
    ? `MUSIC LICENSE CERTIFICATE
═══════════════════════════════════════
Infinite Audio Archive · Khmer Smoke

Invoice No.  : ${order.invoiceNumber ?? "—"}
Date         : ${new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

LICENSEE
─────────────────────────────────────
Name         : ${order.customerName}
Email        : ${order.customerEmail}

LICENSED CONTENT
─────────────────────────────────────
Track        : ${order.trackTitle ?? "—"}
Artist       : Khmer Smoke
License Type : ${order.licenseType}
Amount Paid  : ${centsToDisplay(order.amountCents)}

LICENSE TERMS
─────────────────────────────────────
This license grants the licensee a non-exclusive, 
non-transferable right to synchronise the above 
track in productions permitted under the chosen 
license tier. Resale or redistribution of the 
audio files is strictly prohibited.

© ${new Date().getFullYear()} Khmer Smoke · All rights reserved.
═══════════════════════════════════════`
    : "";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg,#00d4aa,#7c6af7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎵</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Infinite Audio Archive</span>
        </div>
        <button onClick={() => navigate("/store")} style={{ background: "transparent", border: "1px solid #222", color: "#888", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
          Browse More Tracks
        </button>
      </nav>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 24px 80px" }}>
        {isLoading || !order ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            {isLoading ? (
              <>
                <div style={{ fontSize: 48, marginBottom: 16, animation: "spin 1s linear infinite" }}>⚙️</div>
                <p style={{ color: "#555" }}>Confirming your payment…</p>
              </>
            ) : error ? (
              <>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                <h2 style={{ marginBottom: 8 }}>Could not load order</h2>
                <p style={{ color: "#555", marginBottom: 24 }}>{(error as Error).message}</p>
                <button onClick={() => navigate("/store")} style={{ background: "#00d4aa", color: "#000", border: "none", padding: "12px 24px", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
                  Browse Tracks
                </button>
              </>
            ) : null}
          </div>
        ) : (
          <>
            {/* Success header */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,212,170,0.15)", border: "2px solid #00d4aa44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px" }}>
                ✓
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 8px", letterSpacing: "-1px" }}>Payment Successful!</h1>
              <p style={{ color: "#555", margin: 0 }}>Your license is ready. Check your inbox for a confirmation email.</p>
            </div>

            {/* Invoice card */}
            <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 20, overflow: "hidden", marginBottom: 24 }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #1c1c1c", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#555", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 4 }}>INVOICE</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{order.invoiceNumber}</div>
                </div>
                <div style={{ background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.3)", color: "#00d4aa", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>
                  PAID
                </div>
              </div>

              <div style={{ padding: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#444", marginBottom: 4, fontWeight: 600 }}>LICENSEE</div>
                    <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                    <div style={{ color: "#555", fontSize: 13 }}>{order.customerEmail}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#444", marginBottom: 4, fontWeight: 600 }}>DATE</div>
                    <div style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                  </div>
                </div>

                <div style={{ background: "#0d0d0d", border: "1px solid #1c1c1c", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{order.trackTitle}</div>
                      <div style={{ fontSize: 12, color: "#555" }}>{order.licenseType} License</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 20, color: "#00d4aa" }}>{centsToDisplay(order.amountCents)}</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <a
                    href={`/api/tracks/${order.trackId}/download`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "#00d4aa",
                      color: "#000",
                      borderRadius: 12,
                      padding: "13px",
                      fontWeight: 700,
                      fontSize: 14,
                      textDecoration: "none",
                    }}
                  >
                    ⬇ Download Track
                  </a>
                  <button
                    onClick={() => {
                      const blob = new Blob([licenseDoc], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `license-${order.invoiceNumber}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "#111",
                      border: "1px solid #222",
                      color: "#fff",
                      borderRadius: 12,
                      padding: "13px",
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    📄 Download License
                  </button>
                </div>
              </div>
            </div>

            {/* License document preview */}
            <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 12, color: "#555", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 14 }}>LICENSE CERTIFICATE PREVIEW</div>
              <pre style={{
                margin: 0,
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                color: "#777",
                lineHeight: 1.8,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>
                {licenseDoc}
              </pre>
            </div>

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button onClick={() => navigate("/store")} style={{ background: "transparent", border: "1px solid #222", color: "#888", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontSize: 14 }}>
                ← Browse More Tracks
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
