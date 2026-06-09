import { useState, useEffect, useRef } from "react";

/* ─── IBM Plex font ─────────────────────────────────────────────── */
const fontLink = document.getElementById("ibm-plex-font");
if (!fontLink) {
  const link = document.createElement("link");
  link.id = "ibm-plex-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap";
  document.head.appendChild(link);
}

/* ─── Nav ────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = document.getElementById("gp-scroll");
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 0);
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled ? "#000" : "#000",
        borderBottom: "1px solid #393939",
        height: 48,
        display: "flex",
        alignItems: "center",
        paddingInline: 0,
      }}
    >
      <div
        style={{
          maxWidth: 1584,
          width: "100%",
          margin: "0 auto",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" fill="#0f62fe" rx="2" />
            <path d="M8 10h16M8 16h10M8 22h16" stroke="#fff" strokeWidth="2.5" strokeLinecap="square" />
            <circle cx="22" cy="22" r="4" fill="#fff" />
          </svg>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 400, letterSpacing: 0.1 }}>
            GistPad
          </span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          {["Features", "Docs", "Changelog", "GitHub"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                color: "#c6c6c6",
                fontSize: 14,
                textDecoration: "none",
                padding: "0 16px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                borderLeft: "1px solid #393939",
                transition: "background .15s, color .15s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.background = "#353535";
                (e.target as HTMLAnchorElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.background = "transparent";
                (e.target as HTMLAnchorElement).style.color = "#c6c6c6";
              }}
            >
              {item}
            </a>
          ))}
          <a
            href="#"
            style={{
              background: "#0f62fe",
              color: "#fff",
              fontSize: 14,
              textDecoration: "none",
              padding: "0 20px",
              height: "100%",
              display: "flex",
              alignItems: "center",
              borderLeft: "1px solid #0f62fe",
              whiteSpace: "nowrap",
              transition: "background .15s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#0353e9")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "#0f62fe")}
          >
            Install extension →
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─── Animated counter ──────────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = Date.now();
        const dur = 1200;
        const tick = () => {
          const p = Math.min((Date.now() - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Code block ─────────────────────────────────────────────────── */
const SNIPPET = [
  { c: "#be95ff", t: "import" },
  { c: "#fff", t: " { gist } " },
  { c: "#be95ff", t: "from" },
  { c: "#42be65", t: " 'gistpad';\n\n" },
  { c: "#78a9ff", t: "const" },
  { c: "#fff", t: " note = " },
  { c: "#be95ff", t: "await" },
  { c: "#fff", t: " gist.open(" },
  { c: "#42be65", t: "'abc123'" },
  { c: "#fff", t: ");\n" },
  { c: "#78a9ff", t: "const" },
  { c: "#fff", t: " lines = note.content.split(" },
  { c: "#42be65", t: "'\\n'" },
  { c: "#fff", t: ");\n\n" },
  { c: "#ff7eb6", t: "// Append today's entry\n" },
  { c: "#fff", t: "lines.push(" },
  { c: "#42be65", t: "`## ${new Date().toDateString()}`" },
  { c: "#fff", t: ");\n" },
  { c: "#be95ff", t: "await" },
  { c: "#fff", t: " note.save(lines.join(" },
  { c: "#42be65", t: "'\\n'" },
  { c: "#fff", t: "));\n" },
];

function CodeBlock() {
  const [revealed, setRevealed] = useState(0);
  const full = SNIPPET.map((s) => s.t).join("");
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (charIdx >= full.length) return;
    const t = setTimeout(() => setCharIdx((c) => c + 1), 22);
    return () => clearTimeout(t);
  }, [charIdx, full.length]);

  // Build visible text
  let used = 0;
  const spans = SNIPPET.map((seg, i) => {
    const start = used;
    used += seg.t.length;
    const visible = full.slice(start, Math.min(used, charIdx));
    if (!visible) return null;
    return (
      <span key={i} style={{ color: seg.c, whiteSpace: "pre" }}>
        {visible}
      </span>
    );
  });

  return (
    <div
      style={{
        background: "#161616",
        border: "1px solid #393939",
        padding: "24px 28px",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 13,
        lineHeight: "22px",
        position: "relative",
        minHeight: 200,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          background: "#262626",
          borderBottom: "1px solid #393939",
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: "#c6c6c6", fontSize: 12 }}>gistpad.ts</span>
        <span style={{ color: "#6f6f6f", fontSize: 11 }}>TypeScript</span>
      </div>
      <div style={{ marginTop: 28 }}>
        {spans}
        {charIdx < full.length && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 14,
              background: "#0f62fe",
              verticalAlign: "text-bottom",
              animation: "blink 1s step-end infinite",
            }}
          />
        )}
      </div>
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

