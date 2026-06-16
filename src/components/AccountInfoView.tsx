import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Shield, 
  CreditCard, 
  Check, 
  Edit3, 
  Loader2, 
  Home, 
  FileText, 
  Edit2, 
  LogOut, 
  Key, 
  Sparkles,
  ArrowLeft,
  Archive,
  Trash2
} from 'lucide-react';
import { UserState, ActiveView, NoteItem } from '../types';
import { supabase } from '../lib/supabase';

interface AccountInfoViewProps {
  user: UserState;
  notes: NoteItem[];
  onNavigate: (view: ActiveView) => void;
  onLogout: () => void;
  onUpdateUser: (updatedFields: Partial<UserState>) => void;
  onCreateNewNote?: () => void;
  currentFolder: 'active' | 'archive' | 'trash';
  setCurrentFolder: (folder: 'active' | 'archive' | 'trash') => void;
}

export default function AccountInfoView({
  user,
  notes,
  onNavigate,
  onLogout,
  onUpdateUser,
  onCreateNewNote,
  currentFolder,
  setCurrentFolder
}: AccountInfoViewProps) {
  const activeCount = notes.filter(n => !n.tags.includes('_archived') && !n.tags.includes('_trashed')).length;
  const archiveCount = notes.filter(n => n.tags.includes('_archived') && !n.tags.includes('_trashed')).length;
  const trashCount = notes.filter(n => n.tags.includes('_trashed')).length;

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.fullName);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [authProvider, setAuthProvider] = useState<string>('이메일 및 비밀번호');

  useEffect(() => {
    const fetchSessionProvider = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const provider = session.user.app_metadata?.provider || session.user.identities?.[0]?.provider || 'email';
          if (provider === 'google') {
            setAuthProvider('Google OAuth');
          } else if (provider === 'github') {
            setAuthProvider('GitHub OAuth');
          } else if (provider === 'email') {
            setAuthProvider('이메일 / 비밀번호');
          } else {
            setAuthProvider(`${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth`);
          }
        }
      } catch (err) {
        console.error('Failed to resolve auth provider:', err);
      }
    };
    fetchSessionProvider();
  }, []);

  const handleSaveProfile = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    setSaveMessage('');

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: newName.trim() }
      });

      if (error) {
        throw error;
      }

      onUpdateUser({ fullName: newName.trim() });
      setSaveMessage('Profile name updated successfully.');
      setIsEditing(false);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setSaveMessage('Failed to update. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div id="account-page-container" className="flex h-screen bg-[#09090b] text-[#e4e4e7] overflow-hidden select-none font-sans">
      
      {/* 1. Sidebar Navigation */}
      <aside className="w-64 bg-[#0c0c0e] border-r border-[#1c1c1f] flex flex-col p-4 shrink-0 h-full">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-2 py-3 mb-6">
          <div className="w-7 h-7 rounded-lg bg-brand-primary flex items-center justify-center font-bold text-black text-sm shadow-[0_0_15px_rgba(167,139,250,0.2)]">
            E
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-xs tracking-tight">Escualo Cloud</span>
            <span className="text-[10px] font-mono text-brand-primary">v2.4.0</span>
          </div>
        </div>

        {/* Sidebar Nav Middle Items */}
        <nav className="space-y-1.5 flex-1 select-none">
          {/* Home Directory button */}
          <button 
            id="sidemenu-home"
            onClick={() => {
              setCurrentFolder('active');
              onNavigate('dashboard');
            }}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer text-xs border border-transparent"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>홈 디렉터리</span>
            <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border bg-[#18181b] text-[#71717a] border-[#27272a]">
              {activeCount}
            </span>
          </button>

          {/* Archive button */}
          <button 
            id="sidemenu-archive"
            onClick={() => {
              setCurrentFolder('archive');
              onNavigate('dashboard');
            }}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer text-xs border border-transparent"
          >
            <Archive className="w-4 h-4 shrink-0" />
            <span>보관함</span>
            <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border bg-[#18181b] text-[#71717a] border-[#27272a]">
              {archiveCount}
            </span>
          </button>

          {/* Trash button */}
          <button 
            id="sidemenu-trash"
            onClick={() => {
              setCurrentFolder('trash');
              onNavigate('dashboard');
            }}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer text-xs border border-transparent"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>휴지통</span>
            <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border bg-[#18181b] text-[#71717a] border-[#27272a]">
              {trashCount}
            </span>
          </button>

          <div className="my-2 border-t border-[#27272a]/40" />

          {/* Active Note Editor button */}
          <button 
            id="sidemenu-editor"
            onClick={() => onNavigate('editor')}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer text-xs"
          >
            <FileText className="w-4 h-4 shrink-0" />
            노트 에디터
          </button>

          {/* Create Blank note trigger */}
          {onCreateNewNote && (
            <button 
              id="sidemenu-create"
              onClick={onCreateNewNote}
              className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer text-xs"
            >
              <Edit2 className="w-4 h-4 shrink-0" />
              노트 만들기
            </button>
          )}

          {/* Account profile link - ACTIVE */}
          <button 
            id="sidemenu-account"
            className="flex items-center gap-3 w-full text-left bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-lg px-4 py-2.5 font-semibold transition-all text-xs"
          >
            <User className="w-4 h-4 shrink-0 text-brand-primary" />
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

      {/* 2. Main content area */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-12 bg-radial from-[#121215] via-[#09090b] to-[#09090b]">
        
        {/* Navigation Breadcrumb & Back Arrow */}
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="p-1.5 rounded-lg border border-[#27272a]/60 text-[#a1a1aa] hover:text-white hover:bg-[#1c1c1f] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex flex-col">
              <span className="text-[#71717a] font-mono text-[10px] uppercase tracking-wider">Settings</span>
              <h1 className="text-xl font-bold font-sans text-white tracking-tight">계정 정보</h1>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Profile Overview Card */}
          <div className="bg-[#121215] border border-[#27272a]/80 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none" />
            
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">

              {/* Detail Profile Specs */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-[#1c1c1f] border border-[#3f3f46] text-white text-sm font-semibold rounded-lg px-2.5 py-1 focus:outline-hidden focus:ring-1 focus:ring-brand-primary"
                        placeholder="이름 입력"
                        maxLength={20}
                        autoFocus
                      />
                      <button 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-brand-primary hover:opacity-90 disabled:opacity-50 text-black text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {isSaving ? <Loader2 className="w-3" /> : <Check className="w-3 h-3" />}
                        저장
                      </button>
                      <button 
                        onClick={() => { setIsEditing(false); setNewName(user.fullName); }}
                        className="bg-[#1c1c1f] hover:bg-[#27272a] text-[#a1a1aa] text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-lg font-bold text-white tracking-tight">{user.fullName || 'User'}</h2>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="p-1 text-[#71717a] hover:text-[#a1a1aa] transition-colors rounded-md p-1 hover:bg-[#1a1a1e] cursor-pointer"
                        title="Edit profile name"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
                <p className="text-xs text-[#a1a1aa] font-mono flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[#71717a]" />
                  {user.email}
                </p>
                {user.id && (
                  <p className="text-[10px] text-[#71717a] font-mono tracking-tight select-all">
                    UID: {user.id}
                  </p>
                )}
              </div>

              {/* Status Badge */}
              <div className="shrink-0 self-start md:self-center">
                <span className="text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  계정 활성화됨
                </span>
              </div>
            </div>

            {saveMessage && (
              <div className="mt-4 text-[11px] font-mono text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-3 py-1.5 rounded-lg max-w-fit animate-fade-in">
                {saveMessage}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subscription License Card */}
            <div className="bg-[#121215] border border-[#27272a]/80 rounded-xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a] text-[10px] font-bold uppercase tracking-wider">구독 멤버십</span>
                  <CreditCard className="w-4 h-4 text-[#71717a]" />
                </div>
                
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white capitalize tracking-tighter">
                      {user.plan === 'pro' ? 'Premium Pro' : 'Free Plan'}
                    </span>
                    <span className="text-[10px] font-mono text-[#a1a1aa]">
                      {user.plan === 'pro' ? '월 $8.00 결제완료' : '기본 무료'}
                    </span>
                  </div>
                  <p className="text-[#a1a1aa] text-xs mt-1.5 leading-relaxed">
                    {user.plan === 'pro' 
                      ? '무제한 노트 작성 및 에디터 서식 도구가 잠금 해제된 프로 계정입니다.'
                      : '기본 3개의 노트 한도를 제공하는 프리 서비스 플랜입니다.'}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                    <Check className="w-3.5 h-3.5 text-brand-primary" />
                    <span>최대 노트 {user.plan === 'pro' ? '무제한 저장' : '3개 제한'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                    <Check className="w-3.5 h-3.5 text-brand-primary" />
                    <span>Supabase 클라우드 데이터 동기화 완료</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                    <Check className="w-3.5 h-3.5 text-brand-primary" />
                    <span>서식 툴바 및 마크다운 편집 키보드 단축키 지원</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  onClick={() => onNavigate('pricing')}
                  className="w-full bg-[#1c1c1f] hover:bg-[#27272a] text-[#e4e4e7] border border-[#27272a] hover:border-[#3f3f46] text-xs font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                  멤버십 플랜 상세 / 업그레이드
                </button>
              </div>
            </div>

            {/* Security Config Card */}
            <div className="bg-[#121215] border border-[#27272a]/80 rounded-xl p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a] text-[10px] font-bold uppercase tracking-wider">보안 앤 시스템 설정</span>
                  <Shield className="w-4 h-4 text-[#71717a]" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">인증 제공 모델</h3>
                  <div className="mt-2 p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-lg flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-primary lg:text-sm">{authProvider} 연동 완료</span>
                    <span className="text-[10px] font-mono text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20 uppercase tracking-wider font-semibold shrink-0">
                      {authProvider.includes('OAuth') ? 'OAuth 2.0' : 'Email Auth'}
                    </span>
                  </div>
                  <p className="text-[#a1a1aa] text-xs mt-2.5 leading-relaxed">
                    {authProvider.includes('OAuth') 
                      ? `${authProvider} 계정 연동을 통해 보안 비밀번호 입력 없이 안전하고 강력하게 보증된 세션입니다.`
                      : '이메일 주소 및 복잡한 비밀번호 암호해시 매칭을 통해 독립적으로 증명된 로그인 세션입니다.'}
                  </p>
                </div>

                <div className="p-3 bg-[#18181b]/60 border border-[#27272a] rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-white font-mono">{authProvider} Connected</span>
                  </div>
                  <p className="text-[10px] text-[#71717a] font-mono mt-1">
                    인증 제공 수단: {authProvider} 기반 토큰 검증
                  </p>
                </div>
              </div>

              <div className="pt-6 flex gap-2">
                <button 
                  onClick={async () => {
                    try {
                      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                        redirectTo: window.location.origin
                      });
                      if (error) throw error;
                      alert('비밀번호 재설정 이메일이 발송되었습니다.');
                    } catch (err: any) {
                      alert('비밀번호 변경 요청 중 문제가 발생했습니다: ' + err.message);
                    }
                  }}
                  className="flex-1 bg-transparent hover:bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a] text-xs font-medium py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  비밀번호 재설정
                </button>
              </div>
            </div>
          </div>
          
        </motion.div>
      </main>
    </div>
  );
}
