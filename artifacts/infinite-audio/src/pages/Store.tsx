import { useState } from "react";
import { useLocation } from "wouter";
import { useStoreTracks } from "@/hooks/use-dashboard-data";
import { centsToDisplay } from "@/lib/api";

const GENRES = ["All", "Cinematic Trap", "Ambient", "World Fusion", "Hip-Hop", "Ethereal Ambience", "Lo-Fi", "Electronic"];

const genreColor: Record<string, string> = {
  "Cinematic Trap": "#00d4aa",
  "Ambient": "#7c6af7",
  "World Fusion": "#f7a600",
  "Hip-Hop": "#e74c3c",
  "Ethereal Ambience": "#5bc4f7",
  "Lo-Fi": "#a8e063",
  "Electronic": "#ff6b9d",
};

export default function Store() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");

  const { data: tracks = [], isLoading } = useStoreTracks();

  const filtered = tracks.filter((t) => {
    const matchesQuery =
      query === "" ||
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = genre === "All" || t.genre === genre;
    return matchesQuery && matchesGenre;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#00d4aa,#7c6af7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🎵</div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.5px" }}>Infinite Audio Archive</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ background: "transparent", border: "1px solid #2a2a2a", color: "#aaa", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "64px 24px 40px" }}>
        <div style={{ display: "inline-block", background: "rgba(0,212,170,0.1)", border: "1px solid rgba(0,212,170,0.3)", borderRadius: 20, padding: "4px 14px", fontSize: 12, color: "#00d4aa", marginBottom: 20 }}>
          KHMER SMOKE · MUSIC LICENSING
        </div>
        <h1 style={{ fontSize: "clamp(32px,6vw,56px)", fontWeight: 800, margin: "0 0 16px", letterSpacing: "-2px", lineHeight: 1.1 }}>
          License World-Class<br />
          <span style={{ background: "linear-gradient(90deg,#00d4aa,#7c6af7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Music Instantly
          </span>
        </h1>
        <p style={{ color: "#666", fontSize: 16, maxWidth: 480, margin: "0 auto 40px" }}>
          Cinematic, ambient, and electronic tracks cleared for YouTube, film, podcasts, and beyond.
        </p>

        {/* Search */}
        <div style={{ maxWidth: 480, margin: "0 auto 32px", position: "relative" }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#555", fontSize: 16 }}>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracks or artists…"
            style={{ width: "100%", background: "#111", border: "1px solid #222", borderRadius: 12, padding: "14px 16px 14px 44px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Genre filters */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              style={{
                background: genre === g ? "#00d4aa" : "#111",
                border: `1px solid ${genre === g ? "#00d4aa" : "#222"}`,
                color: genre === g ? "#000" : "#888",
                padding: "6px 14px",
                borderRadius: 20,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: genre === g ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Track grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#555" }}>Loading tracks…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "#555" }}>No tracks found</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {filtered.map((track) => (
              <div
                key={track.id}
                onClick={() => navigate(`/store/track/${track.id}`)}
                style={{
                  background: "#111",
                  border: "1px solid #1c1c1c",
                  borderRadius: 16,
                  padding: 24,
                  cursor: "pointer",
                  transition: "border-color 0.2s, transform 0.15s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#00d4aa40";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1c1c1c";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* Waveform decoration */}
                <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 60, overflow: "hidden", opacity: 0.07 }}>
                  <svg viewBox="0 0 120 60" style={{ width: "100%", height: "100%" }}>
                    {Array.from({ length: 24 }, (_, i) => (
                      <rect key={i} x={i * 5} y={30 - Math.abs(Math.sin(i * 0.7) * 25)} width={3} height={Math.abs(Math.sin(i * 0.7) * 50)} fill="#00d4aa" />
                    ))}
                  </svg>
                </div>

                {/* Genre badge */}
                {track.genre && (
                  <span style={{
                    display: "inline-block",
                    background: `${genreColor[track.genre] ?? "#444"}22`,
                    border: `1px solid ${genreColor[track.genre] ?? "#444"}44`,
                    color: genreColor[track.genre] ?? "#888",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    padding: "3px 10px",
                    borderRadius: 10,
                    marginBottom: 12,
                    textTransform: "uppercase",
                  }}>
                    {track.genre}
                  </span>
                )}

                <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px" }}>{track.title}</h3>
                <p style={{ margin: "0 0 16px", color: "#555", fontSize: 13 }}>{track.artist}</p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#444", marginBottom: 2 }}>FROM</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#00d4aa" }}>
                      {centsToDisplay(3900)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {track.duration && (
                      <div style={{ fontSize: 12, color: "#555" }}>⏱ {track.duration}</div>
                    )}
                    <div style={{ fontSize: 12, color: "#444", marginTop: 2 }}>▶ {track.plays.toLocaleString()} plays</div>
                  </div>
                </div>

                <button
                  style={{
                    marginTop: 16,
                    width: "100%",
                    background: "transparent",
                    border: "1px solid #222",
                    color: "#00d4aa",
                    padding: "10px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    transition: "background 0.15s",
                  }}
                >
                  Choose License →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