/* ─── Feature row ────────────────────────────────────────────────── */
type Feat = { tag: string; title: string; body: string; accent: string };
function FeatureRow({ feat, reverse }: { feat: Feat; reverse?: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderBottom: "1px solid #393939",
        direction: reverse ? "rtl" : "ltr",
      }}
    >
      {/* Text */}
      <div
        style={{
          padding: "80px 64px",
          direction: "ltr",
          borderRight: "1px solid #393939",
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: feat.accent,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            display: "block",
            marginBottom: 20,
          }}
        >
          {feat.tag}
        </span>
        <h3
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 28,
            fontWeight: 300,
            color: "#f4f4f4",
            lineHeight: 1.25,
            marginBottom: 20,
            maxWidth: 360,
          }}
        >
          {feat.title}
        </h3>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 16,
            fontWeight: 300,
            color: "#c6c6c6",
            lineHeight: 1.6,
            maxWidth: 380,
            marginBottom: 32,
          }}
        >
          {feat.body}
        </p>
        <a
          href="#"
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            color: feat.accent,
            fontSize: 14,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Learn more <span style={{ fontSize: 16 }}>→</span>
        </a>
      </div>

      {/* Visual */}
      <div
        style={{
          background: "#161616",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          direction: "ltr",
          minHeight: 360,
        }}
      >
        <FeatureIllustration tag={feat.tag} accent={feat.accent} />
      </div>
    </div>
  );
}

