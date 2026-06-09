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
  const [menuOpen, setMenuOpen] = useState(false);
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
        background: "#000",
        borderBottom: "1px solid #393939",
        height: 48,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="gp-nav-inner">
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

        {/* Desktop links */}
        <div className="gp-nav-links">
          {["Features", "Docs", "Changelog", "GitHub"].map((item) => (
            <a key={item} href="#" className="gp-nav-link">
              {item}
            </a>
          ))}
          <a href="#" className="gp-nav-btn">
            Install extension →
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="gp-nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 1, marginBottom: 4, transition: "0.2s", transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
          <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 1, marginBottom: 4, transition: "0.2s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 1, transition: "0.2s", transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="gp-nav-mobile">
          {["Features", "Docs", "Changelog", "GitHub"].map((item) => (
            <a key={item} href="#" className="gp-nav-mobile-link" onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
          <a href="#" className="gp-nav-mobile-btn" onClick={() => setMenuOpen(false)}>
            Install extension →
          </a>
        </div>
      )}
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
  const full = SNIPPET.map((s) => s.t).join("");
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (charIdx >= full.length) return;
    const t = setTimeout(() => setCharIdx((c) => c + 1), 22);
    return () => clearTimeout(t);
  }, [charIdx, full.length]);

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
    <div className="gp-code">
      <div className="gp-code-bar">
        <span className="gp-code-filename">gistpad.ts</span>
        <span className="gp-code-lang">TypeScript</span>
      </div>
      <div className="gp-code-body">
        {spans}
        {charIdx < full.length && (
          <span className="gp-code-cursor" />
        )}
      </div>
    </div>
  );
}

/* ─── Feature row ────────────────────────────────────────────────── */
type Feat = { tag: string; title: string; body: string; accent: string };
function FeatureRow({ feat }: { feat: Feat }) {
  return (
    <div className="gp-feat-row">
      {/* Text */}
      <div className="gp-feat-text">
        <span className="gp-feat-tag" style={{ color: feat.accent }}>
          {feat.tag}
        </span>
        <h3 className="gp-feat-title">{feat.title}</h3>
        <p className="gp-feat-body">{feat.body}</p>
        <a href="#" className="gp-feat-link" style={{ color: feat.accent }}>
          Learn more <span style={{ fontSize: 16 }}>→</span>
        </a>
      </div>

      {/* Visual */}
      <div className="gp-feat-visual">
        <FeatureIllustration tag={feat.tag} accent={feat.accent} />
      </div>
    </div>
  );
}

