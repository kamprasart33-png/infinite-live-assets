import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useStoreTracks } from "@/hooks/use-dashboard-data";
import { centsToDisplay } from "@/lib/api";
import "../index.css";

type FeaturedTrack = {
  id: number;
  title: string;
  artist: string;
  description: string;
  duration: string;
  genre: string;
  price: string;
};

const genreBlurb: Record<string, string> = {
  "Khmer Hip-Hop": "hard-hitting beats with traditional Khmer roots",
  "Ethereal Ambience": "ethereal night ambience for deep calm & meditation",
  "Lo-Fi Chill": "relaxing lo-fi beats perfect for content creation",
  "Cinematic": "cinematic atmosphere for film, trailers & urban visuals",
  "Meditation": "peaceful flute & meditation soundscapes",
  "Ambient": "dreamy ambient textures for focus & relaxation",
  "Jazz": "smooth jazz grooves for cozy scenes",
  "Nature Ambience": "natural soundscapes to relax and unwind",
};

const testimonials = [
  {
    text: '"Finally found music that makes my videos stand out. Zero claims since switching to Khmer Smoke!"',
    initials: "SC",
    name: "Sarah Chen",
    role: "YouTube Creator • @sarahcreates",
  },
  {
    text: '"The ambient tracks are perfect for my podcast intros. Clean, professional, and affordable."',
    initials: "MR",
    name: "Marcus Rodriguez",
    role: "Podcast Host • @mindfulmarcus",
  },
  {
    text: '"Used Khmer Smoke for my short film. The cinematic quality exceeded expectations. Highly recommend!"',
    initials: "EW",
    name: "Emily Wong",
    role: "Filmmaker • @emilywfilms",
  },
];

function MusicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: 20, height: 20 }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  );
}

function PlayIcon({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={size} height={size}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    </svg>
  );
}

function PauseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={size} height={size}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg style={{ width: 20, height: 20, color: "var(--cyan-400)", flexShrink: 0, marginTop: 2 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg style={{ width: 16, height: 16, fill: "var(--cyan-400)", color: "var(--cyan-400)" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ChevronRight({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={size} height={size}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

type NavLink = { label: string; href: string; highlight?: boolean };

const publicLinks: NavLink[] = [
  { label: "Library", href: "#tracks" },
  { label: "Licensing", href: "#pricing" },
  { label: "Pricing", href: "#pricing" },
  { label: "Enterprise", href: "#contact" },
  { label: "Developers", href: "#contact" },
  { label: "About", href: "#about" },
];

const signedInLinks: NavLink[] = [
  { label: "Library", href: "#tracks" },
  { label: "Sales", href: "#dashboard" },
  { label: "Licensing", href: "#pricing" },
  { label: "Analytics", href: "#dashboard" },
  { label: "Astra", href: "#dashboard", highlight: true },
];

function AstraWidget({ isSignedIn }: { isSignedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const greeting = isSignedIn ? "Good morning, Prasart." : "Hello. I'm Astra.";
  const line1 = isSignedIn ? "Today's revenue increased 18%." : "Your AI music licensing co-pilot.";
  const line2 = isSignedIn
    ? "Your top opportunity is Khmer Smoke – My Side."
    : "Sign in to unlock your dashboard.";

  // Pulse in after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Typewriter when opened
  useEffect(() => {
    if (!open) { setTyped(""); return; }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(greeting.slice(0, i));
      if (i >= greeting.length) clearInterval(interval);
    }, 38);
    return () => clearInterval(interval);
  }, [open, greeting]);

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor(c => !c), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      {/* Panel */}
      <div style={{
        position: "fixed", bottom: open ? 96 : -400, right: 24, zIndex: 200,
        width: 320,
        background: "rgba(6,8,15,0.97)",
        border: "1px solid rgba(6,182,212,0.35)",
        borderRadius: 20,
        boxShadow: "0 0 60px rgba(6,182,212,0.18), 0 24px 60px rgba(0,0,0,0.7)",
        transition: "bottom 0.45s cubic-bezier(0.34,1.56,0.64,1)",
        overflow: "hidden",
        backdropFilter: "blur(24px)"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, rgba(6,182,212,0.18), rgba(168,85,247,0.12))",
          borderBottom: "1px solid rgba(6,182,212,0.2)",
          padding: "1rem 1.25rem",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            {/* Orb */}
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--cyan-400), var(--purple-500))",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(6,182,212,0.5)",
              animation: "glow 2s ease-in-out infinite"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.12em", color: "var(--cyan-400)" }}>ASTRA</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" }} />
                <span style={{ fontSize: "0.68rem", color: "#6b7280" }}>AI · Online</span>
              </div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "#6b7280", padding: 4, borderRadius: 6, lineHeight: 1,
            transition: "color 0.2s"
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.25rem" }}>
          {/* Typing greeting */}
          <div style={{
            background: "rgba(6,182,212,0.07)",
            border: "1px solid rgba(6,182,212,0.15)",
            borderRadius: 12,
            padding: "1rem",
            marginBottom: "0.9rem",
            minHeight: 56
          }}>
            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#e5e7eb", marginBottom: "0.5rem", minHeight: "1.4em" }}>
              {typed}{typed.length < greeting.length || showCursor ? <span style={{ color: "var(--cyan-400)", animation: "none" }}>|</span> : null}
            </p>
            {typed.length >= greeting.length && (
              <div style={{ animation: "fadeIn 0.4s ease" }}>
                <p style={{ fontSize: "0.82rem", color: "#9ca3af", marginBottom: "0.35rem" }}>{line1}</p>
                <p style={{ fontSize: "0.82rem", color: "#9ca3af" }}>{line2}</p>
              </div>
            )}
          </div>

          {/* Stats row (signed in only) */}
          {isSignedIn && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.9rem", animation: "fadeIn 0.6s ease" }}>
              {[
                { label: "Revenue Today", value: "$2,430", up: true },
                { label: "Opp. Score", value: "94%", up: true },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10, padding: "0.65rem 0.75rem"
                }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--cyan-400)" }}>{stat.value}</div>
                  <div style={{ fontSize: "0.7rem", color: "#6b7280" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <a href="#dashboard" style={{
            display: "block", textAlign: "center",
            background: "linear-gradient(135deg, var(--cyan-500), var(--purple-500))",
            color: "#fff", fontWeight: 700, fontSize: "0.85rem",
            padding: "0.7rem", borderRadius: 10,
            textDecoration: "none", transition: "opacity 0.2s",
            letterSpacing: "0.02em"
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {isSignedIn ? "Open Dashboard" : "Sign In to Get Started"}
          </a>

          <p style={{ fontSize: "0.68rem", color: "#374151", textAlign: "center", marginTop: "0.6rem" }}>
            Powered by Astra AI · Always on
          </p>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 201,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--cyan-500), var(--purple-500))",
          border: "none", cursor: "pointer", color: "#fff",
          boxShadow: open
            ? "0 0 0 4px rgba(6,182,212,0.25), 0 8px 32px rgba(6,182,212,0.4)"
            : "0 0 0 2px rgba(6,182,212,0.15), 0 8px 24px rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: visible ? "scale(1)" : "scale(0)",
          transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s",
          animation: visible && !open ? "glow 2.5s ease-in-out infinite" : "none"
        }}
        title="Open Astra"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
        {/* Ping ring */}
        {!open && visible && (
          <span style={{
            position: "absolute", inset: -4, borderRadius: "50%",
            border: "2px solid rgba(6,182,212,0.5)",
            animation: "ping 2s ease-in-out infinite"
          }} />
        )}
      </button>
    </>
  );
}

export default function Landing({ onSignIn, isSignedIn = false, onSignOut }: { onSignIn: () => void; isSignedIn?: boolean; onSignOut?: () => void }) {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [, navigate] = useLocation();

  const { data: storeTracks = [] } = useStoreTracks();
  const tracks = [...storeTracks]
    .sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0))
    .slice(0, 6)
    .map((t) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      description: (t.genre && genreBlurb[t.genre]) || "original track from the Infinite Audio Archive",
      duration: t.duration ?? "",
      genre: t.genre ?? "",
      price: centsToDisplay(t.priceCents),
    }));

  const handleSignIn = () => {
    onSignIn();
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const togglePlay = (id: number) => {
    setPlayingId(prev => (prev === id ? null : id));
  };

  const links = isSignedIn ? signedInLinks : publicLinks;

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navigation */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(0,0,0,0.97)" : "rgba(0,0,0,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(6,182,212,0.25)" : "1px solid rgba(6,182,212,0.12)",
        padding: "0.85rem 2rem",
        transition: "all 0.3s"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--cyan-400), var(--purple-500))",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff"
            }}>
              <MusicIcon />
            </div>
            <span style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>
              INFINITE AUDIO ARCHIVE
            </span>
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {links.map(link => (
              link.highlight ? (
                <a key={link.label} href={link.href} style={{
                  display: "inline-flex", alignItems: "center", gap: "0.35rem",
                  background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(168,85,247,0.15))",
                  border: "1px solid rgba(6,182,212,0.35)",
                  color: "var(--cyan-400)", padding: "0.35rem 0.85rem",
                  borderRadius: 9999, fontSize: "0.875rem", fontWeight: 600,
                  textDecoration: "none", transition: "all 0.2s",
                  letterSpacing: "0.01em"
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(168,85,247,0.25))";
                    e.currentTarget.style.borderColor = "rgba(6,182,212,0.6)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(168,85,247,0.15))";
                    e.currentTarget.style.borderColor = "rgba(6,182,212,0.35)";
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cyan-400)", display: "inline-block", animation: "pulse 1.5s ease-in-out infinite" }} />
                  {link.label}
                </a>
              ) : (
                <NavLink key={link.label} href={link.href}>{link.label}</NavLink>
              )
            ))}
          </div>

          {/* Right side: CTA or User Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
            {isSignedIn ? (
              <>
                {/* Notification dot */}
                <div style={{ position: "relative" }}>
                  <button style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    color: "#9ca3af", padding: "0.4rem", borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "color 0.2s"
                  }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
                    title="Notifications"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  <span style={{
                    position: "absolute", top: 4, right: 4,
                    width: 7, height: 7, borderRadius: "50%",
                    background: "var(--cyan-400)", border: "1.5px solid #000"
                  }} />
                </div>
                {/* Avatar */}
                <button
                  onClick={() => onSignOut?.()}
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                  title="Sign out"
                  style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--cyan-500), var(--purple-500))",
                    border: avatarHover ? "2px solid var(--cyan-400)" : "2px solid rgba(6,182,212,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontWeight: 700, fontSize: "0.8rem",
                    color: "#fff", transition: "border-color 0.2s",
                    position: "relative"
                  }}
                >
                  {avatarHover ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  ) : "KS"}
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSignIn} style={{
                  background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                  color: "#d1d5db", padding: "0.45rem 1rem", borderRadius: 9999,
                  fontWeight: 500, cursor: "pointer", fontSize: "0.875rem",
                  transition: "all 0.2s"
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = "#d1d5db";
                  }}
                >
                  Sign In
                </button>
                <button onClick={handleSignIn} style={{
                  background: "var(--cyan-500)", color: "#000",
                  padding: "0.45rem 1.1rem", borderRadius: 9999,
                  fontWeight: 600, border: "none", cursor: "pointer",
                  transition: "background 0.2s", fontSize: "0.875rem",
                  whiteSpace: "nowrap"
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--cyan-400)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--cyan-500)")}
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: "12rem 2rem 6rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(6,182,212,0.1), transparent 50%)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", top: "20%", left: "25%",
          width: 600, height: 600,
          background: "var(--cyan-500)", opacity: 0.1,
          borderRadius: "50%", filter: "blur(120px)",
          pointerEvents: "none"
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Status badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(6,182,212,0.2)", border: "1px solid rgba(6,182,212,0.3)",
            borderRadius: 9999, padding: "0.5rem 1rem", marginBottom: "1.5rem"
          }}>
            <span style={{
              width: 8, height: 8, background: "var(--cyan-400)", borderRadius: "50%",
              animation: "pulse-dot 2s infinite",
              display: "inline-block"
            }} />
            <span style={{ color: "var(--cyan-400)", fontSize: "0.875rem", fontWeight: 500 }}>
              Powered by Astra AI
            </span>
          </div>

          <h1 style={{ fontSize: "4rem", fontWeight: 800, marginBottom: "1.5rem", lineHeight: 1.1 }}>
            <span>The AI Operating System for </span>
            <span style={{
              background: "linear-gradient(135deg, var(--cyan-400), var(--purple-500))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>Music Licensing</span>
          </h1>

          <p style={{ fontSize: "1.25rem", color: "#9ca3af", maxWidth: "42rem", margin: "0 auto 2.5rem" }}>
            A premium music archive powered by Astra AI. Secure licenses for YouTube, Film, and Commercial projects in seconds.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#tracks" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "var(--cyan-500)", color: "#000",
              padding: "1rem 2rem", borderRadius: 9999, fontWeight: 700,
              textDecoration: "none", transition: "all 0.2s",
              boxShadow: "0 0 30px rgba(6,182,212,0.3)"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--cyan-400)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--cyan-500)"; e.currentTarget.style.transform = "none"; }}
            >
              <PlayIcon size={20} />
              Explore Library
            </a>
            <a href="#pricing" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
              padding: "1rem 2rem", borderRadius: 9999, fontWeight: 600,
              textDecoration: "none", transition: "all 0.2s"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "transparent"; }}
            >
              View Pricing
            </a>
          </div>

          {/* Stats */}
          <div style={{
            maxWidth: "64rem", margin: "4rem auto 0",
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem"
          }}>
            {[
              { value: "26+", label: "Premium Tracks" },
              { value: "100%", label: "Royalty-Free" },
              { value: "0", label: "Copyright Claims" },
              { value: "24/7", label: "Instant Access" },
            ].map(stat => (
              <div key={stat.label} style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "1rem", padding: "1.5rem", textAlign: "center"
              }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--cyan-400)", marginBottom: "0.5rem" }}>
                  {stat.value}
                </div>
                <div style={{ color: "#9ca3af", fontSize: "0.875rem" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section style={{
        padding: "2.5rem 2rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.015)"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: "3rem", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", color: "#4b5563", textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0 }}>
            Trusted For
          </span>
          <div style={{ width: "1px", height: 20, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "YouTube", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              )},
              { label: "Film", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
                </svg>
              )},
              { label: "TV", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              )},
              { label: "Podcast", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                </svg>
              )},
              { label: "Commercial", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
                </svg>
              )},
              { label: "Gaming", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/>
                </svg>
              )},
              { label: "Advertising", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              )},
            ].map(({ label, icon }, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                {i > 0 && <div style={{ width: "1px", height: 16, background: "rgba(255,255,255,0.08)" }} />}
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.45rem",
                  color: "#6b7280", cursor: "default",
                  transition: "color 0.2s"
                }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#e5e7eb")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "#6b7280")}
                >
                  {icon}
                  <span style={{ fontSize: "0.85rem", fontWeight: 500, whiteSpace: "nowrap" }}>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section style={{ padding: "3rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
          {[
            {
              label: "A Growing Library",
              desc: "New tracks added weekly, curated for creators who demand more.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              ),
              accent: "var(--cyan-400)",
            },
            {
              label: "Royalty-Free",
              desc: "License once, use forever. No claims, no takedowns, ever.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              accent: "#22c55e",
            },
            {
              label: "Secure Licensing",
              desc: "Every purchase generates a legally binding license PDF instantly.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ),
              accent: "var(--purple-500)",
            },
            {
              label: "Instant Delivery",
              desc: "High-quality audio and your license in your inbox in seconds.",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              accent: "#f59e0b",
            },
          ].map(({ label, desc, icon, accent }) => (
            <div key={label} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16, padding: "1.75rem 1.5rem",
              transition: "border-color 0.25s, transform 0.25s",
              cursor: "default"
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${accent}55`;
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, marginBottom: "1.1rem",
                background: `${accent}18`,
                border: `1px solid ${accent}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: accent
              }}>
                {icon}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.45rem" }}>{label}</h3>
              <p style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tracks */}
      <section id="tracks" style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto 3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 700 }}>Featured Tracks</h2>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: "0.5rem" }}>
              ARCHIVE_SYNC: {storeTracks.length} TRACKS LOADED • MORE COMING SOON
            </p>
          </div>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); navigate("/store"); }}
            style={{ color: "var(--cyan-400)", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            View All <ChevronRight />
          </a>
        </div>

        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem"
        }}>
          {tracks.map(track => (
            <TrackCard key={track.id} track={track} isPlaying={playingId === track.id} onTogglePlay={() => togglePlay(track.id)} />
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section style={{
        padding: "5rem 2rem",
        background: "linear-gradient(180deg, transparent, rgba(168,85,247,0.05), transparent)"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto 3rem" }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 700 }}>Perfect For Every Project</h2>
          <p style={{ color: "#9ca3af", maxWidth: "42rem", marginTop: "0.5rem" }}>
            Khmer Smoke tracks are crafted for creators who demand quality, uniqueness, and complete copyright protection.
          </p>
        </div>

        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem"
        }}>
          {[
            {
              title: "YouTube Videos",
              desc: "monetize your content without worrying about copyright strikes",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={32} height={32}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )
            },
            {
              title: "Podcasts",
              desc: "professional intros and background music for your episodes",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={32} height={32}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )
            },
            {
              title: "Social Media",
              desc: "TikTok, Instagram Reels, and short-form content made easy",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={32} height={32}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                </svg>
              )
            },
            {
              title: "Film & Documentaries",
              desc: "cinematic scores for your visual storytelling projects",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={32} height={32}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              )
            },
          ].map(uc => (
            <UseCaseCard key={uc.title} {...uc} />
          ))}
        </div>
      </section>

      {/* Licensing Process */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.14em", color: "var(--cyan-400)", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            How It Works
          </p>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: "1rem" }}>
            Explain the Licensing Process
          </h2>
          <p style={{ color: "#9ca3af", maxWidth: "36rem", margin: "0 auto 4rem" }}>
            From discovery to download — get the perfect track licensed in under two minutes.
          </p>

          {/* Steps */}
          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 0 }}>
            {[
              {
                step: "01",
                label: "Choose Track",
                desc: "Browse our curated archive of cinematic, lo-fi, and ambient tracks built for creators.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                ),
              },
              {
                step: "02",
                label: "Select License",
                desc: "Pick the license that matches your project — YouTube, Podcast, Commercial, or Enterprise.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                step: "03",
                label: "Pay Securely",
                desc: "Checkout in seconds with card or PayPal. Your payment is fully encrypted and protected.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
              },
              {
                step: "04",
                label: "Instant Download",
                desc: "Your license PDF and high-quality audio file are delivered instantly to your inbox.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width={26} height={26} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                ),
              },
            ].map((s, i, arr) => (
              <div key={s.step} style={{ display: "flex", alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                {/* Step card */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 0.5rem" }}>
                  {/* Icon circle */}
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(6,182,212,0.18), rgba(168,85,247,0.12))",
                    border: "1px solid rgba(6,182,212,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--cyan-400)", marginBottom: "1.25rem", flexShrink: 0,
                    boxShadow: "0 0 24px rgba(6,182,212,0.12)"
                  }}>
                    {s.icon}
                  </div>
                  {/* Step number */}
                  <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", color: "var(--cyan-400)", marginBottom: "0.35rem", opacity: 0.7 }}>
                    STEP {s.step}
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem" }}>{s.label}</h3>
                  <p style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.6, maxWidth: 180 }}>{s.desc}</p>
                </div>

                {/* Arrow between steps */}
                {i < arr.length - 1 && (
                  <div style={{
                    display: "flex", alignItems: "center", paddingTop: 20, flexShrink: 0, color: "rgba(6,182,212,0.35)"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ marginTop: "3.5rem" }}>
            <a href="#tracks" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "var(--cyan-500)", color: "#000",
              padding: "0.85rem 2rem", borderRadius: 9999,
              fontWeight: 700, textDecoration: "none", fontSize: "0.9rem",
              transition: "background 0.2s"
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--cyan-400)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--cyan-500)")}
            >
              Browse the Library
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Meet Astra */}
      <section style={{
        padding: "5rem 2rem",
        background: "linear-gradient(180deg, transparent, rgba(6,182,212,0.04), rgba(168,85,247,0.04), transparent)"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

          {/* Left — copy */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)",
              borderRadius: 9999, padding: "0.35rem 1rem", marginBottom: "1.5rem"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--purple-500)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", color: "var(--purple-500)", textTransform: "uppercase" }}>Powered by AI</span>
            </div>

            <h2 style={{ fontSize: "2.75rem", fontWeight: 800, lineHeight: 1.1, marginBottom: "1rem" }}>
              Meet{" "}
              <span style={{
                background: "linear-gradient(135deg, var(--cyan-400), var(--purple-500))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>Astra</span>
            </h2>
            <p style={{ color: "#9ca3af", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "38ch" }}>
              Astra's AI engine analyzes every track in real time — surfacing revenue opportunities, flagging risks, and helping you make smarter licensing decisions before your competitors do.
            </p>

            {/* Checklist */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              {[
                { label: "Commercial potential", desc: "Scores each track's likelihood to convert in paid campaigns." },
                { label: "Film compatibility", desc: "Matches sonic profiles to genre, tempo, and scene mood." },
                { label: "Revenue forecasts", desc: "Projects 30-day earnings based on catalog trends." },
                { label: "Copyright monitoring", desc: "Detects unauthorized use across major platforms 24/7." },
                { label: "Pricing recommendations", desc: "Dynamic pricing suggestions based on demand signals." },
                { label: "Customer insights", desc: "Understands who's licensing and why, so you sell smarter." },
              ].map(({ label, desc }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                    background: "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(168,85,247,0.2))",
                    border: "1px solid rgba(6,182,212,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--cyan-400)" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{label}</span>
                    <span style={{ color: "#6b7280", fontSize: "0.85rem" }}> — {desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <a href="#contact" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              marginTop: "2.5rem",
              background: "linear-gradient(135deg, var(--cyan-500), var(--purple-500))",
              color: "#fff", fontWeight: 700, fontSize: "0.9rem",
              padding: "0.85rem 1.75rem", borderRadius: 9999,
              textDecoration: "none", transition: "opacity 0.2s"
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Activate Astra
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </a>
          </div>

          {/* Right — visual orb / AI card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", width: 360, height: 360 }}>
              {/* Outer glow ring */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(168,85,247,0.08) 50%, transparent 70%)",
                animation: "float 5s ease-in-out infinite"
              }} />
              {/* Middle ring */}
              <div style={{
                position: "absolute", inset: 40, borderRadius: "50%",
                border: "1px solid rgba(6,182,212,0.2)",
                animation: "float 4s ease-in-out infinite reverse"
              }} />
              {/* Inner ring */}
              <div style={{
                position: "absolute", inset: 80, borderRadius: "50%",
                border: "1px solid rgba(168,85,247,0.25)",
                animation: "float 3s ease-in-out infinite"
              }} />
              {/* Core orb */}
              <div style={{
                position: "absolute", inset: 110, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--cyan-500), var(--purple-500))",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 60px rgba(6,182,212,0.4), 0 0 120px rgba(168,85,247,0.2)",
                animation: "glow 2.5s ease-in-out infinite"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width={52} height={52} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#fff" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              {/* Floating stat chips */}
              {[
                { label: "Opp. Score", value: "94%", top: "8%", left: "-12%", color: "var(--cyan-400)" },
                { label: "Revenue ↑", value: "+18%", top: "8%", right: "-12%", color: "#22c55e" },
                { label: "Tracks", value: "26+", bottom: "8%", left: "-8%", color: "var(--purple-500)" },
                { label: "Claims", value: "0", bottom: "8%", right: "-8%", color: "var(--cyan-400)" },
              ].map(({ label, value, color, ...pos }) => (
                <div key={label} style={{
                  position: "absolute", ...pos,
                  background: "rgba(6,8,15,0.92)",
                  border: "1px solid rgba(6,182,212,0.25)",
                  borderRadius: 12, padding: "0.5rem 0.85rem",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                  animation: "float 4s ease-in-out infinite"
                }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: "0.65rem", color: "#6b7280", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Run Your Music Business with Astra */}
      <section style={{
        padding: "5rem 2rem",
        background: "linear-gradient(180deg, transparent, rgba(168,85,247,0.05), rgba(6,182,212,0.03), transparent)"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)",
              borderRadius: 9999, padding: "0.35rem 1rem", marginBottom: "1.25rem"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--cyan-400)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", color: "var(--cyan-400)", textTransform: "uppercase" }}>Full Business Suite</span>
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.15, marginBottom: "1rem" }}>
              Run Your Music Business{" "}
              <span style={{
                background: "linear-gradient(135deg, var(--cyan-400), var(--purple-500))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>with Astra</span>
            </h2>
            <p style={{ color: "#9ca3af", maxWidth: "40ch", margin: "0 auto", fontSize: "1rem", lineHeight: 1.7 }}>
              Every tool you need to grow, protect, and monetize your music catalog — in one AI-powered platform.
            </p>
          </div>

          {/* Feature grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {[
              {
                label: "Track Revenue",
                desc: "Real-time earnings across every license type and platform.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                accent: "#22c55e",
              },
              {
                label: "Customer CRM",
                desc: "Know who's buying, what they license, and when to re-engage.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                accent: "var(--cyan-400)",
              },
              {
                label: "AI Licensing",
                desc: "Astra matches tracks to buyers and auto-recommends license tiers.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                accent: "var(--purple-500)",
              },
              {
                label: "Royalty Management",
                desc: "Automated royalty splits, statements, and payout scheduling.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                  </svg>
                ),
                accent: "#f59e0b",
              },
              {
                label: "Sales Analytics",
                desc: "Conversion funnels, revenue trends, and top-performing tracks.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                accent: "var(--cyan-400)",
              },
              {
                label: "Copyright Protection",
                desc: "24/7 monitoring across YouTube, TikTok, Instagram, and more.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                accent: "#22c55e",
              },
              {
                label: "Marketing Automation",
                desc: "Auto-generate campaigns when a track hits a revenue milestone.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                ),
                accent: "var(--purple-500)",
              },
              {
                label: "Business Intelligence",
                desc: "Executive reports, forecasts, and market positioning — powered by AI.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                accent: "#f59e0b",
              },
            ].map(({ label, desc, icon, accent }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: "1.5rem",
                display: "flex", flexDirection: "column", gap: "0.75rem",
                transition: "border-color 0.25s, transform 0.25s",
                cursor: "default"
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${accent}44`;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  {/* Check + icon */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: `${accent}18`, border: `1px solid ${accent}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: accent
                  }}>
                    {icon}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: accent, flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{label}</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#6b7280", lineHeight: 1.6, paddingLeft: "0.1rem" }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "3rem", flexWrap: "wrap" }}>
            <a href="#contact" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "linear-gradient(135deg, var(--cyan-500), var(--purple-500))",
              color: "#fff", fontWeight: 700, fontSize: "0.9rem",
              padding: "0.85rem 2rem", borderRadius: 9999,
              textDecoration: "none", transition: "opacity 0.2s"
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Start Free — No Credit Card
            </a>
            <a href="#pricing" style={{
              color: "#9ca3af", fontWeight: 500, fontSize: "0.875rem",
              textDecoration: "none", transition: "color 0.2s"
            }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
            >
              View pricing →
            </a>
          </div>
        </div>
      </section>

      {/* ASTRA LIVE — CEO Dashboard Preview */}
      <section style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)",
              borderRadius: 9999, padding: "0.35rem 1rem", marginBottom: "1rem"
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "var(--cyan-400)",
                display: "inline-block",
                animation: "pulse 1.5s ease-in-out infinite"
              }} />
              <span style={{ color: "var(--cyan-400)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em" }}>LIVE</span>
            </div>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              CEO Dashboard Preview
            </h2>
            <p style={{ color: "#9ca3af" }}>
              Powered by <span style={{ color: "var(--cyan-400)", fontWeight: 600 }}>ASTRA LIVE</span> — real-time intelligence for your catalog
            </p>
          </div>

          {/* Dashboard Card */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(6,182,212,0.25)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 0 60px rgba(6,182,212,0.08)"
          }}>
            {/* Top Bar */}
            <div style={{
              background: "rgba(6,182,212,0.08)",
              borderBottom: "1px solid rgba(6,182,212,0.15)",
              padding: "0.85rem 1.5rem",
              display: "flex", alignItems: "center", gap: "0.6rem"
            }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              <span style={{ marginLeft: "auto", color: "var(--cyan-400)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em" }}>
                ASTRA LIVE · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>

            <div style={{ padding: "2rem" }}>
              {/* KPI Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                {[
                  { label: "Today's Revenue", value: "$2,430", icon: "💰", color: "var(--cyan-400)" },
                  { label: "Commercial Licenses", value: "18", icon: "📄", color: "var(--purple-500)" },
                  { label: "Enterprise Deals", value: "4", icon: "🤝", color: "#f59e0b" },
                  { label: "AI Opportunity Score", value: "94%", icon: "🧠", color: "#22c55e" },
                ].map((kpi) => (
                  <div key={kpi.label} style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: "1.25rem",
                    transition: "border-color 0.2s"
                  }}>
                    <div style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{kpi.icon}</div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
                    <div style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.35rem" }}>{kpi.label}</div>
                  </div>
                ))}
              </div>

              {/* Top Selling Track */}
              <div style={{
                background: "rgba(6,182,212,0.06)",
                border: "1px solid rgba(6,182,212,0.2)",
                borderRadius: 14,
                padding: "1.25rem 1.5rem",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "1rem",
                marginBottom: "1.5rem"
              }}>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>🏆 Top Selling Track</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700 }}>Khmer Smoke – My Side</div>
                </div>
                <div style={{
                  background: "rgba(6,182,212,0.15)",
                  border: "1px solid rgba(6,182,212,0.3)",
                  borderRadius: 9999, padding: "0.3rem 0.9rem",
                  color: "var(--cyan-400)", fontSize: "0.8rem", fontWeight: 600
                }}>
                  #1 This Week
                </div>
              </div>

              {/* Recommended Action */}
              <div style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(6,182,212,0.08))",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: 14,
                padding: "1.5rem"
              }}>
                <div style={{ fontSize: "0.7rem", color: "var(--purple-500)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  ⚡ AI Recommended Action
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>Promote Track #17</div>
                    <div style={{ fontSize: "0.875rem", color: "#9ca3af" }}>
                      ASTRA detected rising demand in the Film licensing segment for this track's sonic profile.
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.2rem" }}>Potential Revenue</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#22c55e" }}>+$520</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto 3rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 700 }}>Simple, Transparent Pricing</h2>
          <p style={{ color: "#9ca3af", maxWidth: "42rem", margin: "0.5rem auto 0" }}>
            Choose the license that fits your project. No hidden fees, no surprises.
          </p>
        </div>

        <div style={{ maxWidth: "80rem", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
          {/* Free */}
          <PricingCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={48} height={48}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            }
            name="FREE"
            type="Standard"
            price="$0"
            features={["Attribution required", "Personal projects only", "YouTube under 10K subscribers", "Basic metadata included"]}
            ctaText="Download Free"
            ctaVariant="secondary"
          />

          {/* Commercial - Featured */}
          <PricingCard
            featured
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={48} height={48}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            name="COMMERCIAL"
            type="Creator's Shield"
            price="$49"
            priceUnit="/track"
            features={["Zero copyright claims guaranteed", "Unlimited commercial use", "YouTube, podcasts & social media", "Full metadata & stems", "Priority support"]}
            ctaText="Get Commercial License"
            ctaVariant="primary"
          />

          {/* Enterprise */}
          <PricingCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={48} height={48}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            name="ENTERPRISE"
            type="Broadcast & TV"
            price="$199"
            priceUnit="+/track"
            features={["TV, film & documentary licensing", "Unlimited broadcast rights", "Custom contract available", "Exclusive usage terms", "Dedicated account manager"]}
            ctaText="Contact for Pricing"
            ctaVariant="secondary"
          />
        </div>

        {/* Bundle Offer */}
        <div style={{ maxWidth: "48rem", margin: "4rem auto 0" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2), rgba(236,72,153,0.2))",
            border: "1px solid rgba(6,182,212,0.3)",
            borderRadius: "1.5rem", padding: "2.5rem", textAlign: "center"
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(6,182,212,0.2)", borderRadius: 9999,
              padding: "0.5rem 1rem", marginBottom: "1.5rem",
              color: "var(--cyan-400)", fontSize: "0.875rem", fontWeight: 500
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={16} height={16}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              LIMITED TIME OFFER
            </div>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem" }}>Standard Bundle</h3>
            <p style={{ color: "#d1d5db", marginBottom: "1.5rem" }}>
              Get 5 premium Khmer Smoke tracks for just{" "}
              <strong style={{ color: "var(--cyan-400)" }}>$49</strong>.
              The perfect starting point for creators ready to elevate their content.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
              <PrimaryButton>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={20} height={20}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get 5 Tracks for $49
              </PrimaryButton>
              <a href="#" style={{ color: "var(--cyan-400)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                View All Bundles →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "5rem 2rem", background: "linear-gradient(180deg, transparent, rgba(6,182,212,0.05), transparent)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto 3rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 700 }}>Trusted by Creators</h2>
          <p style={{ color: "#9ca3af", marginTop: "0.5rem" }}>
            Join thousands of creators who trust Khmer Smoke for their projects
          </p>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {testimonials.map(t => (
            <div key={t.name} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "1rem", padding: "1.5rem"
            }}>
              <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>
              <p style={{ color: "#d1d5db", fontStyle: "italic", marginBottom: "1.5rem" }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--cyan-400), var(--purple-500))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.875rem", fontWeight: 700
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" style={{ textAlign: "center", padding: "6rem 2rem", position: "relative" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem" }}>
          Ready to Elevate Your Content?
        </h2>
        <p style={{ color: "#9ca3af", fontSize: "1.125rem", maxWidth: "42rem", margin: "0 auto 2rem" }}>
          Join the archive today and get instant access to premium Khmer Smoke tracks. Your first license is just one click away.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#tracks" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "linear-gradient(135deg, var(--cyan-500), var(--purple-500))",
            color: "#fff", padding: "1rem 2rem", borderRadius: 9999, fontWeight: 700,
            textDecoration: "none", boxShadow: "0 0 30px rgba(168,85,247,0.3)", transition: "all 0.2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={20} height={20}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
            Start Exploring Now
          </a>
          <a href="mailto:contact@infiniteaudioarchive.com" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
            padding: "1rem 2rem", borderRadius: 9999, fontWeight: 600,
            textDecoration: "none", transition: "all 0.2s"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "transparent"; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={20} height={20}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Contact Sales
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "3rem 2rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--cyan-400), var(--purple-500))",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#fff"
                }}>
                  <MusicIcon />
                </div>
                <span style={{ fontSize: "1.125rem", fontWeight: 700, letterSpacing: "-0.025em" }}>
                  INFINITE AUDIO ARCHIVE
                </span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: "1rem" }}>
                Premium Khmer Smoke music for creators who demand excellence.
              </p>
            </div>

            <FooterColumn title="Music Library" links={["All Tracks", "Bundles", "New Releases"]} />
            <FooterColumn title="Licensing" links={["Free License", "Commercial License", "Enterprise License"]} />
            <FooterColumn title="Support" links={["FAQ", "Contact Us", "Discord Community"]} />
          </div>

          <div style={{ paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              © 2025 Infinite Audio Archive. All rights reserved. Powered by Astra AI.
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 9999, padding: "0.5rem 1rem"
            }}>
              <span style={{
                width: 8, height: 8, background: "#22c55e", borderRadius: "50%",
                animation: "pulse-dot 2s infinite", display: "inline-block"
              }} />
              <span style={{ color: "#22c55e", fontSize: "0.875rem", fontWeight: 500 }}>
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Astra Widget */}
      <AstraWidget isSignedIn={isSignedIn} />
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{ color: "#9ca3af", textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}
      onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan-400)")}
      onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
    >
      {children}
    </a>
  );
}

function TrackCard({ track, isPlaying, onTogglePlay }: {
  track: FeaturedTrack; isPlaying: boolean; onTogglePlay: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
        border: `1px solid ${hovered ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "1rem", overflow: "hidden", transition: "all 0.3s"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <button
            onClick={onTogglePlay}
            style={{
              width: 48, height: 48, borderRadius: "50%",
              background: isPlaying ? "var(--cyan-500)" : "rgba(6,182,212,0.2)",
              border: "none", color: isPlaying ? "#000" : "var(--cyan-400)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s"
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>{track.duration}</span>
        </div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.25rem" }}>{track.title}</h3>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{track.artist}</p>
        <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginBottom: "1rem" }}>{track.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ background: "rgba(255,255,255,0.1)", padding: "0.25rem 0.75rem", borderRadius: 9999, fontSize: "0.75rem", color: "#9ca3af" }}>
            {track.genre}
          </span>
          <span style={{ color: "var(--cyan-400)", fontWeight: 700 }}>{track.price}</span>
        </div>
        <LicenseButton />
      </div>
    </div>
  );
}

function LicenseButton() {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{
        padding: "0.75rem 1.5rem",
        background: hov ? "var(--cyan-400)" : "var(--cyan-500)",
        color: "#000", border: "none", borderRadius: "0.75rem",
        fontWeight: 600, cursor: "pointer", width: "100%", marginTop: "1rem",
        transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={16} height={16}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
      License This Track
    </button>
  );
}

function UseCaseCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${hov ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "1rem", padding: "2rem", textAlign: "center", transition: "all 0.3s"
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{
        width: 64, height: 64, margin: "0 auto 1rem",
        borderRadius: "1rem",
        background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2))",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--cyan-400)"
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>{desc}</p>
    </div>
  );
}

function PricingCard({
  icon, name, type, price, priceUnit, features, ctaText, ctaVariant, featured
}: {
  icon: React.ReactNode; name: string; type: string; price: string; priceUnit?: string;
  features: string[]; ctaText: string; ctaVariant: "primary" | "secondary"; featured?: boolean;
}) {
  return (
    <div style={{
      background: featured ? "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2))" : "rgba(255,255,255,0.05)",
      border: featured ? "2px solid var(--cyan-500)" : "1px solid rgba(255,255,255,0.1)",
      borderRadius: "1.5rem", padding: "2rem", position: "relative", transition: "all 0.3s"
    }}>
      {featured && (
        <span style={{
          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
          background: "var(--cyan-500)", color: "#000", fontSize: "0.75rem",
          fontWeight: 700, padding: "0.25rem 1rem", borderRadius: 9999
        }}>
          MOST POPULAR
        </span>
      )}
      <div style={{ color: featured ? "var(--cyan-400)" : "#9ca3af", marginBottom: "1rem" }}>{icon}</div>
      <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>{name}</h3>
      <p style={{ color: "#9ca3af", marginBottom: "1rem" }}>{type}</p>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "3rem", fontWeight: 700 }}>{price}</span>
        {priceUnit && <span style={{ color: "#9ca3af" }}>{priceUnit}</span>}
      </div>
      <ul style={{ listStyle: "none", marginBottom: "2rem" }}>
        {features.map(f => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem 0", fontSize: "0.875rem", color: "#d1d5db" }}>
            <CheckIcon />
            {f}
          </li>
        ))}
      </ul>
      <PricingCta variant={ctaVariant}>{ctaText}</PricingCta>
    </div>
  );
}

function PricingCta({ children, variant }: { children: React.ReactNode; variant: "primary" | "secondary" }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{
        width: "100%", padding: "1rem", borderRadius: "0.75rem", fontWeight: 600,
        cursor: "pointer", transition: "all 0.2s",
        background: variant === "primary" ? (hov ? "var(--cyan-400)" : "var(--cyan-500)") : (hov ? "rgba(255,255,255,0.1)" : "transparent"),
        color: variant === "primary" ? "#000" : "#fff",
        border: variant === "primary" ? "none" : "1px solid rgba(255,255,255,0.2)"
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
        background: "var(--cyan-500)", color: "#000",
        padding: "1rem 2rem", borderRadius: 9999, fontWeight: 700, border: "none",
        cursor: "pointer", transition: "all 0.2s",
        boxShadow: "0 0 30px rgba(6,182,212,0.3)",
        transform: hov ? "translateY(-2px)" : "none",
        backgroundColor: hov ? "var(--cyan-400)" : "var(--cyan-500)"
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 style={{ fontWeight: 600, marginBottom: "1rem" }}>{title}</h4>
      <ul style={{ listStyle: "none" }}>
        {links.map(link => (
          <li key={link} style={{ marginBottom: "0.5rem" }}>
            <a href="#" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "0.875rem", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--cyan-400)")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
