import React, { useState, useEffect } from 'react';
import { 
  Plus, Home, FileText, Edit2, User as UserIcon, LogOut, 
  Search, Bell, Settings, Grid, List, Trash2, Eye, Archive, RotateCcw
} from 'lucide-react';
import { ActiveView, NoteItem, UserState } from '../types';
import { supabase } from '../lib/supabase';

interface DashboardViewProps {
  user: UserState;
  notes: NoteItem[];
  onNavigate: (view: ActiveView) => void;
  onSelectNote: (note: NoteItem) => void;
  onCreateNewNote: () => void;
  onDeleteNote: (id: string) => void;
  onLogout: () => void;
  onUpdateNote: (note: NoteItem) => void;
  currentFolder: 'active' | 'archive' | 'trash';
  setCurrentFolder: (folder: 'active' | 'archive' | 'trash') => void;
}

export default function DashboardView({ 
  user, 
  notes, 
  onNavigate, 
  onSelectNote, 
  onCreateNewNote, 
  onDeleteNote,
  onLogout,
  onUpdateNote,
  currentFolder,
  setCurrentFolder
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [totalNotesCount, setTotalNotesCount] = useState<number>(notes.length);

  const activeCount = notes.filter(n => !n.tags.includes('_archived') && !n.tags.includes('_trashed')).length;
  const archiveCount = notes.filter(n => n.tags.includes('_archived') && !n.tags.includes('_trashed')).length;
  const trashCount = notes.filter(n => n.tags.includes('_trashed')).length;

  const handleArchiveClick = (note: NoteItem) => {
    const updatedTags = [...note.tags.filter(t => t !== '_trashed')];
    if (!updatedTags.includes('_archived')) {
      updatedTags.push('_archived');
    }
    onUpdateNote({
      ...note,
      tags: updatedTags
    });
  };

  const handleUnarchiveClick = (note: NoteItem) => {
    onUpdateNote({
      ...note,
      tags: note.tags.filter(t => t !== '_archived')
    });
  };

  const handleTrashClick = (note: NoteItem) => {
    const updatedTags = [...note.tags.filter(t => t !== '_archived')];
    if (!updatedTags.includes('_trashed')) {
      updatedTags.push('_trashed');
    }
    onUpdateNote({
      ...note,
      tags: updatedTags
    });
  };

  const handleRestoreClick = (note: NoteItem) => {
    onUpdateNote({
      ...note,
      tags: note.tags.filter(t => t !== '_archived' && t !== '_trashed')
    });
  };

  const fetchTotalNotesCount = async () => {
    try {
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !currentUser) {
        setTotalNotesCount(notes.length);
        return;
      }

      const { count, error } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Error counting notes:', error);
        setTotalNotesCount(notes.length);
      } else if (count !== null) {
        setTotalNotesCount(count);
      }
    } catch (err) {
      console.error('Failed to fetch total notes count:', err);
      setTotalNotesCount(notes.length);
    }
  };

  useEffect(() => {
    fetchTotalNotesCount();
  }, [notes, user.id]);

  // Filter notes based on the live search input
  const filteredNotes = notes.filter(note => {
    const isArchived = note.tags.includes('_archived');
    const isTrashed = note.tags.includes('_trashed');

    if (currentFolder === 'active' && (isArchived || isTrashed)) return false;
    if (currentFolder === 'archive' && (!isArchived || isTrashed)) return false;
    if (currentFolder === 'trash' && !isTrashed) return false;

    const q = searchQuery.toLowerCase();
    const tagsWithoutSystem = note.tags.filter(t => !t.startsWith('_'));
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      tagsWithoutSystem.some(tag => tag.toLowerCase().includes(q))
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
            <p className="text-[10px] text-brand-accent tracking-wider font-mono uppercase font-semibold">프로 요금제 활성화됨</p>
          </div>
        </div>

        {/* Core Creative Action */}
        <button 
          id="btn-sidebar-new-note"
          onClick={onCreateNewNote}
          className="w-full mb-6 bg-brand-primary hover:bg-[#bbf7d0] hover:text-[#001a12] text-[#0a0012] font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-transparent shadow-md cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="text-xs">새 노트 작성</span>
        </button>

        {/* Link navigation items list */}
        <nav className="flex-1 flex flex-col gap-1 text-xs">
          {/* Active Home item */}
          <button 
            id="sidemenu-home"
            onClick={() => setCurrentFolder('active')}
            className={`flex items-center gap-3 w-full text-left rounded-lg px-4 py-2.5 transition-all cursor-pointer ${
              currentFolder === 'active'
                ? 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-semibold scale-[0.98]'
                : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-white border border-transparent'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>홈 디렉터리</span>
            <span className={`ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
              currentFolder === 'active' 
                ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' 
                : 'bg-[#18181b] text-[#71717a] border-[#27272a]'
            }`}>
              {activeCount}
            </span>
          </button>

          {/* Archive item */}
          <button 
            id="sidemenu-archive"
            onClick={() => setCurrentFolder('archive')}
            className={`flex items-center gap-3 w-full text-left rounded-lg px-4 py-2.5 transition-all cursor-pointer ${
              currentFolder === 'archive'
                ? 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-semibold scale-[0.98]'
                : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-white border border-transparent'
            }`}
          >
            <Archive className="w-4 h-4 shrink-0" />
            <span>보관함</span>
            <span className={`ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
              currentFolder === 'archive' 
                ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' 
                : 'bg-[#18181b] text-[#71717a] border-[#27272a]'
            }`}>
              {archiveCount}
            </span>
          </button>

          {/* Trash item */}
          <button 
            id="sidemenu-trash"
            onClick={() => setCurrentFolder('trash')}
            className={`flex items-center gap-3 w-full text-left rounded-lg px-4 py-2.5 transition-all cursor-pointer ${
              currentFolder === 'trash'
                ? 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-semibold scale-[0.98]'
                : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-white border border-transparent'
            }`}
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>휴지통</span>
            <span className={`ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
              currentFolder === 'trash' 
                ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' 
                : 'bg-[#18181b] text-[#71717a] border-[#27272a]'
            }`}>
              {trashCount}
            </span>
          </button>

          <div className="my-2 border-t border-[#27272a]/40" />

          {/* Inactive notes trigger */}
          <button 
            id="sidemenu-notes"
            onClick={() => onNavigate('editor')}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 shrink-0" />
            노트 에디터
          </button>

          {/* Create Blank note trigger */}
          <button 
            id="sidemenu-create"
            onClick={onCreateNewNote}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer"
          >
            <Edit2 className="w-4 h-4 shrink-0" />
            노트 만들기
          </button>

          {/* Account profile link */}
          <button 
            id="sidemenu-account"
            onClick={() => onNavigate('account')}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer"
          >
            <UserIcon className="w-4 h-4 shrink-0" />
            계정 정보
          </button>
        </nav>

        {/* Sidebar Footer Logout triggers */}
        <div className="mt-auto pt-4 border-t border-[#27272a]">
          <button 
            id="sidemenu-logout"
            onClick={onLogout}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#520000]/20 hover:text-red-400 transition-all rounded-lg px-4 py-2 font-semibold text-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500 shrink-0" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Search bar header */}
        <header className="hidden md:flex px-6 md:px-8 py-4 border-b border-[#27272a] bg-[#0c0c0f]/90 backdrop-blur-md shrink-0 w-full">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
            <div className="relative w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a] group-focus-within:text-brand-primary transition-colors" />
              <input 
                type="text" 
                placeholder="에스쿠알로 노트, 태그, 명령어 검색... (Cmd+K)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121215] border border-[#27272a] rounded-lg py-2 pl-10 pr-4 text-xs text-white placeholder:text-[#71717a] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-sans"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Quick alert bar */}
              <button 
                onClick={() => { alert('클라우드 노드 네트워크에 대기 중이거나 충돌하는 동기화 작업이 없습니다.'); }}
                className="text-[#a1a1aa] hover:text-brand-primary transition-colors cursor-pointer relative"
                title="알림"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-brand-accent rounded-full"></span>
              </button>

              {/* settings dropdown */}
              <button 
                onClick={() => onNavigate('pricing')}
                className="text-[#a1a1aa] hover:text-brand-primary transition-colors cursor-pointer"
                title="요금제 및 멤버십"
              >
                <Settings className="w-4 h-4" />
              </button>
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
              placeholder="검색..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121215] border border-[#27272a] rounded-lg py-1.5 px-3 text-xs text-white placeholder:text-[#52525b] focus:outline-none"
            />
          </div>
        </header>

        {/* main container list notes scroll scroll */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 relative">
          <div className="max-w-6xl mx-auto">

            {/* Quick Metrics Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {/* Total Notes card */}
              <div id="stat-total-notes" className="bg-[#121215] border border-[#27272a]/80 hover:border-[#3f3f46] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between group h-28 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none" />
                <div className="z-10 flex flex-col justify-between h-full w-full">
                  <span className="text-[#71717a] text-[10px] font-bold uppercase tracking-wider font-sans">총 노트 수</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-3xl font-bold font-sans tracking-tight text-white">{totalNotesCount}</span>
                    <span className="text-[10px] font-mono text-brand-primary bg-brand-primary/10 border border-brand-primary/15 px-2.5 py-0.5 rounded-full font-semibold">
                      실시간 동기화
                    </span>
                  </div>
                </div>
              </div>

              {/* Connected Account status */}
              <div id="stat-account-tier" className="bg-[#121215] border border-[#27272a]/80 hover:border-[#3f3f46] rounded-xl p-5 relative overflow-hidden flex flex-col justify-between group h-28 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none" />
                <div className="z-10 flex flex-col justify-between h-full w-full">
                  <span className="text-[#71717a] text-[10px] font-bold uppercase tracking-wider font-sans">구독 요금제</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-3xl font-bold font-sans tracking-tight text-white capitalize">{user.plan === 'free' ? '무료' : user.plan}</span>
                    <span className="text-[10px] font-mono text-brand-accent bg-brand-accent/10 border border-brand-accent/15 px-2.5 py-0.5 rounded-full font-semibold">
                      PRO 노드
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Segmented Folders */}
            <div className="md:hidden flex gap-2 p-1 bg-[#121215] border border-[#27272a] rounded-lg mb-6 select-none">
              <button
                onClick={() => setCurrentFolder('active')}
                className={`flex-1 py-1.5 text-center text-[11px] font-semibold rounded-md transition-all ${
                  currentFolder === 'active'
                    ? 'bg-brand-primary text-[#0a0012]'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                홈 ({activeCount})
              </button>
              <button
                onClick={() => setCurrentFolder('archive')}
                className={`flex-1 py-1.5 text-center text-[11px] font-semibold rounded-md transition-all ${
                  currentFolder === 'archive'
                    ? 'bg-brand-primary text-[#0a0012]'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                보관함 ({archiveCount})
              </button>
              <button
                onClick={() => setCurrentFolder('trash')}
                className={`flex-1 py-1.5 text-center text-[11px] font-semibold rounded-md transition-all ${
                  currentFolder === 'trash'
                    ? 'bg-brand-primary text-[#0a0012]'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                휴지통 ({trashCount})
              </button>
            </div>

            {/* Recent Notes Header with toggles */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight font-sans">
                  {currentFolder === 'active' && '최근 노트'}
                  {currentFolder === 'archive' && '보관된 노트'}
                  {currentFolder === 'trash' && '휴지통'}
                </h2>
                <p className="text-xs text-[#a1a1aa] mt-1 font-sans">
                  {currentFolder === 'active' && `작업을 계속해 보세요. 검색된 노트: ${filteredNotes.length}개.`}
                  {currentFolder === 'archive' && `보관함에 보관된 노트 파일 리스트입니다: ${filteredNotes.length}개.`}
                  {currentFolder === 'trash' && `삭제된 임시 보관 문서 리스트입니다: ${filteredNotes.length}개.`}
                </p>
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
              <div className="border border-dashed border-[#27272a] rounded-xl py-16 px-4 text-center bg-[#121215]/20">
                {currentFolder === 'active' ? (
                  <>
                    <FileText className="w-8 h-8 text-[#52525b] mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-white mb-1">작성된 노트가 없습니다</h3>
                    <p className="text-xs text-[#71717a] mb-4">새 문서를 작성하거나 다른 방식을 시험해 보세요.</p>
                    <button
                      onClick={onCreateNewNote}
                      className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs px-4 py-2 rounded-lg hover:bg-brand-primary/20 transition-all font-semibold cursor-pointer"
                    >
                      새 문서 파일 만들기 +
                    </button>
                  </>
                ) : currentFolder === 'archive' ? (
                  <>
                    <Archive className="w-8 h-8 text-[#52525b] mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-white mb-1">보관함이 비어 있습니다</h3>
                    <p className="text-xs text-[#71717a] mb-2">필요하지 않지만 보관하고 싶은 노트를 보관하여 워크스페이스를 정돈하세요.</p>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-8 h-8 text-[#52525b] mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-white mb-1">휴지통이 비어 있습니다</h3>
                    <p className="text-xs text-[#71717a] mb-2">삭제된 임시 파일이 여기에 보관됩니다. 영구 소멸하거나 직접 복원 가능합니다.</p>
                  </>
                )}
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
                  onClick={() => {
                    if (currentFolder === 'trash') {
                      if (confirm(`"${note.title}" 문서는 현재 휴지통에 보관되어 있습니다. 편지하려면 먼저 복구해야 합니다. 지금 복구할까요?`)) {
                        handleRestoreClick(note);
                      }
                      return;
                    }
                    onSelectNote(note);
                  }}
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
                        {note.title || '제목 없는 노트'}
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
                        {note.content || '노트 내용이 비어 있습니다. 클릭해서 작성해 보세요...'}
                      </p>
                    )}
                  </div>
 
                  {/* tags footer list and Delete action toggle trigger */}
                  <div className={`mt-4 pt-2 border-t border-[#27272a]/40 z-10 flex items-center justify-between shrink-0 ${layoutMode === 'grid' ? '' : 'mt-0 pt-0 border-t-0 gap-4'}`}>
                    <div className="flex flex-wrap gap-1.5">
                      {note.tags.filter(t => !t.startsWith('_')).map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#09090b] border border-[#27272a]/60 text-[#a1a1aa] hover:text-white transition-colors"
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
 
                    <div className="flex items-center gap-2">
                      {currentFolder === 'active' && (
                        <>
                          <span className="text-[10px] text-[#71717a] font-mono group-hover:text-brand-primary transition-colors flex items-center gap-1 mr-1">
                            <Eye className="w-3 h-3" />
                            <span>편집</span>
                          </span>

                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchiveClick(note);
                            }}
                            className="p-1 rounded bg-[#09090b] hover:bg-brand-primary/10 border border-[#27272a]/60 text-[#71717a] hover:text-brand-primary transition-all cursor-pointer"
                            title="보관함으로 이동"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>

                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTrashClick(note);
                            }}
                            className="p-1 rounded bg-[#09090b] hover:bg-red-950/40 border border-[#27272a]/60 text-[#71717a] hover:text-red-400 opacity-60 hover:opacity-100 transition-all cursor-pointer"
                            title="휴지통으로 이동"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {currentFolder === 'archive' && (
                        <>
                          <span className="text-[10px] text-[#71717a] font-mono group-hover:text-brand-primary transition-colors flex items-center gap-1 mr-1">
                            <Eye className="w-3 h-3" />
                            <span>열기</span>
                          </span>

                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestoreClick(note);
                            }}
                            className="p-1 rounded bg-[#09090b] hover:bg-brand-primary/10 border border-[#27272a]/60 text-[#71717a] hover:text-brand-primary transition-all cursor-pointer"
                            title="보관 해제"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTrashClick(note);
                            }}
                            className="p-1 rounded bg-[#09090b] hover:bg-red-950/40 border border-[#27272a]/60 text-[#71717a] hover:text-red-400 opacity-60 hover:opacity-100 transition-all cursor-pointer"
                            title="휴지통으로 이동"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {currentFolder === 'trash' && (
                        <>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRestoreClick(note);
                            }}
                            className="p-1 px-2 rounded bg-[#09090b] hover:bg-emerald-950/40 border border-[#27272a]/60 text-[#71717a] hover:text-emerald-400 transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                            title="복원하기"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>복원</span>
                          </button>

                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`※경고: 이 조치는 되돌릴 수 없습니다. 정말 이 노트를 영구 소멸하시겠습니까: "${note.title}"?`)) {
                                onDeleteNote(note.id);
                              }
                            }}
                            className="p-1 px-2 rounded bg-[#0a0404] hover:bg-red-950/60 border border-[#451a1a] text-[#f87171] hover:text-red-300 transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                            title="영구 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>영구 소멸</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
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