function FeatureIllustration({ tag, accent }: { tag: string; accent: string }) {
  if (tag.includes("GIST")) {
    return (
      <div className="gp-feat-ill">
        {["meeting-notes.md", "config.json", "deploy.sh", "snippets.ts"].map((f, i) => (
          <div
            key={f}
            className="gp-feat-file"
            style={{ border: `1px solid ${i === 0 ? accent : "#393939"}`, color: i === 0 ? "#fff" : "#8d8d8d" }}
          >
            <span style={{ color: accent, fontSize: 16, lineHeight: 1 }}>
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
      <div className="gp-feat-ill">
        <div className="gp-feat-playground">
          <div className="gp-feat-playground-tabs">
            {["HTML", "CSS", "JS"].map((t, i) => (
              <span key={t} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: i === 2 ? accent : "#6f6f6f", padding: "2px 8px", background: i === 2 ? "#333" : "transparent" }}>{t}</span>
            ))}
          </div>
          <div className="gp-feat-playground-code">
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
          <div className="gp-feat-playground-preview" style={{ borderColor: accent }}>
            <button style={{ background: accent, color: "#fff", border: "none", padding: "8px 16px", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, cursor: "pointer" }}>Hello!</button>
          </div>
        </div>
      </div>
    );
  }
  // WIKI
  return (
    <div className="gp-feat-ill">
      <div className="gp-feat-wiki">
        <div style={{ color: accent, fontWeight: 600, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}>## Meeting Notes</div>
        <div className="gp-feat-wiki-list">
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
    <div className="gp-stat">
      <div className="gp-stat-num">
        <Counter target={n} suffix={suffix} />
      </div>
      <div className="gp-stat-label">{label}</div>
      <div className="gp-stat-sub">{sub}</div>
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
      <style>{GP_CSS}</style>
      <Nav />

      {/* ── HERO ── */}
      <section className="gp-hero">
        {/* Left */}
        <div className="gp-hero-text">
          <p className="gp-hero-tag">
            VS Code Extension
          </p>
          <h1 className="gp-hero-title">
            GitHub Gists,
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 300 }}>inside</em>
            <br />
            your editor.
          </h1>
          <p className="gp-hero-desc">
            GistPad brings GitHub Gist management, interactive code playgrounds, and a personal wiki into VS Code — without a single browser tab.
          </p>
          <div className="gp-hero-cta">
            <a href="#" className="gp-hero-btn-primary">
              Install from Marketplace →
            </a>
            <a href="#" className="gp-hero-btn-secondary">
              View on GitHub
            </a>
          </div>
        </div>

        {/* Right — code */}
        <div className="gp-hero-code">
          <CodeBlock />
          <div className="gp-hero-sync">
            <span className="gp-hero-sync-dot" />
            <span className="gp-hero-sync-text">Gist synced · octocat · 2s ago</span>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="gp-stats">
        <StatCard n={300} suffix="K+" label="Active installs" sub="across all VS Code versions" />
        <StatCard n={4} suffix=".8 ★" label="Marketplace rating" sub="from 1,200+ reviews" />
        <StatCard n={8} suffix=" yrs" label="Actively maintained" sub="open source since 2016" />
        <div className="gp-stat gp-stat-free">
          <div className="gp-stat-num">Free</div>
          <div className="gp-stat-label">MIT licensed</div>
          <div className="gp-stat-sub">no subscription required</div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="gp-features">
        <div className="gp-features-header">
          <h2 className="gp-features-title">
            What GistPad can do
          </h2>
          <span className="gp-features-count">3 core capabilities</span>
        </div>
        {FEATURES.map((f, i) => (
          <FeatureRow key={f.tag} feat={f} />
        ))}
      </section>

      {/* ── INSTALL ── */}
      <section className="gp-install">
        <div className="gp-install-text">
          <p className="gp-install-tag">
            Get started in 30 seconds
          </p>
          <h2 className="gp-install-title">
            One install.
            <br />
            Zero configuration.
          </h2>
          <p className="gp-install-desc">
            Search <strong style={{ fontWeight: 500 }}>"GistPad"</strong> in the VS Code Extensions panel, click Install, then sign in with GitHub. That's it.
          </p>
        </div>
        <div className="gp-install-steps">
          <div className="gp-install-steps-box">
            {[
              ["1.", "Open VS Code Extensions", "⌘ + Shift + X"],
              ["2.", 'Search "GistPad"', ""],
              ["3.", "Click Install", ""],
              ["4.", "Sign in with GitHub", ""],
            ].map(([num, step, kbd]) => (
              <div key={num} className="gp-install-step">
                <div className="gp-install-step-left">
                  <span className="gp-install-step-num">{num}</span>
                  <span className="gp-install-step-name">{step}</span>
                </div>
                {kbd && (
                  <kbd className="gp-install-step-kbd">{kbd}</kbd>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="gp-footer">
        <div className="gp-footer-left">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" fill="#0f62fe" rx="2" />
            <path d="M8 10h16M8 16h10M8 22h16" stroke="#fff" strokeWidth="2.5" strokeLinecap="square" />
            <circle cx="22" cy="22" r="4" fill="#fff" />
          </svg>
          <span className="gp-footer-name">GistPad</span>
          <span className="gp-footer-copy">© {new Date().getFullYear()} · MIT License</span>
        </div>
        <div className="gp-footer-links">
          {["Privacy", "Terms", "Changelog", "GitHub"].map((l) => (
            <a key={l} href="#" className="gp-footer-link">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

/* ─── CSS ──────────────────────────────────────────────────────────── */
const GP_CSS = `
/* ====== BASE ====== */
.gp-nav-inner {
  max-width: 1584px;
  width: 100%;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.gp-nav-link {
  color: #c6c6c6;
  font-size: 14px;
  text-decoration: none;
  padding: 0 16px;
  height: 100%;
  display: flex;
  align-items: center;
  border-left: 1px solid #393939;
  transition: background .15s, color .15s;
  font-family: 'IBM Plex Sans', sans-serif;
}
.gp-nav-link:hover {
  background: #353535;
  color: #fff;
}

.gp-nav-btn {
  background: #0f62fe;
  color: #fff;
  font-size: 14px;
  text-decoration: none;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  border-left: 1px solid #0f62fe;
  white-space: nowrap;
  transition: background .15s;
  font-family: 'IBM Plex Sans', sans-serif;
}
.gp-nav-btn:hover {
  background: #0353e9;
}

.gp-nav-hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.gp-nav-mobile {
  display: none;
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  background: #161616;
  border-bottom: 1px solid #393939;
  flex-direction: column;
  padding: 16px;
  gap: 4px;
  z-index: 99;
}

.gp-nav-mobile-link {
  color: #c6c6c6;
  font-size: 16px;
  text-decoration: none;
  padding: 12px 16px;
  border-bottom: 1px solid #393939;
  font-family: 'IBM Plex Sans', sans-serif;
  transition: color .15s;
}
.gp-nav-mobile-link:hover {
  color: #fff;
}

.gp-nav-mobile-btn {
  background: #0f62fe;
  color: #fff;
  font-size: 16px;
  text-decoration: none;
  padding: 14px 16px;
  margin-top: 8px;
  text-align: center;
  font-family: 'IBM Plex Sans', sans-serif;
}

/* ====== HERO ====== */
.gp-hero {
  max-width: 1584px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: calc(100vh - 48px);
  align-items: center;
  border-bottom: 1px solid #393939;
  gap: 0;
}

.gp-hero-text {
  padding-right: 80px;
  border-right: 1px solid #393939;
  padding-block: 80px;
}

.gp-hero-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: #0f62fe;
  letter-spacing: 2;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.gp-hero-title {
  font-size: 60px;
  font-weight: 300;
  line-height: 1.1;
  color: #fff;
  margin-bottom: 28px;
  letter-spacing: -0.5px;
  font-family: 'IBM Plex Sans', sans-serif;
}

.gp-hero-desc {
  font-size: 18px;
  font-weight: 300;
  color: #c6c6c6;
  line-height: 1.6;
  max-width: 440px;
  margin-bottom: 48px;
  font-family: 'IBM Plex Sans', sans-serif;
}

.gp-hero-cta {
  display: flex;
  gap: 0;
  align-items: center;
  flex-wrap: wrap;
}

.gp-hero-btn-primary {
  background: #0f62fe;
  color: #fff;
  font-size: 16px;
  text-decoration: none;
  padding: 16px 32px;
  display: inline-block;
  font-weight: 400;
  letter-spacing: 0.1px;
  transition: background .15s;
  font-family: 'IBM Plex Sans', sans-serif;
  white-space: nowrap;
}
.gp-hero-btn-primary:hover {
  background: #0353e9;
}

.gp-hero-btn-secondary {
  border: 1px solid #393939;
  color: #c6c6c6;
  font-size: 16px;
  text-decoration: none;
  padding: 16px 32px;
  display: inline-block;
  transition: border-color .15s, color .15s;
  margin-left: -1px;
  font-family: 'IBM Plex Sans', sans-serif;
  white-space: nowrap;
}
.gp-hero-btn-secondary:hover {
  border-color: #c6c6c6;
  color: #fff;
}

.gp-hero-code {
  padding-left: 64px;
  padding-block: 80px;
}

.gp-hero-sync {
  margin-top: 20px;
  padding: 14px 20px;
  background: #161616;
  border: 1px solid #393939;
  border-top: none;
  display: flex;
  align-items: center;
  gap: 12px;
}

.gp-hero-sync-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #42be65;
  display: inline-block;
  flex-shrink: 0;
}

.gp-hero-sync-text {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  color: #8d8d8d;
}

/* ====== CODE ====== */
.gp-code {
  background: #161616;
  border: 1px solid #393939;
  padding: 24px 28px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
  line-height: 22px;
  position: relative;
  min-height: 200px;
}

.gp-code-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: #262626;
  border-bottom: 1px solid #393939;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gp-code-filename {
  color: #c6c6c6;
  font-size: 12px;
}

.gp-code-lang {
  color: #6f6f6f;
  font-size: 11px;
}

.gp-code-body {
  margin-top: 28px;
}

.gp-code-cursor {
  display: inline-block;
  width: 2px;
  height: 14px;
  background: #0f62fe;
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* ====== STATS ====== */
.gp-stats {
  display: flex;
  border-bottom: 1px solid #393939;
  max-width: 100%;
}

.gp-stat {
  border-right: 1px solid #393939;
  padding: 48px 40px;
  flex: 1;
}

.gp-stat-num {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 54px;
  font-weight: 300;
  color: #fff;
  line-height: 1;
  margin-bottom: 12px;
}

.gp-stat-label {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 16px;
  color: #f4f4f4;
  margin-bottom: 6px;
}

.gp-stat-sub {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 14px;
  font-weight: 300;
  color: #8d8d8d;
}

/* ====== FEATURES ====== */
.gp-features {
  border-bottom: 1px solid #393939;
}

.gp-features-header {
  padding: 48px 32px 24px;
  border-bottom: 1px solid #393939;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.gp-features-title {
  font-size: 36px;
  font-weight: 300;
  color: #fff;
  letter-spacing: -0.3px;
  font-family: 'IBM Plex Sans', sans-serif;
  margin: 0;
}

.gp-features-count {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  color: #6f6f6f;
}

.gp-feat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid #393939;
}
.gp-feat-row:nth-child(odd) .gp-feat-text {
  order: 1;
  border-right: 1px solid #393939;
}
.gp-feat-row:nth-child(odd) .gp-feat-visual {
  order: 2;
}
.gp-feat-row:nth-child(even) .gp-feat-text {
  order: 2;
  border-left: 1px solid #393939;
  border-right: none;
}
.gp-feat-row:nth-child(even) .gp-feat-visual {
  order: 1;
}

.gp-feat-text {
  padding: 80px 64px;
  font-family: 'IBM Plex Sans', sans-serif;
  border-right: 1px solid #393939;
}

.gp-feat-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 20px;
}

.gp-feat-title {
  font-size: 28px;
  font-weight: 300;
  color: #f4f4f4;
  line-height: 1.25;
  margin-bottom: 20px;
  max-width: 360px;
  font-family: 'IBM Plex Sans', sans-serif;
  margin-top: 0;
}

.gp-feat-body {
  font-size: 16px;
  font-weight: 300;
  color: #c6c6c6;
  line-height: 1.6;
  max-width: 380px;
  margin-bottom: 32px;
  font-family: 'IBM Plex Sans', sans-serif;
  margin-top: 0;
}

.gp-feat-link {
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'IBM Plex Sans', sans-serif;
}

.gp-feat-visual {
  background: #161616;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  min-height: 360px;
}

.gp-feat-ill {
  width: 100%;
  max-width: 340px;
}

.gp-feat-file {
  background: #262626;
  padding: 12px 16px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
}

.gp-feat-playground {
  background: #1a1a1a;
  border: 1px solid #393939;
  overflow: hidden;
}

.gp-feat-playground-tabs {
  background: #262626;
  padding: 8px 12px;
  border-bottom: 1px solid #393939;
  display: flex;
  gap: 8px;
}

.gp-feat-playground-code {
  padding: 16px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  line-height: 1.8;
}

.gp-feat-playground-preview {
  margin: 16px;
  margin-top: 0;
  background: #000;
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid;
}

.gp-feat-wiki {
  background: #262626;
  border: 1px solid #393939;
  padding: 20px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 13px;
}

.gp-feat-wiki-list {
  color: #c6c6c6;
  line-height: 1.9;
}

/* ====== INSTALL ====== */
.gp-install {
  background: #0f62fe;
  padding: 80px 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.gp-install-tag {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.gp-install-title {
  font-size: 40px;
  font-weight: 300;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 20px;
  letter-spacing: -0.3px;
  font-family: 'IBM Plex Sans', sans-serif;
  margin-top: 0;
}

.gp-install-desc {
  font-size: 16px;
  font-weight: 300;
  color: rgba(255,255,255,0.75);
  line-height: 1.6;
  font-family: 'IBM Plex Sans', sans-serif;
}

.gp-install-steps-box {
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 24px 28px;
}

.gp-install-step {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.gp-install-step-left {
  display: flex;
  gap: 16px;
  align-items: center;
}

.gp-install-step-num {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  min-width: 20px;
}

.gp-install-step-name {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 15px;
  color: #fff;
  font-weight: 300;
}

.gp-install-step-kbd {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 3px 8px;
  color: rgba(255,255,255,0.6);
}

/* ====== FOOTER ====== */
.gp-footer {
  border-top: 1px solid #393939;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'IBM Plex Sans', sans-serif;
}

.gp-footer-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gp-footer-name {
  font-size: 14px;
  color: #8d8d8d;
}

.gp-footer-copy {
  font-size: 14px;
  color: #525252;
  margin-left: 8px;
}

.gp-footer-links {
  display: flex;
  gap: 24px;
}

.gp-footer-link {
  font-size: 14px;
  color: #8d8d8d;
  text-decoration: none;
  transition: color .15s;
  font-family: 'IBM Plex Sans', sans-serif;
}
.gp-footer-link:hover {
  color: #fff;
}

/* ══════════════════════════════════════════════════════════════════════════════════════ */
@media (max-width: 767px) {
  .gp-nav-links {
    display: none !important;
  }
  .gp-nav-hamburger {
    display: block !important;
  }
  .gp-nav-mobile {
    display: flex !important;
  }

  .gp-hero {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .gp-hero-text {
    padding: 40px 16px;
    border-right: none;
    padding-block: 48px;
  }
  .gp-hero-title {
    font-size: 36px;
  }
  .gp-hero-desc {
    font-size: 16px;
    max-width: none;
  }
  .gp-hero-cta {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .gp-hero-btn-primary,
  .gp-hero-btn-secondary {
    margin-left: 0;
    text-align: center;
  }
  .gp-hero-code {
    padding: 0 16px 40px;
    border-top: 1px solid #393939;
  }

  .gp-stats {
    flex-direction: column;
  }
  .gp-stat {
    border-right: none;
    border-bottom: 1px solid #393939;
    padding: 32px 24px;
  }
  .gp-stat-num {
    font-size: 40px;
  }
  .gp-stat:last-child {
    border-bottom: none;
  }

  .gp-features-header {
    padding: 32px 24px 20px;
    flex-direction: column;
    gap: 8px;
  }
  .gp-features-title {
    font-size: 28px;
  }

  .gp-feat-row {
    grid-template-columns: 1fr;
  }
  .gp-feat-row:nth-child(odd) .gp-feat-text,
  .gp-feat-row:nth-child(even) .gp-feat-text {
    order: 1;
    border-left: none;
    border-right: none;
    border-bottom: 1px solid #393939;
    padding: 48px 24px;
  }
  .gp-feat-row:nth-child(odd) .gp-feat-visual,
  .gp-feat-row:nth-child(even) .gp-feat-visual {
    order: 2;
    padding: 32px 24px;
    min-height: auto;
  }
  .gp-feat-title {
    font-size: 24px;
    max-width: none;
  }
  .gp-feat-body {
    max-width: none;
  }

  .gp-install {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 48px 24px;
  }
  .gp-install-title {
    font-size: 28px;
  }

  .gp-footer {
    flex-direction: column;
    gap: 16px;
    padding: 24px;
  }
  .gp-footer-links {
    gap: 16px;
    flex-wrap: wrap;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .gp-hero {
    grid-template-columns: 1fr;
  }
  .gp-hero-text {
    border-right: none;
    padding: 48px 32px;
    padding-block: 56px;
  }
  .gp-hero-code {
    padding: 0 32px 56px;
  }
  .gp-feat-row {
    grid-template-columns: 1fr;
  }
  .gp-feat-row:nth-child(odd) .gp-feat-text,
  .gp-feat-row:nth-child(even) .gp-feat-text {
    border-left: none;
    border-right: none;
    border-bottom: 1px solid #393939;
  }
  .gp-feat-row:nth-child(odd) .gp-feat-visual,
  .gp-feat-row:nth-child(even) .gp-feat-visual {
    order: 2;
  }
  .gp-install {
    grid-template-columns: 1fr;
  }
}
`;
