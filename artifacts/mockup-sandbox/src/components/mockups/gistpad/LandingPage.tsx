import { useState, useEffect } from "react";

const CODE_SNIPPET = `// GistPad: Edit gists directly in VS Code
import { GistPad } from 'gistpad';

const gist = await GistPad.openGist('abc123');
gist.files['notes.md'].content = \`
# Meeting Notes - June 2026
- Shipped new feature 🚀
- Reviewed PRs
- Planned next sprint
\`;
await gist.save();
console.log('Gist updated successfully!');`;

const TYPED_LINES = CODE_SNIPPET.split("\n");

function TypedCode() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (visibleLines < TYPED_LINES.length) {
      const currentLine = TYPED_LINES[visibleLines];
      if (charCount < currentLine.length) {
        const t = setTimeout(() => setCharCount(c => c + 1), 18);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => {
          setVisibleLines(l => l + 1);
          setCharCount(0);
        }, 60);
        return () => clearTimeout(t);
      }
    }
  }, [visibleLines, charCount]);

  return (
    <div className="font-mono text-sm leading-6 text-left overflow-hidden">
      {TYPED_LINES.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="whitespace-pre">
          <span className="text-slate-500 select-none mr-4 text-xs">{String(i + 1).padStart(2, ' ')}</span>
          <CodeLine line={line} />
        </div>
      ))}
      {visibleLines < TYPED_LINES.length && (
        <div className="whitespace-pre">
          <span className="text-slate-500 select-none mr-4 text-xs">{String(visibleLines + 1).padStart(2, ' ')}</span>
          <CodeLine line={TYPED_LINES[visibleLines].slice(0, charCount)} />
          <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-0.5 align-middle" />
        </div>
      )}
    </div>
  );
}

function CodeLine({ line }: { line: string }) {
  if (!line.trim()) return <span>&nbsp;</span>;
  if (line.startsWith("//")) return <span className="text-slate-500 italic">{line}</span>;
  if (line.startsWith("import")) {
    return <span>
      <span className="text-purple-400">import</span>
      <span className="text-slate-300">{line.slice(6, line.indexOf('{') + 0)}</span>
      <span className="text-yellow-300">{line.slice(line.indexOf('{'), line.indexOf('}') + 1)}</span>
      <span className="text-slate-300">{line.slice(line.indexOf('}') + 1)}</span>
    </span>;
  }
  return <span className="text-slate-300">{line}</span>;
}

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "Gist Management",
    desc: "Create, edit, fork, and star GitHub Gists without leaving your editor. Full CRUD support with real-time sync.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
      </svg>
    ),
    title: "Repository Editing",
    desc: "Browse and edit any GitHub repository as a virtual filesystem. Stage, commit, and push changes — all from VS Code.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: "Scratch Notes",
    desc: "Capture ideas instantly with scratch notes — temporary gists that live in your sidebar, ready to promote to permanent.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "Playground Support",
    desc: "Run interactive code playgrounds inside gists. HTML, CSS, JS, and React — preview them live without any setup.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "Team Collaboration",
    desc: "Follow other GitHub users to see their public gists. Star, fork, and comment — the social layer of code sharing.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Wiki & Docs",
    desc: "Turn your gists into a personal wiki with rich Markdown preview, syntax highlighting, and wikilink navigation.",
  },
];

const steps = [
  { num: "01", title: "Install the extension", desc: "Search for 'GistPad' in the VS Code Extensions marketplace and click Install." },
  { num: "02", title: "Sign in with GitHub", desc: "Authenticate once with your GitHub account. GistPad uses your existing gists and repositories." },
  { num: "03", title: "Open the GistPad panel", desc: "Click the GistPad icon in the Activity Bar. Your gists appear instantly, ready to open and edit." },
];

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"gists" | "repos" | "playgrounds">("gists");

  return (
    <div className="min-h-screen bg-[#0d1117] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 13.5v-7l6 3.5-6 3.5z" />
              </svg>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">GistPad</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="https://github.com" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <a
            href="#"
            className="text-sm font-medium bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-1.5 rounded-lg"
          >
            Install Free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            VS Code Extension · 300k+ installs
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            Your GitHub Gists,{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              inside VS Code
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Create, edit, and manage GitHub Gists and repositories directly from your editor.
            Never leave VS Code to share code snippets, take notes, or explore open source repos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#"
              className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 transition-all px-6 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z" />
              </svg>
              Install in VS Code
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 transition-all px-6 py-3 rounded-xl font-semibold text-sm text-slate-300"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
              View on GitHub
            </a>
          </div>

          {/* Code editor mockup */}
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-[#161b22]">
            {/* Editor title bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#21262d] border-b border-white/5">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div
                  className={`px-3 py-1 rounded text-xs cursor-pointer transition-colors ${activeTab === "gists" ? "bg-[#0d1117] text-white" : "text-slate-500 hover:text-slate-300"}`}
                  onClick={() => setActiveTab("gists")}
                >
                  gistpad.ts
                </div>
                <div
                  className={`px-3 py-1 rounded text-xs cursor-pointer transition-colors ${activeTab === "repos" ? "bg-[#0d1117] text-white" : "text-slate-500 hover:text-slate-300"}`}
                  onClick={() => setActiveTab("repos")}
                >
                  notes.md
                </div>
                <div
                  className={`px-3 py-1 rounded text-xs cursor-pointer transition-colors ${activeTab === "playgrounds" ? "bg-[#0d1117] text-white" : "text-slate-500 hover:text-slate-300"}`}
                  onClick={() => setActiveTab("playgrounds")}
                >
                  playground.html
                </div>
              </div>
            </div>
            {/* Code content */}
            <div className="p-6 text-left bg-[#0d1117] min-h-[200px]">
              <TypedCode />
            </div>
            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-blue-600 text-xs text-blue-100">
              <span className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" /></svg>
                  GistPad
                </span>
                <span className="opacity-70">·</span>
                <span className="opacity-70">octocat's gists</span>
              </span>
              <span className="opacity-70">TypeScript · UTF-8</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "300K+", label: "Active installs" },
            { value: "4.8★", label: "VS Code rating" },
            { value: "2016", label: "Trusted since" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-slate-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Everything you need, nothing you don't
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              GistPad brings the full GitHub Gist experience into your editor, with extras that make it indispensable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#0d1117] p-8 hover:bg-[#161b22] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-5 group-hover:bg-blue-500/15 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0a0e13]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Up and running in 60 seconds
            </h2>
            <p className="text-slate-400 text-lg">No configuration. No accounts to create. Just install and go.</p>
          </div>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-8 items-start group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/20 shrink-0">
                    {step.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-16 bg-gradient-to-b from-blue-600/30 to-transparent mt-2" />
                  )}
                </div>
                <div className="pb-12">
                  <h3 className="font-semibold text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-600/30">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 13.5v-7l6 3.5-6 3.5z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Start editing gists today
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
            Free, open source, and actively maintained. Join thousands of developers who've made GistPad part of their daily workflow.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#"
              className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 transition-all px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-600/30"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z" />
              </svg>
              Install in VS Code
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1.5"
            >
              Read the docs
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 13.5v-7l6 3.5-6 3.5z" />
              </svg>
            </div>
            <span className="text-sm text-slate-500">GistPad · Open source VS Code extension</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">MIT License</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Changelog</a>
            <a href="#" className="hover:text-slate-300 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
