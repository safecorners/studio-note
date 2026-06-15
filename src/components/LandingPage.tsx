import React from 'react';
import { ArrowRight, Terminal, Cloud, Check, Workflow, FileText, Sparkles, Search, Paperclip } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveView } from '../types';

interface LandingPageProps {
  onNavigate: (view: ActiveView) => void;
  onSearchQuery?: (q: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [search, setSearch] = React.useState('');

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      onNavigate('dashboard');
    }
  };

  return (
    <div id="landing-container" className="bg-[#09090b] min-h-screen flex flex-col font-sans text-[#fafafa] relative selection:bg-brand-primary/30 selection:text-white">
      {/* Top Navbar */}
      <nav id="navbar" className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-md border-b border-[#27272a] w-full px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <button 
              id="nav-logo" 
              onClick={() => onNavigate('landing')}
              className="text-xl font-bold tracking-tighter flex items-center gap-2 text-white hover:text-brand-primary transition-colors cursor-pointer"
            >
              <span className="w-5 h-5 rounded bg-brand-primary/20 border border-brand-primary flex items-center justify-center text-xs font-mono text-brand-primary shadow-[0_0_10px_rgba(167,139,250,0.2)]">E</span>
              Escualo
            </button>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors duration-200">Features</a>
              <button 
                id="link-pricing" 
                onClick={() => onNavigate('pricing')} 
                className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                Pricing
              </button>
              <button 
                id="link-docs" 
                onClick={() => onNavigate('dashboard')} 
                className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                Dashboard
              </button>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-8">
            <form onSubmit={submitSearch} className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1aa] group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search documentation... (Press Enter)" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#121215] border border-[#27272a] rounded-lg py-1.5 pl-10 pr-4 text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-mono"
              />
            </form>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-4">
            <button 
              id="login-btn-nav" 
              onClick={() => onNavigate('login')} 
              className="font-medium text-sm text-[#a1a1aa] hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Login
            </button>
            <button 
              id="signup-btn-nav" 
              onClick={() => onNavigate('login')} 
              className="bg-[#a78bfa] hover:bg-[#bbf7d0] hover:text-[#001a12] text-[#0a0012] font-semibold text-xs px-4 py-2 rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(167,139,250,0.15)] hover:shadow-[0_0_20px_rgba(167,139,250,0.3)] cursor-pointer active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 lg:px-8 overflow-hidden flex flex-col items-center">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#18181b] via-[#09090b] to-[#09090b]"></div>
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Release status indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121215] border border-[#27272a] mb-8 text-xs font-mono text-[#a1a1aa]">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
            v2.0 is now live
          </div>

          {/* Core branding title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6">
            Precision in <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-[#c4b5fd] to-white font-black">Darkness</span>
          </h1>

          <p className="text-lg md:text-xl text-[#a1a1aa] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Developer-grade markdown notes. Lightning fast, purely functional, and designed for deep work.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sd mb-16">
            <button 
              id="hero-start" 
              onClick={() => onNavigate('login')}
              className="w-full sm:w-auto bg-brand-primary text-[#0a0012] font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:scale-105 shadow-[0_0_20px_rgba(167,139,250,0.2)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              id="hero-docs" 
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto bg-transparent border border-[#52525b] hover:border-[#a1a1aa] text-white hover:bg-[#121215] font-medium py-3 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-brand-accent" />
              View Notes Workspace
            </button>
          </div>
        </div>

        {/* Dashboard Preview mockup panel */}
        <div className="mt-8 w-full max-w-5xl relative group px-4">
          <div className="absolute -inset-1 bg-gradient-to-b from-brand-primary/10 to-transparent rounded-xl blur opacity-30 group-hover:opacity-40 transition duration-1000"></div>
          <div 
            onClick={() => onNavigate('dashboard')}
            className="cursor-pointer relative bg-[#0c0c0f] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] flex flex-col group hover:border-[#52525b] transition-all duration-300"
          >
            {/* Mac-like header */}
            <div className="h-10 bg-[#121215] border-b border-[#27272a] flex items-center px-4 gap-2 shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#3f3f46]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27272a]"></div>
              <div className="w-3 h-3 rounded-full bg-[#18181b]"></div>
              <div className="ml-4 font-mono text-xs text-[#71717a] truncate max-w-[200px] sm:max-w-none">escualo/notes/architecture.md</div>
              <span className="ml-auto text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded font-mono">Interactive Demo</span>
            </div>

            {/* Simulated Note editor text lines */}
            <div className="flex-grow p-6 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0c0c0f] z-10 pointer-events-none"></div>
              
              <div className="text-brand-primary mb-4"># Core Architecture</div>
              <div className="text-[#a1a1aa] mb-4 font-sans">The system relies on a purely functional data store with immutability guarantees.</div>
              
              <div className="text-brand-accent mb-6 bg-[#09090b] border border-[#27272a] p-4 rounded-lg">
                <span className="text-[#71717a]">// Rust Implementation</span><br/>
                <span className="text-brand-primary">fn</span> <span className="text-white">build_graph</span>(nodes: <span className="text-[#ede9fe]">Vec&lt;Node&gt;</span>) -&gt; <span className="text-brand-primary">Graph</span> &#123;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-brand-primary">let mut</span> g = Graph::new();<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#71717a]">// Initialization logic</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;g<br/>
                &#125;
              </div>

              <div className="text-[#fafafa] font-bold mb-2">## Core Modules</div>
              <ul className="list-disc list-inside text-[#a1a1aa] space-y-1.5 pl-2 font-sans">
                <li>Sync Engine - real-time sockets with local storage fallback</li>
                <li>Markdown Parser - supports GitHub Flavored extensions & LaTeX math</li>
                <li>Knowledge Graph Visualizer - fluid 3D node representation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features bento section */}
      <section id="features" className="py-24 px-6 lg:px-8 border-t border-[#18181b] bg-[#0c0c0f]/60 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header section text */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Uncompromising Functionality</h2>
            <p className="text-base text-[#a1a1aa] max-w-xl font-light">
              Everything you need to map your thoughts, cleanly integrated into a near-black slate canvas.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Block 1: Large Socket Sync */}
            <div className="md:col-span-2 bg-[#121215] border border-[#27272a] rounded-xl p-8 hover:bg-[#18181b] transition-all duration-300 flex flex-col justify-between group">
              <div className="mb-8">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                  <Cloud className="w-5 h-5 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">End-to-End Cloud Sync</h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed font-light">
                  Your notes are instantly available across all devices. Changes propagate in milliseconds over web sockets, ensuring you never lose a fleeting thought.
                </p>
              </div>

              {/* Dynamic abstract animation panel inside bento box */}
              <div className="h-32 rounded-lg bg-[#09090b] border border-[#27272a] overflow-hidden flex items-center justify-center relative">
                <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent"></div>
                
                {/* Micro-node animation indicators */}
                <div className="relative flex justify-around w-full max-w-sm">
                  <div className="flex flex-col items-center gap-1 z-10">
                    <div className="w-8 h-8 rounded-full bg-[#121215] border border-brand-primary flex items-center justify-center shadow-[0_0_10px_rgba(167,139,250,0.3)]">
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-ping"></span>
                    </div>
                    <span className="text-[9px] font-mono text-[#71717a]">Client</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 z-10 pt-2">
                    <div className="w-8 h-8 rounded-full bg-[#121215] border border-brand-accent flex items-center justify-center shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                      <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                    </div>
                    <span className="text-[9px] font-mono text-[#71717a]">Vite Server</span>
                  </div>

                  <div className="flex flex-col items-center gap-1 z-10">
                    <div className="w-8 h-8 rounded-full bg-[#121215] border border-brand-primary flex items-center justify-center shadow-[0_0_10px_rgba(167,139,250,0.3)]">
                      <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                    </div>
                    <span className="text-[9px] font-mono text-[#71717a]">Cloud Client</span>
                  </div>
                </div>

                <div className="absolute w-2 h-2 rounded-full bg-brand-primary/80 blur-[2px] top-[48%] animate-pulse"></div>
              </div>
            </div>

            {/* Bento Block 2: Small Markdown Card */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl p-8 hover:bg-[#18181b] transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5 text-brand-accent" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Native Markdown</h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed font-light">
                  First-class support for Github-flavored markdown tags. Write complex nested code, markdown tables, checklist macros, and math formulas inline.
                </p>
              </div>
              <div className="mt-8 bg-[#09090b] border border-[#27272a] p-3 rounded-lg text-[11px] font-mono text-[#71717a]">
                <span className="text-white">**Bold text**</span> <br/>
                <span className="text-brand-accent">`const app = express();`</span><br/>
                <span className="text-[#a1a1aa] italic">- [x] Finalize architectural spec</span>
              </div>
            </div>

            {/* Bento Block 3: Small File Drag & Drop Trigger card */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl p-8 hover:bg-[#18181b] transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                  <Paperclip className="w-5 h-5 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">File Attachments</h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed font-light">
                  Drag and drop code files, images, PDFs, and metadata parameters directly into notes. Rendered neatly inline with customizable labels.
                </p>
              </div>

              <div className="mt-8 border border-dashed border-[#27272a] hover:border-brand-primary rounded-lg py-4 px-2 text-center text-xs text-[#71717a] bg-[#09090b] transition-colors">
                <span className="text-brand-primary block mb-1 font-semibold">Drop dynamic code file</span>
                or click to browse
              </div>
            </div>

            {/* Bento Block 4: Large Knowledge Graph visual block */}
            <div className="md:col-span-2 bg-[#121215] border border-[#27272a] rounded-xl p-8 hover:bg-[#18181b] transition-all duration-300 flex flex-col md:flex-row items-center gap-8 group">
              <div className="flex-1">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                  <Workflow className="w-5 h-5 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Knowledge Graph Linkages</h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed font-light">
                  Visualize connections between distinct files. Understand your custom notes catalog at a macro scale with fluid force-directed linkage lines.
                </p>
              </div>

              {/* abstract node net visual layout */}
              <div className="flex-1 w-full h-44 rounded-lg bg-[#09090b] border border-[#27272a] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#121215,_transparent)] opacity-40"></div>
                
                {/* Node graph markup dots & thin lines */}
                <div className="relative w-full h-full">
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(167,139,250,0.6)] animate-pulse z-10"></div>
                  
                  {/* Leaf Nodes */}
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-brand-accent rounded-full shadow-[0_0_10px_rgba(52,211,153,0.4)]"></div>
                  <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-brand-accent rounded-full"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white rounded-full"></div>
                  <div className="absolute top-1/3 right-1/3 w-2.5 h-2.5 bg-brand-primary rounded-full"></div>

                  {/* HTML/CSS-based line connectors */}
                  <svg className="w-full h-full absolute inset-0 pointer-events-none stroke-[#27272a] stroke-1">
                    <line x1="50%" y1="50%" x2="25%" y2="25%" className="stroke-brand-primary" />
                    <line x1="50%" y1="50%" x2="75%" y2="66%" />
                    <line x1="50%" y1="50%" x2="33%" y2="75%" />
                    <line x1="50%" y1="50%" x2="66%" y2="33%" className="stroke-brand-accent" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Area */}
      <footer className="bg-[#09090b] border-t border-[#18181b] mt-auto">
        <div className="w-full max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-brand-primary/20 border border-brand-primary flex items-center justify-center text-[10px] text-brand-primary">E</span>
              Escualo Cloud
            </span>
            <span className="text-xs text-[#71717a]">© 2026 Escualo. Inspired by Obsidian. Crafted with precision.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-[#71717a]">
            <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Workspace Status</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-brand-primary transition-colors">GitHub Repository</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
