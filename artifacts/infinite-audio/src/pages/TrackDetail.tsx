import { useState } from "react";
import { useLocation } from "wouter";
import { useStoreTracks, useLicensePrices } from "@/hooks/use-dashboard-data";
import { api, centsToDisplay, type LicensePrice } from "@/lib/api";

interface Props {
  trackId: number;
}

const LICENSE_ORDER = ["Podcast", "YouTube", "Commercial", "Film", "Enterprise"];

const LICENSE_INFO: Record<string, { icon: string; desc: string; color: string }> = {
  Podcast: { icon: "🎙", desc: "Audio shows & podcast episodes", color: "#a8e063" },
  YouTube: { icon: "▶️", desc: "YouTube videos with monetisation rights", color: "#00d4aa" },
  Commercial: { icon: "📺", desc: "Advertisements & commercial productions", color: "#f7a600" },
  Film: { icon: "🎬", desc: "Short films, documentaries & video", color: "#7c6af7" },
  Enterprise: { icon: "🏢", desc: "Unlimited use across all platforms", color: "#e74c3c" },
};

export default function TrackDetail({ trackId }: Props) {
  const [, navigate] = useLocation();
  const { data: tracks = [] } = useStoreTracks();
  const { data: prices = [], isLoading: pricesLoading } = useLicensePrices();

  const track = tracks.find((t) => t.id === trackId);

  const [selectedPrice, setSelectedPrice] = useState<LicensePrice | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sort prices by amount
  const sortedPrices = [...prices].sort((a, b) => {
    const ai = LICENSE_ORDER.indexOf(a.product_metadata?.license_type ?? "");
    const bi = LICENSE_ORDER.indexOf(b.product_metadata?.license_type ?? "");
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPrice || !track) return;
    setLoading(true);
    setError(null);
    try {
      const { url } = await api.checkout.createSession({
        trackId: track.id,
        trackTitle: track.title,
        licenseType: selectedPrice.product_metadata?.license_type ?? selectedPrice.product_name,
        priceId: selectedPrice.price_id,
        customerName,
        customerEmail,
      });
      window.location.href = url;
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!track && tracks.length > 0) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2>Track not found</h2>
          <button onClick={() => navigate("/store")} style={{ background: "#00d4aa", color: "#000", border: "none", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 600, marginTop: 16 }}>
            Browse All Tracks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "0 24px", display: "flex", alignItems: "center", gap: 16, height: 64 }}>
        <button onClick={() => navigate("/store")} style={{ background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: 20, padding: 0 }}>←</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg,#00d4aa,#7c6af7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🎵</div>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Infinite Audio Archive</span>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Track header */}
        <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 20, padding: "32px", marginBottom: 32, display: "flex", gap: 24, alignItems: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: 16, background: "linear-gradient(135deg,#00d4aa22,#7c6af722)", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
            🎵
          </div>
          <div style={{ flex: 1 }}>
            {track?.genre && (
              <div style={{ fontSize: 11, color: "#00d4aa", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 6 }}>{track.genre}</div>
            )}
            <h1 style={{ margin: "0 0 4px", fontSize: "clamp(20px,4vw,32px)", fontWeight: 800, letterSpacing: "-1px" }}>
              {track?.title ?? "Loading…"}
            </h1>
            <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{track?.artist ?? ""}</p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            {track?.duration && <div style={{ fontSize: 13, color: "#555" }}>⏱ {track.duration}</div>}
            <div style={{ fontSize: 12, color: "#444", marginTop: 4 }}>▶ {track?.plays?.toLocaleString()} plays</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
          {/* License picker */}
          <div>
            <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>1. Choose a License</h2>

            {pricesLoading ? (
              <div style={{ color: "#555", padding: "40px 0", textAlign: "center" }}>Loading license options…</div>
            ) : sortedPrices.length === 0 ? (
              <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 12, padding: 24, color: "#666", textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
                <p style={{ margin: 0 }}>Stripe products not yet seeded. Run the seed-products script to populate license options.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sortedPrices.map((price) => {
                  const lt = price.product_metadata?.license_type ?? price.product_name;
                  const info = LICENSE_INFO[lt] ?? { icon: "📄", desc: price.product_description ?? "", color: "#888" };
                  const isSelected = selectedPrice?.price_id === price.price_id;
                  return (
                    <button
                      key={price.price_id}
                      onClick={() => setSelectedPrice(price)}
                      style={{
                        background: isSelected ? `${info.color}12` : "#111",
                        border: `2px solid ${isSelected ? info.color : "#1c1c1c"}`,
                        borderRadius: 14,
                        padding: "16px 20px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        textAlign: "left",
                        transition: "all 0.15s",
                        width: "100%",
                      }}
                    >
                      <span style={{ fontSize: 24, flexShrink: 0 }}>{info.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: isSelected ? info.color : "#fff", fontWeight: 600, fontSize: 15, marginBottom: 2 }}>
                          {lt} License
                        </div>
                        <div style={{ color: "#555", fontSize: 12 }}>{info.desc}</div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: isSelected ? info.color : "#777", flexShrink: 0 }}>
                        {centsToDisplay(price.unit_amount)}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Customer info + CTA */}
          <div style={{ position: "sticky", top: 24 }}>
            <div style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 20, padding: 24 }}>
              <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>2. Your Details</h2>
              <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#555", marginBottom: 6, fontWeight: 600 }}>FULL NAME</label>
                  <input
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Jane Smith"
                    style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#555", marginBottom: 6, fontWeight: 600 }}>EMAIL ADDRESS</label>
                  <input
                    required
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="jane@example.com"
                    style={{ width: "100%", background: "#0d0d0d", border: "1px solid #222", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                {/* Order summary */}
                {selectedPrice && (
                  <div style={{ background: "#0d0d0d", border: "1px solid #1c1c1c", borderRadius: 10, padding: 14, marginTop: 4 }}>
                    <div style={{ fontSize: 11, color: "#444", marginBottom: 8, fontWeight: 600, letterSpacing: "0.5px" }}>ORDER SUMMARY</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: "#777", fontSize: 13 }}>{track?.title}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#777", fontSize: 13 }}>{selectedPrice.product_metadata?.license_type} License</span>
                      <span style={{ color: "#00d4aa", fontWeight: 700 }}>{centsToDisplay(selectedPrice.unit_amount)}</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{ background: "#e74c3c11", border: "1px solid #e74c3c44", borderRadius: 8, padding: "10px 14px", color: "#e74c3c", fontSize: 13 }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedPrice || !customerName || !customerEmail || loading}
                  style={{
                    background: selectedPrice && customerName && customerEmail && !loading ? "#00d4aa" : "#1c1c1c",
                    color: selectedPrice && customerName && customerEmail && !loading ? "#000" : "#444",
                    border: "none",
                    borderRadius: 12,
                    padding: "14px",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: selectedPrice && customerName && customerEmail && !loading ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    marginTop: 4,
                  }}
                >
                  {loading ? "Redirecting to Stripe…" : selectedPrice ? `Pay ${centsToDisplay(selectedPrice.unit_amount)} →` : "Select a License to Continue"}
                </button>

                <p style={{ margin: 0, fontSize: 11, color: "#444", textAlign: "center" }}>
                  🔒 Secured by Stripe · Instant delivery after payment
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
