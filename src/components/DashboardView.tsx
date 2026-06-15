import React, { useState } from 'react';
import { 
  Plus, Home, FileText, Edit2, User as UserIcon, LogOut, 
  Search, Bell, Settings, Grid, List, Trash2, Eye, Code, Terminal
} from 'lucide-react';
import { ActiveView, NoteItem, UserState } from '../types';

interface DashboardViewProps {
  user: UserState;
  notes: NoteItem[];
  onNavigate: (view: ActiveView) => void;
  onSelectNote: (note: NoteItem) => void;
  onCreateNewNote: () => void;
  onDeleteNote: (id: string) => void;
  onLogout: () => void;
}

export default function DashboardView({ 
  user, 
  notes, 
  onNavigate, 
  onSelectNote, 
  onCreateNewNote, 
  onDeleteNote,
  onLogout 
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

  // Filter notes based on the live search input
  const filteredNotes = notes.filter(note => {
    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      note.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div id="dashboard-container" className="bg-[#09090b] text-[#fafafa] font-sans min-h-screen flex h-screen overflow-hidden select-none selection:bg-brand-primary/30 selection:text-white">
      
      {/* Side Navigation panel */}
      <aside className="hidden md:flex flex-col bg-[#121215] border-r border-[#27272a] w-64 h-full p-4 shrink-0 transition-all duration-300">
        
        {/* Workspace Brand and Status */}
        <div className="flex items-center gap-3 mb-8 px-2 py-1">
          <div className="w-8 h-8 rounded bg-brand-primary/15 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold shadow-[0_0_10px_rgba(167,139,250,0.15)]">
            E
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Escualo Cloud</h1>
            <p className="text-[10px] text-brand-accent tracking-wider font-mono uppercase font-semibold">Pro Plan Active</p>
          </div>
        </div>

        {/* Core Creative Action */}
        <button 
          id="btn-sidebar-new-note"
          onClick={onCreateNewNote}
          className="w-full mb-6 bg-brand-primary hover:bg-[#bbf7d0] hover:text-[#001a12] text-[#0a0012] font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-transparent shadow-md cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="text-xs">New Note</span>
        </button>

        {/* Link navigation items list */}
        <nav className="flex-1 flex flex-col gap-1 text-xs">
          {/* Active Home item */}
          <button 
            id="sidemenu-home"
            className="flex items-center gap-3 w-full text-left bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-lg px-4 py-2.5 font-semibold transition-all scale-[0.98] cursor-pointer"
          >
            <Home className="w-4 h-4 shrink-0" />
            Home Directory
          </button>

          {/* Inactive notes trigger */}
          <button 
            id="sidemenu-notes"
            onClick={() => onNavigate('editor')}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 shrink-0" />
            Note Editor
          </button>

          {/* Create Blank note trigger */}
          <button 
            id="sidemenu-create"
            onClick={onCreateNewNote}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer"
          >
            <Edit2 className="w-4 h-4 shrink-0" />
            Create Note
          </button>

          {/* Account profile link */}
          <button 
            id="sidemenu-account"
            onClick={() => { alert(`User profile session details:\nName: ${user.fullName}\nEmail: ${user.email}\nTier: ${user.plan.toUpperCase()}`); }}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer"
          >
            <UserIcon className="w-4 h-4 shrink-0" />
            Account Config
          </button>
        </nav>

        {/* Sidebar Footer Logout triggers */}
        <div className="mt-auto pt-4 border-t border-[#27272a] space-y-4">
          <button 
            id="sidemenu-logout"
            onClick={onLogout}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#520000]/20 hover:text-red-400 transition-all rounded-lg px-4 py-2 font-semibold text-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500 shrink-0" />
            Logout session
          </button>
          <div className="px-4 text-[9px] font-mono text-[#71717a] leading-relaxed select-none">
            © 2026 Escualo. Inspired by Obsidian. Built for builders.
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Search bar header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-[#27272a] bg-[#0c0c0f]/90 backdrop-blur-md shrink-0">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a] group-focus-within:text-brand-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search Escualo notes, tags, or commands... (Cmd+K)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121215] border border-[#27272a] rounded-lg py-2 pl-10 pr-4 text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Quick alert bar */}
            <button 
              onClick={() => { alert('No pending sync alert conflicts across the cloud node network.'); }}
              className="text-[#a1a1aa] hover:text-brand-primary transition-colors cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-brand-accent rounded-full"></span>
            </button>

            {/* settings dropdown */}
            <button 
              onClick={() => onNavigate('pricing')}
              className="text-[#a1a1aa] hover:text-brand-primary transition-colors cursor-pointer"
              title="Pricing & Subscriptions"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* User Profile avatar */}
            <div className="flex items-center gap-2 bg-[#121215] border border-[#27272a] rounded-lg p-1 pr-3">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-[#27272a] shrink-0 border border-brand-primary">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiz5l82bJVUmSdx8r30f0myP7I0mKYLGZUDf9whClFAHKD1hGTxu8IuQ5KF3ywGs0nbPhgq70uqZqrgfD5PQlIKi2qaCuxSwETFdN4w6ltez4AtZVdjodJy0uKsnnq167Kt1j7aS8VrS2MdCdRbfVO4e3Osue5EOAI28gp2lpjxX0NBTzPgUE4Jd2YbR3s4DID_NEuCFrX6Sj9jRAuFqkIEQ55Madvv5ieGJ1_v9FkE4FK_w28Q37nurSSVySxc5d5mDmMXDv6Sv70" 
                  alt="Avatar" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
                />
              </div>
              <span className="text-[11px] font-medium text-white truncate max-w-[100px]">{user.fullName}</span>
            </div>
          </div>
        </header>

        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-4 bg-[#09090b] border-b border-[#27272a] shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('landing')} 
              className="w-6 h-6 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary flex items-center justify-center text-xs font-bold font-mono"
            >
              E
            </button>
            <h1 className="text-sm font-bold text-white tracking-tight">Escualo</h1>
          </div>
          
          <div className="relative w-48 shrink-0">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121215] border border-[#27272a] rounded-lg py-1.5 px-3 text-xs text-white placeholder:text-[#52525b] focus:outline-none"
            />
          </div>
        </header>

        {/* main container list notes scroll scroll */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 relative">
          <div className="max-w-6xl mx-auto">
            
            {/* Recent Notes Header with toggles */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight font-sans">Recent Notes</h2>
                <p className="text-xs text-[#a1a1aa] mt-1 font-sans">Pick up where you left off. Search matching: {filteredNotes.length} notes.</p>
              </div>

              {/* Layout triggers */}
              <div id="layout-toggle" className="hidden md:flex gap-1.5 p-1 bg-[#121215] border border-[#27272a] rounded-lg shadow-inner">
                <button 
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                    layoutMode === 'grid' 
                      ? 'bg-[#27272a] text-brand-primary' 
                      : 'text-[#71717a] hover:text-white'
                  }`}
                  title="Grid Layout"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setLayoutMode('list')}
                  className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                    layoutMode === 'list' 
                      ? 'bg-[#27272a] text-brand-primary' 
                      : 'text-[#71717a] hover:text-white'
                  }`}
                  title="List Layout"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Empty list screen */}
            {filteredNotes.length === 0 && (
              <div className="border border-dashed border-[#27272a] rounded-xl py-16 px-4 text-center">
                <FileText className="w-8 h-8 text-[#52525b] mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">No notes match filter criteria</h3>
                <p className="text-xs text-[#71717a] mb-4">Try altering your search keywords or create a new document file.</p>
                <button
                  onClick={onCreateNewNote}
                  className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs px-4 py-2 rounded-lg hover:bg-brand-primary/20 transition-all font-semibold cursor-pointer"
                >
                  Create Document File +
                </button>
              </div>
            )}

            {/* Note Cards Render lists */}
            <div className={
              layoutMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" 
                : "flex flex-col gap-3"
            }>
              {filteredNotes.map((note) => (
                <article 
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  className={`group bg-[#121215] border border-[#27272a] hover:border-[#52525b] hover:bg-[#18181b] rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden cursor-pointer ${
                    layoutMode === 'grid' ? 'h-52' : 'h-auto py-4 flex-row items-center gap-6'
                  }`}
                >
                  {/* Subtle inner hover ambient glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none"></div>

                  <div className={`z-10 flex-grow ${layoutMode === 'grid' ? '' : 'flex items-center justify-between w-full'}`}>
                    {/* Header item with title & time indicator */}
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <h3 className="text-sm font-semibold text-white group-hover:text-brand-primary transition-colors line-clamp-1 font-sans">
                        {note.title || 'Untitled Note'}
                      </h3>
                      <span className="text-[10px] font-mono text-[#71717a] shrink-0 select-none whitespace-nowrap pt-0.5">
                        {note.updatedAt}
                      </span>
                    </div>

                    {/* Code snippet stylized container vs raw body preview */}
                    {note.isSnippet && note.snippetCode ? (
                      <div className="my-2 bg-[#09090b] text-[#34d399] p-3.5 rounded border border-[#27272a] text-[11px] font-mono overflow-hidden max-h-24 select-text">
                        <code className="block leading-relaxed whitespace-pre truncate">
                          {note.snippetCode}
                        </code>
                      </div>
                    ) : (
                      <p className={`text-xs text-[#a1a1aa] leading-relaxed font-sans ${layoutMode === 'grid' ? 'line-clamp-3' : 'line-clamp-1 flex-1 max-w-2xl px-4'}`}>
                        {note.content || 'Empty note content. Click here to edit...'}
                      </p>
                    )}
                  </div>

                  {/* tags footer list and Delete action toggle trigger */}
                  <div className={`mt-4 pt-2 border-t border-[#27272a]/40 z-10 flex items-center justify-between shrink-0 ${layoutMode === 'grid' ? '' : 'mt-0 pt-0 border-t-0 gap-4'}`}>
                    <div className="flex flex-wrap gap-1.5">
                      {note.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#09090b] border border-[#27272a]/60 text-[#a1a1aa] hover:text-white transition-colors"
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Action trigger: edit directly */}
                      <span className="text-[10px] text-[#71717a] font-mono group-hover:text-brand-primary transition-colors flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>edit</span>
                      </span>

                      {/* Action trigger: delete Note */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Confirm deletion of file: "${note.title}"?`)) {
                            onDeleteNote(note.id);
                          }
                        }}
                        className="p-1 rounded bg-[#09090b] hover:bg-red-950/40 border border-[#27272a]/60 text-[#71717a] hover:text-red-400 opacity-60 hover:opacity-100 transition-all cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Secondary guide block */}
            <div className="mt-12 p-6 bg-[#121215] border border-[#27272a] rounded-xl flex items-center justify-between flex-wrap gap-4 select-none">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-brand-accent shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">Interactive CLI Integration System</h4>
                  <p className="text-[10px] text-[#a1a1aa] mt-1">Configure your obsidian config folders directly matching the cloud pipeline.</p>
                </div>
              </div>
              <span className="bg-[#09090b] border border-[#27272a] rounded px-2.5 py-1 text-[9px] font-mono text-[#a1a1aa] select-all">
                npx escualo-cloud init
              </span>
            </div>

          </div>
        </div>

        {/* Floating Action Button (FAB) (Mobile only) */}
        <button 
          onClick={onCreateNewNote}
          className="md:hidden fixed bottom-6 right-6 w-12 h-12 bg-brand-primary text-[#0a0012] rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform z-40 cursor-pointer"
          title="New Note"
        >
          <Plus className="w-6 h-6" />
        </button>
      </main>
    </div>
  );
}
