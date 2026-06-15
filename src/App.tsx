import React, { useState, useEffect } from 'react';
import { NoteItem, ActiveView, UserState } from './types';
import { supabase } from './lib/supabase';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import LoginPage from './components/LoginPage';
import DashboardView from './components/DashboardView';
import PaymentConfirmView from './components/PaymentConfirmView';
import NoteEditorView from './components/NoteEditorView';

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

  const [notes, setNotes] = useState<NoteItem[]>(DEFAULT_NOTES);
  const [selectedNote, setSelectedNote] = useState<NoteItem>(DEFAULT_NOTES[0]);

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
          plan: 'pro'
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
          plan: 'pro'
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
    setCurrentView('landing');
  };

  const handleUpdateNote = (updatedNote: NoteItem) => {
    setNotes(prevNotes => 
      prevNotes.map(n => n.id === updatedNote.id ? updatedNote : n)
    );
    if (selectedNote.id === updatedNote.id) {
      setSelectedNote(updatedNote);
    }
  };

  const handleCreateNewNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'New Workspace Document',
      content: '# New Workspace Document\n\nStart coding or writing here...\n\n- [ ] Double-click formatting tools at top\n- [ ] Drag files to attachments side panel\n- [ ] Write rich GitHub Markdown codes.',
      tags: ['draft'],
      updatedAt: 'Just now'
    };

    setNotes(prevNotes => [newNote, ...prevNotes]);
    setSelectedNote(newNote);
    handleNav('editor');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
    // If deleted current active note, replace with first index or index 0
    if (selectedNote.id === noteId) {
      const remainingArr = notes.filter(n => n.id !== noteId);
      if (remainingArr.length > 0) {
        setSelectedNote(remainingArr[0]);
      }
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
          activeNote={selectedNote}
          notes={notes}
          onNavigate={handleNav}
          onUpdateNote={handleUpdateNote}
          onLogout={handleLogout}
          onCreateNewNote={handleCreateNewNote}
        />
      )}
    </>
  );
}
