import React, { useState, useEffect } from 'react';
import { NoteItem, ActiveView, UserState } from './types';
import { supabase } from './lib/supabase';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import LoginPage from './components/LoginPage';
import DashboardView from './components/DashboardView';
import PaymentConfirmView from './components/PaymentConfirmView';
import NoteEditorView from './components/NoteEditorView';
import AccountInfoView from './components/AccountInfoView';
import { Sparkles, AlertTriangle } from 'lucide-react';

// Initial master array of mock Obsidian notes
const DEFAULT_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'API Integration Specs',
    content: `# API Integration Specs\n\nEndpoints to cover: \`/v1/auth\`, \`/v1/users\`, \`/v1/notes\`. Need to implement JWT token refresh logic. The current implementation uses memory maps.\n\n## Status Checklist\n- [x] Configure express backend router\n- [x] Implement JWT middleware controllers\n- [ ] Add Redis connection fallback cache\n- [ ] Write integration test cases\n\n## Security Standard\n> "All APIs hosted on escualo.cloud must comply with ISO-27001 TLS layer standards."\n\n![[architecture_v2.png]]`,
    tags: ['backend', 'auth'],
    updatedAt: '2h ago'
  },
  {
    id: 'note-2',
    title: 'Meeting Notes: Q3 Planning',
    content: `# Meeting Notes: Q3 Planning\n\nPick up where you left off. Summary of product decisions discussed on Monday with the team:\n\n- Focus on performance optimization for the editor splits.\n- Launch the new dark theme variant live.\n- Marketing push in late August.\n\n## Milestone Checklist\n- [x] Launch Escualo 2.0 theme engine\n- [ ] Migrate database to Spanner structures\n- [ ] Set up global edge delivery caching\n\n## Core Directive\n> "Make it so simple that the interface disappears. Focus solely on code readability."`,
    tags: ['meetings', 'planning'],
    updatedAt: 'Yesterday'
  },
  {
    id: 'note-3',
    title: 'Tailwind Config Fix',
    content: `# Tailwind Config Fix\n\nHere is the custom configuration snippet for our Obsidian theme colors:\n\n\`\`\`json\ncolors: {\n  primary: '#a78bfa',\n  accent: '#34d399',\n  background: '#09090b',\n  surface: '#121215'\n}\n\`\`\`\n\nMake sure the imports fit precisely!`,
    tags: ['css'],
    updatedAt: 'Aug 12',
    isSnippet: true,
    snippetCode: `colors: {\n  primary: '#a78bfa',\n  background: '#09090b',\n}`
  },
  {
    id: 'note-4',
    title: 'Project Escualo Manifesto',
    content: `# Project Escualo Manifesto\n\n"Precision in Darkness." The interface must vanish entirely, leaving only the user's thoughts. High contrast text on near-black surfaces.\n\n## Core Design Values\n- [x] Swiss structural typography\n- [x] High-contrast eye protection\n- [x] Immediate client-side persistence\n- [x] Standard GitHub Markdown compatible syntax\n\n[[auth_middleware.ts]]`,
    tags: ['design', 'core'],
    updatedAt: 'Aug 10'
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<ActiveView>('landing');
  const [currentUser, setCurrentUser] = useState<UserState>({
    isAuthenticated: false,
    email: '',
    fullName: '',
    plan: 'free'
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Handle OAuth callback popup closing
  useEffect(() => {
    if (window.opener && (window.location.hash.includes('access_token=') || window.location.href.includes('code='))) {
      // We are in the popup and returning from Google OAuth redirect.
      let active = true;
      let subscriptionObj: { unsubscribe: () => void } | null = null;
      let timer: { [Symbol.toPrimitive]?: any } | any = null;

      const getSessionAndPost = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && active) {
            window.opener.postMessage({
              type: 'oauth_success',
              access_token: session.access_token,
              refresh_token: session.refresh_token
            }, window.location.origin);
            window.close();
            return;
          }
        } catch (e) {
          console.error('Error getting session in popup:', e);
        }

        // If session is not immediately available, listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session && active) {
            try {
              window.opener.postMessage({
                type: 'oauth_success',
                access_token: session.access_token,
                refresh_token: session.refresh_token
              }, window.location.origin);
              subscription.unsubscribe();
              window.close();
            } catch (e) {
              console.error('Failed to notify parent window:', e);
            }
          }
        });
        subscriptionObj = subscription;

        // Timeout fallback to parse token from hash/url manually just in case
        timer = setTimeout(() => {
          if (!active) return;
          try {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const searchParams = new URLSearchParams(window.location.search);
            const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
            if (accessToken && refreshToken) {
              window.opener.postMessage({
                type: 'oauth_success',
                access_token: accessToken,
                refresh_token: refreshToken
              }, window.location.origin);
              if (subscriptionObj) subscriptionObj.unsubscribe();
              window.close();
            } else {
              window.opener.postMessage('oauth_success', window.location.origin);
              if (subscriptionObj) subscriptionObj.unsubscribe();
              window.close();
            }
          } catch (e) {
            console.error('Fallback failed:', e);
            window.opener.postMessage('oauth_success', window.location.origin);
            if (subscriptionObj) subscriptionObj.unsubscribe();
            window.close();
          }
        }, 1200);
      };

      getSessionAndPost();

      return () => {
        active = false;
        if (subscriptionObj) {
          subscriptionObj.unsubscribe();
        }
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, []);

  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(null);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);

  // Helper to format ISO timestamptz nicely matching expected layout style
  const formatTime = (isoString: string | null): string => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMins = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMins / 60);
      
      if (diffInMins < 1) return 'Just now';
      if (diffInMins < 60) return `${diffInMins}m ago`;
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 48) return 'Yesterday';
      
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Just now';
    }
  };

  const fetchNotes = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setNotes([]);
      setSelectedNote(null);
      return;
    }

    setIsLoadingNotes(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes from Supabase:', error);
        // Fallback to empty if table doesn't exist or other network issue
        setNotes([]);
        setSelectedNote(null);
        return;
      }

      if (data && data.length > 0) {
        const mappedNotes: NoteItem[] = data.map((dbNote: any) => ({
          id: dbNote.id,
          title: dbNote.title,
          content: dbNote.content,
          tags: dbNote.tags || [],
          updatedAt: formatTime(dbNote.updated_at),
          snippetCode: dbNote.snippet_code || undefined,
          isSnippet: dbNote.is_snippet || false,
        }));
        setNotes(mappedNotes);

        setSelectedNote(prevSelected => {
          if (prevSelected) {
            const foundObj = mappedNotes.find(item => item.id === prevSelected.id);
            if (foundObj) return foundObj;
          }
          return mappedNotes[0];
        });
      } else {
        // Automatically seed an initial welcome document for the new user profile
        const welcomeDoc = {
          user_id: session.user.id,
          title: 'Welcome to Escualo Workspace',
          content: `# Welcome to Escualo Workspace\n\nYour personal document vault is now connected live to Supabase Auth & Postgres!\n\n## Get Started\n- [ ] Create a new note using the sidebar "New Note" button.\n- [ ] Write rich GitHub Flavored Markdown.\n- [ ] Use format tools at the top to accelerate styling.\n\nEnjoy editing with speeds.`,
          tags: ['welcome', 'guide'],
          is_snippet: false,
        };

        const { data: seedData, error: seedError } = await supabase
          .from('notes')
          .insert([welcomeDoc])
          .select()
          .single();

        if (!seedError && seedData) {
          const seededNote: NoteItem = {
            id: seedData.id,
            title: seedData.title,
            content: seedData.content,
            tags: seedData.tags || [],
            updatedAt: 'Just now',
            snippetCode: seedData.snippet_code || undefined,
            isSnippet: seedData.is_snippet || false,
          };
          setNotes([seededNote]);
          setSelectedNote(seededNote);
        } else {
          setNotes([]);
          setSelectedNote(null);
        }
      }
    } catch (err) {
      console.error('Unexpected error during notes fetch:', err);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  // Sync Supabase Auth session status
  useEffect(() => {
    const syncSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session sync failed:', error);
        return;
      }
      
      if (session?.user) {
        setCurrentUser({
          isAuthenticated: true,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          plan: 'pro',
          id: session.user.id
        });
        setCurrentView(prev => (prev === 'landing' || prev === 'login') ? 'dashboard' : prev);
      } else {
        setCurrentUser({
          isAuthenticated: false,
          email: '',
          fullName: '',
          plan: 'free'
        });
        setCurrentView(prev => (prev === 'dashboard' || prev === 'editor') ? 'login' : prev);
      }
    };

    syncSession();

    // Setup authenticating listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          isAuthenticated: true,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          plan: 'pro',
          id: session.user.id
        });
      } else {
        setCurrentUser({
          isAuthenticated: false,
          email: '',
          fullName: '',
          plan: 'free'
        });
        setCurrentView(prev => (prev === 'dashboard' || prev === 'editor') ? 'login' : prev);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user notes when authenticated state transitions to true
  useEffect(() => {
    if (currentUser.isAuthenticated) {
      fetchNotes();
    } else {
      setNotes([]);
      setSelectedNote(null);
    }
  }, [currentUser.isAuthenticated]);

  // Navigate to screen with authorization guards if required
  const handleNav = async (view: ActiveView) => {
    if (view === 'dashboard' || view === 'editor') {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCurrentView('login');
      } else {
        setCurrentView(view);
      }
    } else {
      setCurrentView(view);
    }
  };

  const handleLoginSuccess = (user: UserState) => {
    setCurrentUser(user);
  };

  const handleSelectNote = (note: NoteItem) => {
    setSelectedNote(note);
    handleNav('editor');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser({
      isAuthenticated: false,
      email: '',
      fullName: '',
      plan: 'free'
    });
    setNotes([]);
    setSelectedNote(null);
    setCurrentView('landing');
  };

  const handleUpdateNote = async (updatedNote: NoteItem) => {
    // Optimistic client update first
    setNotes(prevNotes => 
      prevNotes.map(n => n.id === updatedNote.id ? updatedNote : n)
    );
    if (selectedNote && selectedNote.id === updatedNote.id) {
      setSelectedNote(updatedNote);
    }

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: updatedNote.title,
          content: updatedNote.content,
          tags: updatedNote.tags,
          is_snippet: updatedNote.isSnippet || false,
          snippet_code: updatedNote.snippetCode || null,
        })
        .eq('id', updatedNote.id);

      if (error) {
        console.error('Error updating note in database:', error);
      }
    } catch (err) {
      console.error('Update save failed:', err);
    }
  };

  const handleCreateNewNote = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      alert("로그인이 필요합니다.");
      return;
    }

    // Free plan maximum 3 notes limit check with live DB verification
    if (currentUser.plan === 'free') {
      try {
        const { count, error: countError } = await supabase
          .from('notes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);

        if (countError) {
          console.error('Error querying note limit count:', countError);
        } else if (count !== null && count >= 3) {
          setShowUpgradeModal(true);
          return;
        }
      } catch (err) {
        console.error('Failed to validate note limit:', err);
      }
    }

    const newDbNote = {
      user_id: session.user.id,
      title: 'New Workspace Document',
      content: '# New Workspace Document\n\nStart coding or writing here...\n\n- [ ] Double-click formatting tools at top\n- [ ] Drag files to attachments side panel\n- [ ] Write rich GitHub Markdown codes.',
      tags: ['draft'],
      is_snippet: false,
    };

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([newDbNote])
        .select()
        .single();

      if (error) {
        console.error('Error creating note in database:', error);
        alert('노트 저장 실패: ' + error.message);
        return;
      }

      if (data) {
        const createdNote: NoteItem = {
          id: data.id,
          title: data.title,
          content: data.content,
          tags: data.tags || [],
          updatedAt: 'Just now',
          snippetCode: data.snippet_code || undefined,
          isSnippet: data.is_snippet || false,
        };

        setNotes(prevNotes => [createdNote, ...prevNotes]);
        setSelectedNote(createdNote);
        handleNav('editor');
      }
    } catch (err: any) {
      console.error('Creation workspace document failed:', err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const remainingArr = notes.filter(n => n.id !== noteId);
    setNotes(remainingArr);

    if (selectedNote && selectedNote.id === noteId) {
      if (remainingArr.length > 0) {
        setSelectedNote(remainingArr[0]);
      } else {
        setSelectedNote(null);
      }
    }

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        console.error('Error deleting note in database:', error);
        alert('노트 삭제 실패: ' + error.message);
        fetchNotes(); // Re-fetch on sync mismatch
      }
    } catch (err) {
      console.error('Deletion request failed:', err);
    }
  };

  const handleSelectPlan = (plan: 'free' | 'pro' | 'enterprise') => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      plan: plan,
      isAuthenticated: true // Auto log in on choosing a plan for seamless checkout
    }));
  };

  return (
    <>
      {currentView === 'landing' && (
        <LandingPage onNavigate={handleNav} />
      )}
      {currentView === 'pricing' && (
        <PricingPage onNavigate={handleNav} onSelectPlan={handleSelectPlan} />
      )}
      {currentView === 'login' && (
        <LoginPage onNavigate={handleNav} onLoginSuccess={handleLoginSuccess} />
      )}
      {currentView === 'dashboard' && (
        <DashboardView 
          user={currentUser} 
          notes={notes}
          onNavigate={handleNav} 
          onSelectNote={handleSelectNote} 
          onCreateNewNote={handleCreateNewNote}
          onDeleteNote={handleDeleteNote}
          onLogout={handleLogout}
        />
      )}
      {currentView === 'payment-confirmation' && (
        <PaymentConfirmView onNavigate={handleNav} />
      )}
      {currentView === 'editor' && (
        <NoteEditorView 
          user={currentUser}
          activeNote={selectedNote || {
            id: 'temp-loading',
            title: 'No Active Note',
            content: '# No Active Note\n\nCreate a new document, or click a note from your sidebar list.',
            tags: ['status'],
            updatedAt: 'Just now'
          }}
          notes={notes}
          onNavigate={handleNav}
          onUpdateNote={handleUpdateNote}
          onLogout={handleLogout}
          onCreateNewNote={handleCreateNewNote}
        />
      )}
      {currentView === 'account' && (
        <AccountInfoView 
          user={currentUser}
          onNavigate={handleNav}
          onLogout={handleLogout}
          onUpdateUser={(updatedFields) => {
            setCurrentUser(prev => ({
              ...prev,
              ...updatedFields
            }));
          }}
          onCreateNewNote={handleCreateNewNote}
        />
      )}

      {showUpgradeModal && (
        <div id="upgrade-limit-modal" className="fixed inset-0 bg-black/85 backdrop-blur-xs flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#121215] border border-[#27272a] rounded-xl max-w-sm w-full p-6 shadow-2xl relative select-none">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-4">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-semibold text-white tracking-tight mb-2">Plan Limit Reached</h3>
              <p className="text-[#a1a1aa] text-xs leading-relaxed mb-6">
                Free plan limit reached. Upgrade to Pro to create unlimited notes.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                <button 
                  onClick={() => {
                    setShowUpgradeModal(false);
                    handleNav('pricing');
                  }}
                  className="flex-grow bg-brand-primary text-[#0a0012] font-semibold text-xs py-2 px-4 rounded-lg hover:opacity-95 transition-opacity cursor-pointer text-center"
                >
                  Upgrade to Pro
                </button>
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-grow bg-[#1c1c1f] text-[#e4e4e7] border border-[#27272a] font-medium text-xs py-2 px-4 rounded-lg hover:bg-[#27272a] transition-all cursor-pointer text-center"
                >
                  Stay on Free
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
