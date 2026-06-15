import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Chrome, Github } from 'lucide-react';
import { ActiveView, UserState } from '../types';

interface LoginPageProps {
  onNavigate: (view: ActiveView) => void;
  onLoginSuccess: (user: UserState) => void;
}

export default function LoginPage({ onNavigate, onLoginSuccess }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in all security fields.');
      return;
    }
    if (activeTab === 'signup' && !fullName) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    // Success login mock representing real authentication
    const user: UserState = {
      isAuthenticated: true,
      email: email,
      fullName: activeTab === 'signup' ? fullName : (email.split('@')[0] || 'Developer'),
      plan: 'pro' // Default Pro setup for high workspace support
    };
    
    onLoginSuccess(user);
    onNavigate('dashboard');
  };

  const handleSocialClick = (platform: string) => {
    const user: UserState = {
      isAuthenticated: true,
      email: `social.${platform.toLowerCase()}@escualo.dev`,
      fullName: `${platform} Engineer`,
      plan: 'pro'
    };
    onLoginSuccess(user);
    onNavigate('dashboard');
  };

  return (
    <div id="login-container" className="bg-[#09090b] text-[#fafafa] font-sans antialiased min-h-screen flex selection:bg-brand-primary/30 selection:text-white">
      
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f0f12] border-r border-[#27272a] flex-col justify-between overflow-hidden">
        {/* Abstract Background Artwork */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFjsSoGEWnFiLWCtCD8QKdF1AgJJaEQufX50HylQw44oeFyFEnJQeI7NG5AqNk6umc1t22SDmOSgKV9JWQvR7l9k0GMzkG1H9eca02Dtn__yB5UOpykLQTgcA5NU3E87Ph6k9Olt3gAjPFq5PqmS0eeyZygBH0nMFZiurDa5DUeq-VwAHY0NkJh9Edb0jAFuzaR3QTbyi8fOGCZYDK824z7uKfz4NYkU-ElGlGo3AlTSgAUc_KBuNiJSb1RAh5w4UKMumWeHagmkAs" 
            alt="Escualo background" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-50 mix-blend-screen"
          />
          {/* Subtle gradient gradient block to ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent"></div>
        </div>

        {/* Brand Header */}
        <div className="relative z-10 p-12">
          <button 
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-brand-primary font-bold text-2xl tracking-tighter hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span className="w-6 h-6 rounded bg-brand-primary/20 border border-brand-primary flex items-center justify-center text-xs text-brand-primary shadow-[0_0_10px_rgba(167,139,250,0.3)]">E</span>
            Escualo
          </button>
        </div>

        {/* Bottom Quote block */}
        <div className="relative z-10 p-12">
          <blockquote className="space-y-6">
            <p className="text-3xl font-medium tracking-tight text-[#fafafa] leading-tight font-sans">
              "Precision in Darkness. Building the tools that power the next generation of infrastructure."
            </p>
            <footer className="text-sm text-[#a1a1aa] font-medium flex items-center gap-3">
              <div className="w-8 h-px bg-[#52525b]"></div>
              System Architecture & Log Engine
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative">
        <div className="w-full max-w-[400px] space-y-8">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex lg:hidden justify-center mb-8">
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-brand-primary font-bold text-2xl tracking-tighter hover:opacity-90"
            >
              <span className="w-6 h-6 rounded bg-brand-primary/20 border border-brand-primary flex items-center justify-center text-xs text-brand-primary">E</span>
              Escualo
            </button>
          </div>

          {/* Title Header text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-white font-sans" id="form-title">
              {activeTab === 'login' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm text-[#a1a1aa]" id="form-subtitle">
              {activeTab === 'login' 
                ? 'Enter your credentials to access your note archives.' 
                : 'Get started with Escualo note clusters today.'}
            </p>
          </div>

          {/* Segmented control navigation tab switcher */}
          <div id="auth-segmented-tab" className="flex p-1 bg-[#121215] rounded-lg border border-[#27272a]">
            <button 
              type="button"
              className={`w-1/2 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'login' 
                  ? 'bg-[#1ebd1e]/0 bg-[#27272a] text-white shadow-sm' 
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
              onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
            >
              Log In
            </button>
            <button 
              type="button"
              className={`w-1/2 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'signup' 
                  ? 'bg-[#27272a] text-white shadow-sm' 
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
              onClick={() => { setActiveTab('signup'); setErrorMessage(''); }}
            >
              Sign Up
            </button>
          </div>

          {/* Form error warning */}
          {errorMessage && (
            <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg text-center">
              {errorMessage}
            </div>
          )}

          {/* Interactive submit form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name input block (Sign Up only) */}
            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#a1a1aa]" htmlFor="fullname">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717a]">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    id="fullname" 
                    type="text" 
                    placeholder="Jane Doe" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#27272a] focus:border-brand-primary placeholder-[#52525b] bg-[#0c0c0f] rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all font-sans"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#a1a1aa]" htmlFor="email">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717a]">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  id="email" 
                  type="email" 
                  autoComplete="email"
                  placeholder="developer@obsidian.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#27272a] focus:border-brand-primary placeholder-[#52525b] bg-[#0c0c0f] rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all font-sans"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#a1a1aa]" htmlFor="password">Password</label>
                {activeTab === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => { setErrorMessage('Password reset token generated and simulated on local systems.'); }}
                    className="text-[11px] text-brand-primary hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#71717a]">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  id="password" 
                  type="password" 
                  autoComplete="current-password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-[#27272a] focus:border-brand-primary placeholder-[#52525b] bg-[#0c0c0f] rounded-md text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all font-sans"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button 
              type="submit" 
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-[#0a0012] bg-[#a78bfa] hover:bg-[#bbf7d0] transition-colors cursor-pointer active:scale-95"
            >
              {activeTab === 'login' ? 'Sign in' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social connections separator */}
          <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#27272a]"></div>
            </div>
            <div className="relative flex justify-center text-xs select-none">
              <span className="px-3 bg-[#09090b] text-[#71717a]">Or continue with</span>
            </div>
          </div>

          {/* Social grids */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button 
              type="button"
              onClick={() => handleSocialClick('GitHub')}
              className="w-full inline-flex justify-center items-center py-2 px-4 border border-[#27272a] rounded-md bg-[#121215] hover:bg-[#18181b] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </button>
            <button 
              type="button"
              onClick={() => handleSocialClick('Google')}
              className="w-full inline-flex justify-center items-center py-2 px-4 border border-[#27272a] rounded-md bg-[#121215] hover:bg-[#18181b] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <Chrome className="w-4 h-4 mr-2 text-brand-accent" />
              Google
            </button>
          </div>

          {/* Sign agreements */}
          <p className="text-center text-[10px] text-[#71717a] mt-8 leading-relaxed select-none">
            © 2026 Escualo. Inspired by Obsidian.<br/>By continuing, you agree to Escualo's{' '}
            <a href="#" className="text-brand-primary hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-brand-primary hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