function FeatureIllustration({ tag, accent }: { tag: string; accent: string }) {
  if (tag.includes("GIST")) {
    return (
      <div style={{ width: "100%", maxWidth: 340 }}>
        {["meeting-notes.md", "config.json", "deploy.sh", "snippets.ts"].map((f, i) => (
          <div
            key={f}
            style={{
              background: "#262626",
              border: `1px solid ${i === 0 ? accent : "#393939"}`,
              padding: "12px 16px",
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 13,
              color: i === 0 ? "#fff" : "#8d8d8d",
            }}
          >
            <span style={{ color: accent, fontSize: 16 }}>
              {f.endsWith(".md") ? "📄" : f.endsWith(".json") ? "📋" : f.endsWith(".sh") ? "⚙️" : "🔷"}
            </span>
            {f}
          </div>
        ))}
      </div>
    );
  }
  if (tag.includes("PLAYGROUND")) {
    return (
      <div style={{ width: "100%", maxWidth: 340 }}>
        <div style={{ background: "#1a1a1a", border: "1px solid #393939", overflow: "hidden" }}>
          <div style={{ background: "#262626", padding: "8px 12px", borderBottom: "1px solid #393939", display: "flex", gap: 8 }}>
            {["HTML", "CSS", "JS"].map((t, i) => (
              <span key={t} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: i === 2 ? accent : "#6f6f6f", padding: "2px 8px", background: i === 2 ? "#333" : "transparent" }}>{t}</span>
            ))}
          </div>
          <div style={{ padding: 16, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, lineHeight: 1.8 }}>
            <span style={{ color: "#78a9ff" }}>const</span>
            <span style={{ color: "#fff" }}> button = document.</span>
            <span style={{ color: "#82cfff" }}>createElement</span>
            <span style={{ color: "#fff" }}>(</span>
            <span style={{ color: "#42be65" }}>'button'</span>
            <span style={{ color: "#fff" }}>);<br /></span>
            <span style={{ color: "#fff" }}>button.</span>
            <span style={{ color: "#82cfff" }}>textContent</span>
            <span style={{ color: "#fff" }}> = </span>
            <span style={{ color: "#42be65" }}>'Hello!'</span>
            <span style={{ color: "#fff" }}>;</span>
          </div>
          <div style={{ margin: 16, marginTop: 0, background: "#000", border: `1px solid ${accent}`, padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button style={{ background: accent, color: "#fff", border: "none", padding: "8px 16px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, cursor: "pointer" }}>Hello!</button>
          </div>
        </div>
      </div>
    );
  }
  // WIKI
  return (
    <div style={{ width: "100%", maxWidth: 340, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>
      <div style={{ background: "#262626", border: "1px solid #393939", padding: 20 }}>
        <div style={{ color: accent, fontWeight: 600, marginBottom: 10 }}>## Meeting Notes</div>
        <div style={{ color: "#c6c6c6", lineHeight: 1.9 }}>
          <div>- Shipped <span style={{ color: accent }}>[[GistPad v2]]</span></div>
          <div>- See <span style={{ color: accent }}>[[Deploy Guide]]</span></div>
          <div>- Follow up on <span style={{ color: accent }}>[[API Redesign]]</span></div>
        </div>
        <div style={{ marginTop: 14, borderTop: "1px solid #393939", paddingTop: 10 }}>
          <span style={{ color: "#6f6f6f", fontSize: 11 }}>3 backlinks found →</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────────────── */
function StatCard({ n, suffix, label, sub }: { n: number; suffix: string; label: string; sub: string }) {
  return (
    <div
      style={{
        borderRight: "1px solid #393939",
        padding: "48px 40px",
        flex: 1,
      }}
    >
      <div
        style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 54,
          fontWeight: 300,
          color: "#fff",
          lineHeight: 1,
          marginBottom: 12,
        }}
      >
        <Counter target={n} suffix={suffix} />
      </div>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, color: "#f4f4f4", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 300, color: "#8d8d8d" }}>
        {sub}
      </div>
    </div>
  );
}

/* ─── Main ────────────────────────────────────────────────────────── */
const FEATURES: Feat[] = [
  {
    tag: "01 / GIST MANAGEMENT",
    title: "Your code snippets, always at hand",
    body: "Create, edit, fork, and star GitHub Gists without leaving VS Code. Browse by language, star, or tag. Every change syncs to GitHub in real time.",
    accent: "#0f62fe",
  },
  {
    tag: "02 / INTERACTIVE PLAYGROUNDS",
    title: "Run code the moment you write it",
    body: "Execute HTML, CSS, JavaScript, and React directly inside a gist. No build step, no browser tab switching — live preview updates as you type.",
    accent: "#42be65",
  },
  {
    tag: "03 / PERSONAL WIKI",
    title: "Connect ideas with wikilinks",
    body: "Turn your gist collection into a navigable knowledge base. Link notes with [[double brackets]], follow backlinks, and build a second brain inside your editor.",
    accent: "#be95ff",
  },
];

export default function LandingPage() {
  return (
    <div
      id="gp-scroll"
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        background: "#000",
        color: "#f4f4f4",
        minHeight: "100vh",
        overflowY: "auto",
        height: "100vh",
      }}
    >
      <Nav />

      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: 1584,
          margin: "0 auto",
          padding: "0 16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "calc(100vh - 48px)",
          alignItems: "center",
          borderBottom: "1px solid #393939",
          gap: 0,
        }}
      >
        {/* Left */}
        <div style={{ paddingRight: 80, borderRight: "1px solid #393939", paddingBlock: 80 }}>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "#0f62fe",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            VS Code Extension
          </p>
          <h1
            style={{
              fontSize: 60,
              fontWeight: 300,
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: 28,
              letterSpacing: -0.5,
            }}
          >
            GitHub Gists,
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 300 }}>inside</em>
            <br />
            your editor.
          </h1>
          <p
            style={{
              fontSize: 18,
              fontWeight: 300,
              color: "#c6c6c6",
              lineHeight: 1.6,
              maxWidth: 440,
              marginBottom: 48,
            }}
          >
            GistPad brings GitHub Gist management, interactive code playgrounds, and a personal wiki into VS Code — without a single browser tab.
          </p>
          <div style={{ display: "flex", gap: 0, alignItems: "center" }}>
            <a
              href="#"
              style={{
                background: "#0f62fe",
                color: "#fff",
                fontSize: 16,
                textDecoration: "none",
                padding: "16px 32px",
                display: "inline-block",
                fontWeight: 400,
                letterSpacing: 0.1,
                transition: "background .15s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#0353e9")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "#0f62fe")}
            >
              Install from Marketplace →
            </a>
            <a
              href="#"
              style={{
                border: "1px solid #393939",
                color: "#c6c6c6",
                fontSize: 16,
                textDecoration: "none",
                padding: "16px 32px",
                display: "inline-block",
                transition: "border-color .15s, color .15s",
                marginLeft: -1,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = "#c6c6c6";
                (e.target as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = "#393939";
                (e.target as HTMLElement).style.color = "#c6c6c6";
              }}
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Right — code */}
        <div style={{ paddingLeft: 64, paddingBlock: 80 }}>
          <CodeBlock />
          <div
            style={{
              marginTop: 20,
              padding: "14px 20px",
              background: "#161616",
              border: "1px solid #393939",
              borderTop: "none",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#42be65",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#8d8d8d" }}>
              Gist synced · octocat · 2s ago
            </span>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        style={{
          display: "flex",
          borderBottom: "1px solid #393939",
          maxWidth: "100%",
        }}
      >
        <StatCard n={300} suffix="K+" label="Active installs" sub="across all VS Code versions" />
        <StatCard n={4} suffix=".8 ★" label="Marketplace rating" sub="from 1,200+ reviews" />
        <StatCard n={8} suffix=" yrs" label="Actively maintained" sub="open source since 2016" />
        <div style={{ flex: 1, padding: "48px 40px" }}>
          <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 54, fontWeight: 300, color: "#fff", lineHeight: 1, marginBottom: 12 }}>Free</div>
          <div style={{ fontSize: 16, color: "#f4f4f4", marginBottom: 6 }}>MIT licensed</div>
          <div style={{ fontSize: 14, fontWeight: 300, color: "#8d8d8d" }}>no subscription required</div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ borderBottom: "1px solid #393939" }}>
        <div
          style={{
            padding: "48px 32px 24px",
            borderBottom: "1px solid #393939",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ fontSize: 36, fontWeight: 300, color: "#fff", letterSpacing: -0.3 }}>
            What GistPad can do
          </h2>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#6f6f6f" }}>
            3 core capabilities
          </span>
        </div>
        {FEATURES.map((f, i) => (
          <FeatureRow key={f.tag} feat={f} reverse={i % 2 === 1} />
        ))}
      </section>

      {/* ── INSTALL ── */}
      <section
        style={{
          background: "#0f62fe",
          padding: "80px 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Get started in 30 seconds
          </p>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 300,
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: 20,
              letterSpacing: -0.3,
            }}
          >
            One install.
            <br />
            Zero configuration.
          </h2>
          <p style={{ fontSize: 16, fontWeight: 300, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
            Search <strong style={{ fontWeight: 500 }}>"GistPad"</strong> in the VS Code Extensions panel, click Install, then sign in with GitHub. That's it.
          </p>
        </div>
        <div>
          <div
            style={{
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "24px 28px",
            }}
          >
            {[
              ["1.", "Open VS Code Extensions", "⌘ + Shift + X"],
              ["2.", 'Search "GistPad"', ""],
              ["3.", "Click Install", ""],
              ["4.", "Sign in with GitHub", ""],
            ].map(([num, step, kbd]) => (
              <div
                key={num}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.4)", minWidth: 20 }}>
                    {num}
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, color: "#fff", fontWeight: 300 }}>
                    {step}
                  </span>
                </div>
                {kbd && (
                  <kbd
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: 11,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      padding: "3px 8px",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    {kbd}
                  </kbd>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid #393939",
          padding: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" fill="#0f62fe" rx="2" />
            <path d="M8 10h16M8 16h10M8 22h16" stroke="#fff" strokeWidth="2.5" strokeLinecap="square" />
            <circle cx="22" cy="22" r="4" fill="#fff" />
          </svg>
          <span style={{ fontSize: 14, color: "#8d8d8d" }}>GistPad</span>
          <span style={{ fontSize: 14, color: "#525252", marginLeft: 8 }}>© {new Date().getFullYear()} · MIT License</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Changelog", "GitHub"].map((l) => (
            <a key={l} href="#" style={{ fontSize: 14, color: "#8d8d8d", textDecoration: "none" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#fff")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#8d8d8d")}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
