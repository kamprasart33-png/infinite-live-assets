import { useState, useEffect } from "react";
import "./index.css";

const tracks = [
  {
    id: 1,
    title: "Celestial Whispers",
    artist: "KHMER SMOKE",
    description: "ethereal night ambience for deep calm & meditation",
    duration: "3:24",
    genre: "Ethereal Ambience",
    price: "$49",
  },
  {
    id: 2,
    title: "Urban Pulse",
    artist: "KHMER SMOKE",
    description: "hard-hitting beats with traditional Khmer undertones",
    duration: "2:58",
    genre: "Cinematic Trap",
    price: "$79",
  },
  {
    id: 3,
    title: "Golden Hour",
    artist: "KHMER SMOKE",
    description: "relaxing lo-fi beats perfect for content creation",
    duration: "4:12",
    genre: "Lo-Fi Chill",
    price: "$49",
  },
];

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

export default function App() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const togglePlay = (id: number) => {
    setPlayingId(prev => (prev === id ? null : id));
  };

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Navigation */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(6,182,212,0.2)",
        padding: "1rem 2rem",
        transition: "background 0.3s"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <NavLink href="#tracks">Music Library</NavLink>
            <NavLink href="#pricing">Licensing</NavLink>
            <NavLink href="#about">About</NavLink>
            <a href="#contact" style={{
              background: "var(--cyan-500)", color: "#000",
              padding: "0.5rem 1rem", borderRadius: 9999,
              fontWeight: 600, textDecoration: "none",
              transition: "background 0.2s"
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--cyan-400)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--cyan-500)")}
            >
              Get Started
            </a>
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
            <span>CINEMATIC </span>
            <span style={{
              background: "linear-gradient(135deg, var(--cyan-400), var(--purple-500))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>INTELLIGENCE</span>
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

      {/* Featured Tracks */}
      <section id="tracks" style={{ padding: "5rem 2rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto 3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h2 style={{ fontSize: "2.25rem", fontWeight: 700 }}>Featured Tracks</h2>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: "0.5rem" }}>
              ARCHIVE_SYNC: 5 TRACKS LOADED • MORE COMING SOON
            </p>
          </div>
          <a href="#" style={{ color: "var(--cyan-400)", textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
  track: typeof tracks[0]; isPlaying: boolean; onTogglePlay: () => void;
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
