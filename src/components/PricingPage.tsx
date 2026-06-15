import React from 'react';
import { Check, X } from 'lucide-react';
import { ActiveView } from '../types';

interface PricingPageProps {
  onNavigate: (view: ActiveView) => void;
  onSelectPlan: (plan: 'free' | 'pro' | 'enterprise') => void;
}

export default function PricingPage({ onNavigate, onSelectPlan }: PricingPageProps) {
  const handleSelectPlan = (plan: 'free' | 'pro' | 'enterprise') => {
    onSelectPlan(plan);
    // If selecting Pro, let's navigate to Payment Confirmation to show the full purchase success loop!
    if (plan === 'pro') {
      onNavigate('payment-confirmation');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div id="pricing-container" className="bg-[#09090b] min-h-screen flex flex-col font-sans text-[#fafafa] relative selection:bg-brand-primary/30 selection:text-white">
      {/* Top Navbar */}
      <header id="pricing-header" className="bg-[#09090b] border-b border-[#27272a] flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
          <div className="flex items-center gap-8">
            <button 
              id="logo-pricing" 
              onClick={() => onNavigate('landing')}
              className="text-xl font-bold tracking-tighter text-white hover:text-brand-primary transition-colors cursor-pointer"
            >
              Escualo
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => onNavigate('landing')} className="text-[#a1a1aa] font-medium text-sm hover:text-white transition-colors cursor-pointer">Features</button>
              <button onClick={() => onNavigate('pricing')} className="text-brand-primary font-bold text-sm border-b-2 border-brand-primary pb-1">Pricing</button>
              <button onClick={() => onNavigate('dashboard')} className="text-[#a1a1aa] font-medium text-sm hover:text-white transition-colors cursor-pointer">Documentation</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('login')} className="text-sm font-medium text-[#a1a1aa] hover:text-white cursor-pointer select-none">Login</button>
            <button onClick={() => onNavigate('login')} className="bg-brand-primary text-[#0a0012] font-semibold text-xs px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">Get Started</button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-16">
        {/* Pitch text */}
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Precision pricing for every scale.</h1>
          <p className="text-[#a1a1aa] text-lg font-light leading-relaxed">
            Simple, transparent plans designed for developers and enterprise teams. Start for free, upgrade when you need more power.
          </p>
        </div>

        {/* Pricing tier layouts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl items-stretch">
          
          {/* Free Tier card */}
          <div className="bg-[#121215] border border-[#27272a] rounded-xl p-8 flex flex-col hover:bg-[#18181b] transition-all duration-300">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Free</h2>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-white tracking-tight">$0</span>
                <span className="text-[#a1a1aa] text-xs font-mono">/mo</span>
              </div>
              <p className="text-[#a1a1aa] text-xs mt-4 lead-relaxed h-10">
                Perfect for exploring the markdown interface and personal logs.
              </p>
            </div>

            <ul className="space-y-4 flex-grow mb-8 text-[#fafafa] text-xs">
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Up to 3 active projects</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Basic directory search</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Community dashboard support</span>
              </li>
              <li className="flex items-center gap-3 text-[#71717a] opacity-50">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center">
                  <X className="w-3.5 h-3.5 text-[#71717a]" />
                </span>
                <span>Unlimited cloud attachments</span>
              </li>
            </ul>

            <button 
              id="free-tier-choose"
              onClick={() => handleSelectPlan('free')}
              className="w-full border border-[#27272a] hover:border-[#a78bfa] text-white hover:bg-[#121215] transition-all py-3 rounded-lg text-xs font-semibold select-none cursor-pointer active:scale-95"
            >
              Start for Free
            </button>
          </div>

          {/* Pro Tier (Popular Highlight option) */}
          <div className="bg-[#121215] border-2 border-brand-primary rounded-xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_15px_30px_rgba(167,139,250,0.15)] bg-gradient-to-b from-[#18181b] via-[#121215] to-[#121215]">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-[#0a0012] text-[9px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">
              Most Popular
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-brand-primary mb-2">Pro</h2>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-white tracking-tight">$8</span>
                <span className="text-[#a1a1aa] text-xs font-mono">/mo</span>
              </div>
              <p className="text-[#a1a1aa] text-xs mt-4 lead-relaxed h-10 font-light">
                For professional developers needing durable workspace sync & unlimited memory.
              </p>
            </div>

            <ul className="space-y-4 flex-grow mb-8 text-[#fafafa] text-xs font-light">
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Unlimited directory projects</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Advanced search & global indexing</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Priority fast email support</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Custom domain routing & publishing</span>
              </li>
            </ul>

            <button 
              id="pro-tier-choose"
              onClick={() => handleSelectPlan('pro')}
              className="w-full bg-brand-primary hover:bg-[#bbf7d0] hover:text-[#001a12] text-[#0a0012] transition-colors py-3 rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(167,139,250,0.3)] cursor-pointer active:scale-95"
            >
              Select Pro Plan
            </button>
          </div>

          {/* Enterprise Tier card */}
          <div className="bg-[#121215] border border-[#27272a] rounded-xl p-8 flex flex-col hover:bg-[#18181b] transition-all duration-300">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-2">Enterprise</h2>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-white tracking-tight">Custom</span>
              </div>
              <p className="text-[#a1a1aa] text-xs mt-4 lead-relaxed h-10 font-light">
                Dedicated resources, strict audit compliance, and multi-user team networks.
              </p>
            </div>

            <ul className="space-y-4 flex-grow mb-8 text-[#fafafa] text-xs">
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Everything in Pro tier level</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Dedicated account engineer lead</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>SSO, SAML & advanced security key chains</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>99.99% Guaranteed uptime SLA</span>
              </li>
            </ul>

            <button 
              id="enterprise-tier-choose"
              onClick={() => handleSelectPlan('enterprise')}
              className="w-full border border-[#27272a] hover:border-brand-primary text-white hover:bg-[#121215] transition-all py-3 rounded-lg text-xs font-semibold cursor-pointer active:scale-95"
            >
              Contact Sales
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#09090b] border-t border-[#27272a] w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 mt-auto">
        <div className="text-sm font-bold text-white tracking-tighter">Escualo</div>
        <div className="flex items-center gap-6 text-xs text-[#a1a1aa]">
          <a href="#" className="hover:text-brand-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Status</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Twitter</a>
          <a href="#" className="hover:text-brand-primary transition-colors">GitHub</a>
        </div>
        <div className="text-xs text-[#71717a]">© 2026 Escualo. Inspired by Obsidian</div>
      </footer>
    </div>
  );
}
