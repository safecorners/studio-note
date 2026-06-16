import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, FileText, Edit2, User, LogOut, Upload, FileCode, FileImage, 
  FileCheck, File, Bold, Italic, Strikethrough, Code, Link as LinkIcon, 
  Quote, List as ListIcon, Save, Heart, Sparkles, Eye, Share2, Globe, ArrowLeft,
  Trash2, Loader2
} from 'lucide-react';
import { ActiveView, NoteItem, AttachmentItem, UserState } from '../types';
import { supabase } from '../lib/supabase';

interface NoteEditorViewProps {
  user: UserState;
  activeNote: NoteItem;
  notes: NoteItem[];
  onNavigate: (view: ActiveView) => void;
  onUpdateNote: (updatedNote: NoteItem) => void;
  onLogout: () => void;
  onCreateNewNote: () => void;
}

export default function NoteEditorView({ 
  user, 
  activeNote, 
  notes, 
  onNavigate, 
  onUpdateNote, 
  onLogout,
  onCreateNewNote
}: NoteEditorViewProps) {
  
  // Mutable editor contents
  const [editorTitle, setEditorTitle] = useState(activeNote.title);
  const [editorContent, setEditorContent] = useState(activeNote.content);
  const [saveStatus, setSaveStatus] = useState('방금 저장됨');
  const [isDragOver, setIsDragOver] = useState(false);

  // Line calculations for Raw Editor
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);

  // Initial Attachments list fetched from Supabase
  const [attachments, setAttachments] = useState<(AttachmentItem & { storagePath?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync content state on note change
  useEffect(() => {
    setEditorTitle(activeNote.title);
    setEditorContent(activeNote.content);
    setSaveStatus('저장됨');
  }, [activeNote]);

  // Recalculate physical line counts
  useEffect(() => {
    const lines = editorContent.split('\n');
    const counts = lines.map((_, index) => index + 1);
    setLineNumbers(counts.length > 0 ? counts : [1]);
  }, [editorContent]);

  // Handle mutable updates
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setEditorContent(value);
    setSaveStatus('변경 사항 저장 중...');
    
    // Bubble up state update
    onUpdateNote({
      ...activeNote,
      title: editorTitle,
      content: value,
      updatedAt: '방금 전'
    });

    setTimeout(() => {
      setSaveStatus('방금 저장됨');
    }, 600);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditorTitle(value);
    setSaveStatus('변경 사항 저장 중...');

    onUpdateNote({
      ...activeNote,
      title: value,
      content: editorContent,
      updatedAt: '방금 전'
    });

    setTimeout(() => {
      setSaveStatus('방금 저장됨');
    }, 600);
  };

  // Simulated Toolbar Commands injection
  const injectMarkdown = (commandType: 'bold' | 'italic' | 'strikethrough' | 'code' | 'link' | 'quote' | 'list') => {
    const textarea = document.getElementById('raw-text-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const startIdx = textarea.selectionStart;
    const endIdx = textarea.selectionEnd;
    const originalText = textarea.value;
    const selectedText = originalText.substring(startIdx, endIdx);

    let prefix = '';
    let suffix = '';

    switch (commandType) {
      case 'bold':
        prefix = '**';
        suffix = '**';
        break;
      case 'italic':
        prefix = '*';
        suffix = '*';
        break;
      case 'strikethrough':
        prefix = '~~';
        suffix = '~~';
        break;
      case 'code':
        prefix = '\n```json\n';
        suffix = '\n```\n';
        break;
      case 'link':
        prefix = '[';
        suffix = '](https://escualo.cloud)';
        break;
      case 'quote':
        prefix = '\n> ';
        suffix = '\n';
        break;
      case 'list':
        prefix = '\n- ';
        suffix = '';
        break;
    }

    const replacement = prefix + (selectedText || 'text') + suffix;
    const newContent = originalText.substring(0, startIdx) + replacement + originalText.substring(endIdx);
    
    setEditorContent(newContent);
    onUpdateNote({
      ...activeNote,
      content: newContent,
      updatedAt: 'Just now'
    });

    // Reset cursor focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startIdx + prefix.length, startIdx + prefix.length + (selectedText || 'text').length);
    }, 50);
  };

  // Fetch attachments from database and create signed URLs
  const fetchAttachments = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || user.id;
      if (!currentUserId) {
        setAttachments([]);
        return;
      }

      const { data: dbAttachments, error: dbError } = await supabase
        .from('attachments')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });

      if (dbError) {
        // If table doesn't exist yet, simply fall back to empty state
        console.warn('Error or missing attachments table in Supabase:', dbError);
        setAttachments([]);
        return;
      }

      if (dbAttachments && dbAttachments.length > 0) {
        const mappedAttachments = await Promise.all(
          dbAttachments.map(async (att: any) => {
            try {
              const { data: signedData, error: signedError } = await supabase
                .storage
                .from('app-files')
                .createSignedUrl(att.storage_path, 3600);

              return {
                id: att.id,
                name: att.name,
                size: att.size,
                type: att.type as 'image' | 'document' | 'snippet',
                url: signedData?.signedUrl || '',
                storagePath: att.storage_path
              };
            } catch (err) {
              console.error('Error generating signed URL:', err);
              return {
                id: att.id,
                name: att.name,
                size: att.size,
                type: att.type as 'image' | 'document' | 'snippet',
                url: '',
                storagePath: att.storage_path
              };
            }
          })
        );
        setAttachments(mappedAttachments);
      } else {
        setAttachments([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching attachments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [activeNote.id, user.id]);

  // Upload Handling with Supabase Storage & Profiles/Attachments Table Integration
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processUploadedFile = async (file: File) => {
    setIsUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || user.id;

      if (!currentUserId) {
        alert("로그인이 필요합니다. 파일을 업로드하려면 먼저 로그인해 주세요.");
        return;
      }

      // Naming format constraints: ${auth.uid()}/notes/${itemId}/${uuid}.${extension}
      const featureName = 'notes';
      const itemId = activeNote.id || 'general';
      const uuidStr = Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      const extension = file.name.split('.').pop() || 'bin';
      const storagePath = `${currentUserId}/${featureName}/${itemId}/${uuidStr}.${extension}`;

      // 1. Upload to Supabase Storage Bucket ('app-files')
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('app-files')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading to private store bucket:', uploadError);
        alert('파일 스토리지 업로드 실패: ' + uploadError.message);
        return;
      }

      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      const displaySize = `${sizeInMB} MB`;
      const fileType = file.type.includes('image') 
        ? 'image' 
        : (file.name.endsWith('.ts') || file.name.endsWith('.js') || file.name.endsWith('.tsx') || file.name.endsWith('.json')) ? 'snippet' : 'document';

      // 2. Insert record details in database table "attachments"
      const newDbRecord = {
        user_id: currentUserId,
        note_id: activeNote.id !== 'temp-loading' ? activeNote.id : null,
        name: file.name,
        size: displaySize,
        type: fileType,
        storage_path: storagePath
      };

      const { data: dbData, error: dbError } = await supabase
        .from('attachments')
        .insert([newDbRecord])
        .select()
        .single();

      if (dbError) {
        console.error('Error record database inserts:', dbError);
        // Rollback uploaded file if DB references insert failed to avoid orphaned data
        await supabase.storage.from('app-files').remove([storagePath]);
        alert('첨부파일 DB 정보 저장 실패: ' + dbError.message);
        return;
      }

      // 3. Request a signed URL for client previewing
      const { data: signedData } = await supabase
        .storage
        .from('app-files')
        .createSignedUrl(storagePath, 3600);

      const newAttachment = {
        id: dbData.id,
        name: dbData.name,
        size: dbData.size,
        type: dbData.type as 'image' | 'document' | 'snippet',
        url: signedData?.signedUrl || '',
        storagePath: dbData.storage_path
      };

      setAttachments(prev => [newAttachment, ...prev]);
    } catch (err: any) {
      console.error('File operation processing error:', err);
      alert('파일 처리 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (att: AttachmentItem & { storagePath?: string }, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid appending attachment tag on delete click

    if (!window.confirm(`첨부파일 "${att.name}" 데이터를 영구적으로 삭제하시겠습니까?`)) {
      return;
    }

    try {
      // 1. Storage bucket delete
      if (att.storagePath) {
        const { error: storageError } = await supabase
          .storage
          .from('app-files')
          .remove([att.storagePath]);

        if (storageError) {
          console.error('Error removing file storage bucket:', storageError);
        }
      }

      // 2. DB table rows delete
      const { error: dbError } = await supabase
        .from('attachments')
        .delete()
        .eq('id', att.id);

      if (dbError) {
        console.error('Error removing attachment DB row rows:', dbError);
        alert('첨부파일 데이터베이스 삭제 실패: ' + dbError.message);
        return;
      }

      // 3. State update
      setAttachments(prev => prev.filter(item => item.id !== att.id));
    } catch (err: any) {
      console.error('Deletion error occurred:', err);
      alert('파일 삭제 과정 중 오류 발생: ' + err.message);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file) {
        processUploadedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file) {
        processUploadedFile(file);
      }
    }
  };

  const handleAttachmentClick = (att: AttachmentItem) => {
    // Append the selected attachment as a tag into the markdown cursor!
    const textarea = document.getElementById('raw-text-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const startIdx = textarea.selectionStart;
    const originalText = textarea.value;
    
    // format as markdown reference
    const attachmentRef = att.type === 'image' 
      ? `\n![[${att.name}]]`
      : `\n[[${att.name}]]\n`;

    const newContent = originalText.substring(0, startIdx) + attachmentRef + originalText.substring(startIdx);
    setEditorContent(newContent);
    onUpdateNote({
      ...activeNote,
      content: newContent,
      updatedAt: 'Just now'
    });
  };

  // Extremely professional, custom-styled inline markdown preview parser
  const renderFormattedMarkdown = (rawText: string) => {
    const lines = rawText.split('\n');
    let insideCodeBlock = false;
    let codeContent: string[] = [];

    return lines.map((line, idx) => {
      // Manage triple-bracket code fencing
      if (line.trim().startsWith('```')) {
        if (insideCodeBlock) {
          insideCodeBlock = false;
          const key = `code-${idx}`;
          const finalCode = codeContent.join('\n');
          codeContent = [];
          return (
            <pre key={key} className="bg-[#0c0c0f] border border-[#27272a] p-4 rounded-lg my-3 font-mono text-xs text-brand-accent overflow-x-auto select-text">
              <code>{finalCode}</code>
            </pre>
          );
        } else {
          insideCodeBlock = true;
          return null; // Don't show fence line
        }
      }

      if (insideCodeBlock) {
        codeContent.push(line);
        return null;
      }

      // 1. Headers
      if (line.trim().startsWith('# ')) {
        return <h1 key={idx} className="text-xl font-bold text-white mt-6 mb-2 tracking-tight border-b border-[#27272a] pb-1 font-sans">{line.replace('# ', '')}</h1>;
      }
      if (line.trim().startsWith('## ')) {
        return <h2 key={idx} className="text-base font-semibold text-white mt-5 mb-2 tracking-tight font-sans">{line.replace('## ', '')}</h2>;
      }
      if (line.trim().startsWith('### ')) {
        return <h3 key={idx} className="text-sm font-semibold text-brand-primary mt-4 mb-1.5 font-sans">{line.replace('### ', '')}</h3>;
      }

      // 2. Blockquotes
      if (line.trim().startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-3 border-brand-primary pl-4 py-1 text-xs text-[#71717a] italic my-3 leading-relaxed font-sans bg-[#121215]/30">
            {line.replace('> ', '')}
          </blockquote>
        );
      }

      // 3. Checklist checkboxes (e.g. - [x] task / - [ ] task)
      if (line.trim().startsWith('- [x] ') || line.trim().startsWith('- [X] ')) {
        return (
          <div key={idx} className="flex items-center gap-2.5 text-xs text-[#a1a1aa] my-1.5 font-sans pl-2 line-through opacity-60">
            <input type="checkbox" checked={true} readOnly className="rounded border-[#27272a] text-brand-primary focus:ring-0 bg-[#0c0c0f] w-3.5 h-3.5 cursor-default" />
            <span>{line.replace('- [x] ', '').replace('- [X] ', '')}</span>
          </div>
        );
      }
      if (line.trim().startsWith('- [ ] ')) {
        return (
          <div key={idx} className="flex items-center gap-2.5 text-xs text-[#a1a1aa] my-1.5 font-sans pl-2">
            <input type="checkbox" checked={false} readOnly className="rounded border-[#27272a] text-brand-primary focus:ring-0 bg-[#0c0c0f] w-3.5 h-3.5 cursor-default" />
            <span>{line.replace('- [ ] ', '')}</span>
          </div>
        );
      }

      // 4. Bullet lists
      if (line.trim().startsWith('- ')) {
        return (
          <li key={idx} className="text-xs text-[#a1a1aa] leading-relaxed my-1 list-disc list-inside pl-2 font-sans">
            {line.substring(2)}
          </li>
        );
      }

      // 5. Embedded custom attachments preview representation ![[file_name.png]] or [[file.pdf]]
      if (line.trim().includes('![[')) {
        const match = line.match(/!\[\[(.*?)\]\]/);
        if (match && match[1]) {
          const filename = match[1];
          // Locate image url from attachments
          const attItem = attachments.find(a => a.name === filename);
          return (
            <div key={idx} className="my-4 border border-[#27272a] bg-[#121215] p-2.5 rounded-lg max-w-sm overflow-hidden shadow-inner group/preview select-none">
              <div className="text-[10px] text-[#71717a] mb-1 font-mono">{filename} (Live Embedded Link)</div>
              <img 
                src={attItem?.url || "https://lh3.googleusercontent.com/aida-public/AB6AXuAO-34cLmxj2D117O5Z9JxXYLDzH9gNLQXsqQSESrQP5Yq1TBuFlAb92EVixtyX3DaScY7tA8Npe71SIN4Y8PUIdFEXg8N0-KkHhSKtCOjAUTb9LT5TPJYvxsagoYW5Qet_yWaR-sgb_Ks7BsOR9jbD36TejDIKQLWC8QxeOXx5wbyv_m3omw_Lah5bEj3Cd1vHJSCsY7SmJ-CkB8JkHOpsObeUryhjMTywpGjcBtIaGzCMhtiaEouYVjSXuGciG19XX7qWH3mXallE"} 
                alt={filename} 
                referrerPolicy="no-referrer"
                className="w-full h-36 object-cover rounded border border-[#27272a]/60" 
              />
            </div>
          );
        }
      }

      // 6. Generic Paragraph Line Text
      if (line.trim() === '') {
        return <div key={idx} className="h-2"></div>;
      }

      // Styled text formatting like Backticks code tags
      let parsedSegment = line;
      if (line.includes('`')) {
        const segments = line.split('`');
        return (
          <p key={idx} className="text-xs text-[#a1a1aa] leading-relaxed my-1.5 font-sans tracking-wide">
            {segments.map((seg, sIdx) => {
              if (sIdx % 2 === 1) {
                return (
                  <code key={sIdx} className="bg-[#121215] text-[#34d399] px-1.5 py-0.5 rounded border border-[#27272a] font-mono text-[11px] mx-0.5 select-text">
                    {seg}
                  </code>
                );
              }
              return seg;
            })}
          </p>
        );
      }

      return (
        <p key={idx} className="text-xs text-[#a1a1aa] leading-relaxed my-1.5 font-sans tracking-wide select-all">
          {parsedSegment}
        </p>
      );
    });
  };

  return (
    <div id="editor-page-container" className="bg-[#09090b] text-[#fafafa] font-sans h-screen flex overflow-hidden select-none selection:bg-brand-primary/30 selection:text-white">
      
      {/* 1. Left docked navigation bar (Same layout structure as Dashboard side panel) */}
      <nav id="editor-nav-rail" className="hidden md:flex flex-col p-4 shrink-0 bg-[#121215] w-64 border-r border-[#27272a]">
        
        {/* Workspace banner */}
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-brand-primary/10 border border-brand-primary flex items-center justify-center text-xs text-brand-primary font-bold">
            E
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight">Escualo Cloud</div>
            <div className="text-[10px] text-brand-accent font-mono uppercase font-semibold">프로 요금제 활성됨</div>
          </div>
        </div>

        {/* Link navigation */}
        <div className="flex-1 flex flex-col gap-1.5 text-xs">
          
          {/* Home directory link */}
          <button 
            id="editor-rail-home"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer"
          >
            <Home className="w-4 h-4 shrink-0" />
            홈 디렉터리
          </button>

          {/* Active note editor */}
          <button 
            id="editor-rail-editor"
            className="flex items-center gap-3 w-full text-left bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-lg px-4 py-2.5 font-semibold transition-all scale-[0.98]"
          >
            <FileText className="w-4 h-4 shrink-0 text-brand-primary" />
            노트 에디터
          </button>

          {/* create new blank note */}
          <button 
            id="editor-rail-create"
            onClick={onCreateNewNote}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer"
          >
            <Edit2 className="w-4 h-4 shrink-0" />
            노트 만들기
          </button>

          {/* account session */}
          <button 
            onClick={() => { alert(`사용자명: ${user.fullName}\n이메일: ${user.email}`); }}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer"
          >
            <User className="w-4 h-4 shrink-0" />
            계정 정보
          </button>
        </div>

        {/* footer actions */}
        <div className="mt-auto pt-4 border-t border-[#27272a] space-y-4">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#520000]/20 hover:text-red-400 transition-all rounded-lg px-4 py-2 font-semibold text-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500 shrink-0" />
            로그아웃
          </button>
        </div>
      </nav>

      {/* 2. Left contextual navigation Sidebar pane: Attachments with integrated Drag and Drop */}
      <aside 
        id="editor-attachments-sidebar" 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-60 h-full border-r border-[#27272a] bg-[#0c0c0f] flex flex-col shrink-0 transition-colors ${
          isDragOver ? 'bg-brand-primary/5 border-dashed border-brand-primary' : ''
        }`}
      >
        <div className="h-14 border-b border-[#27272a] flex items-center justify-between px-4 shrink-0 bg-[#0c0c0f]">
          <h3 className="font-semibold text-white text-xs tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
            첨부파일 폴더
          </h3>
          <button 
            id="btn-upload-file"
            onClick={handleFileClick}
            className="w-6 h-6 rounded flex items-center justify-center text-[#a1a1aa] hover:bg-[#121215] hover:text-brand-primary transition-colors cursor-pointer" 
            title="로컬 파일 업로드"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          
          {/* Transparent file input trigger */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,.pdf,.ts,.js,.css,.json"
          />
        </div>

        {/* Attachment collection lists */}
        <div className="p-3 flex flex-col gap-1 flex-1 overflow-y-auto select-none">
          
          {/* Drag block overlay descriptor */}
          {isDragOver && (
            <div className="bg-brand-primary/10 border border-brand-primary/30 p-4 rounded-lg text-center text-xs text-brand-primary animate-pulse select-none">
              업로드할 파일을 여기에 놓으세요
            </div>
          )}

          {/* Loading attachments indicator */}
          {isLoading ? (
            <div className="py-8 text-center text-[#71717a] flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">미디어 로딩 중...</span>
            </div>
          ) : (
            <>
              {/* Is currently uploading metadata feedback */}
              {isUploading && (
                <div className="bg-brand-primary/5 border border-brand-primary/20 p-2.5 rounded-lg text-center text-[10px] text-brand-primary animate-pulse mb-3">
                  <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto mb-1" />
                  파일 저장 중...
                </div>
              )}

              {/* Segment: IMAGES */}
              <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mb-1 px-2 mt-2">이미지</div>
              
              {attachments.filter(a => a.type === 'image').length === 0 ? (
                <div className="text-[11px] text-[#52525b] italic px-2 py-1 select-none">업로드된 이미지 없음</div>
              ) : (
                attachments.filter(a => a.type === 'image').map(att => (
                  <div 
                    key={att.id}
                    onClick={() => handleAttachmentClick(att)}
                    className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#121215] cursor-pointer transition-colors group"
                    title="클릭하여 참조 태그 삽입"
                  >
                    <div className="w-7 h-7 rounded border border-[#27272a] bg-[#121215] overflow-hidden shrink-0 flex items-center justify-center">
                      <img 
                        src={att.url} 
                        alt={att.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden leading-none flex-1">
                      <span className="text-xs text-[#a1a1aa] group-hover:text-white truncate font-medium max-w-[100px]">{att.name}</span>
                      <span className="text-[9px] text-[#71717a] font-mono mt-0.5">{att.size}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteAttachment(att, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#f43f5e] hover:bg-[#27272a]/80 hover:text-red-400 rounded cursor-pointer shrink-0"
                      title="첨부파일 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}

              {/* Segment: DOCUMENTS */}
              <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mb-1 px-2 mt-4">문서</div>
              {attachments.filter(a => a.type === 'document').length === 0 ? (
                <div className="text-[11px] text-[#52525b] italic px-2 py-1 select-none">업로드된 문서 없음</div>
              ) : (
                attachments.filter(a => a.type === 'document').map(att => (
                  <div 
                    key={att.id}
                    onClick={() => handleAttachmentClick(att)}
                    className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#121215] cursor-pointer transition-colors group"
                    title="클릭하여 파일 참조 삽입"
                  >
                    <div className="w-7 h-7 rounded border border-[#27272a] bg-[#121215] overflow-hidden shrink-0 flex items-center justify-center text-[#71717a] group-hover:text-brand-primary">
                      <File className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col overflow-hidden leading-none flex-1">
                      <span className="text-xs text-[#a1a1aa] group-hover:text-white truncate font-medium max-w-[100px]">{att.name}</span>
                      <span className="text-[9px] text-[#71717a] font-mono mt-0.5">{att.size}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteAttachment(att, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#f43f5e] hover:bg-[#27272a]/80 hover:text-red-400 rounded cursor-pointer shrink-0"
                      title="첨부파일 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}

              {/* Segment: SNIPPETS */}
              <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mb-1 px-2 mt-4">코드 스니펫</div>
              {attachments.filter(a => a.type === 'snippet').length === 0 ? (
                <div className="text-[11px] text-[#52525b] italic px-2 py-1 select-none">업로드된 스니펫 없음</div>
              ) : (
                attachments.filter(a => a.type === 'snippet').map(att => {
                  const isActive = att.id === 'att-4'; // keep reference pattern matching original mock active block behavior if useful
                  return (
                    <div 
                      key={att.id}
                      onClick={() => handleAttachmentClick(att)}
                      className={`flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer transition-colors relative overflow-hidden group ${
                        isActive 
                          ? 'bg-[#18181b] border border-[#27272a]' 
                          : 'hover:bg-[#121215]'
                      }`}
                      title="클릭하여 스니펫 태그 삽입"
                    >
                      {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-primary"></div>}
                      <div className={`w-7 h-7 rounded border overflow-hidden shrink-0 flex items-center justify-center ${
                        isActive 
                          ? 'border-brand-primary/25 bg-[#121215] text-brand-primary' 
                          : 'border-[#27272a] bg-[#121215] text-[#71717a] group-hover:text-brand-primary'
                      }`}>
                        <FileCode className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col overflow-hidden leading-none flex-1">
                        <span className={`text-xs truncate font-medium max-w-[100px] ${
                          isActive ? 'text-white' : 'text-[#a1a1aa] group-hover:text-white'
                        }`}>{att.name}</span>
                        {isActive && <span className="text-[9.5px] text-brand-primary font-semibold font-mono mt-0.5">활성</span>}
                      </div>
                      <button
                        onClick={(e) => handleDeleteAttachment(att, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#f43f5e] hover:bg-[#27272a]/80 hover:text-red-400 rounded cursor-pointer shrink-0"
                        title="첨부파일 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </>
          )}

        </div>

        {/* Drag and drop interactive drawer indicator */}
        <div className="p-3 shrink-0 border-t border-[#27272a] select-all">
          <div className="bg-[#121215] rounded-lg p-2.5 text-center text-[10px] text-[#71717a] leading-relaxed select-all">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary mx-auto mb-1 animate-bounce" />
            <span className="text-white font-medium block">여기에 파일 리스트 끌어다 놓기</span>
            또는 위의 "+"를 클릭하세요.
          </div>
        </div>
      </aside>

      {/* 3. Editor Core area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#09090b] relative">
        
        {/* Top toolbar commands bar */}
        <header className="h-14 border-b border-[#27272a] bg-[#0c0c0f] flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          
          {/* Note Title Input */}
          <div className="flex items-center gap-3.5 flex-1 select-all">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="lg:hidden p-1.5 rounded-md hover:bg-[#121215] text-[#a1a1aa] hover:text-white"
              title="대시보드로 이동"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <input 
              type="text" 
              value={editorTitle}
              onChange={handleTitleChange}
              placeholder="제목 없는 문서" 
              className="w-full max-w-sm bg-transparent border-none text-white font-bold text-base tracking-tight focus:ring-0 focus:outline-none placeholder:text-[#52525b] p-0 font-sans cursor-text"
            />
          </div>

          {/* Formatting command widgets */}
          <div className="hidden lg:flex items-center bg-[#121215] rounded-lg p-1 border border-[#27272a] shadow-inner mr-4">
            <button 
              onClick={() => injectMarkdown('bold')}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer" 
              title="굵게"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => injectMarkdown('italic')}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer" 
              title="기울임꼴"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => injectMarkdown('strikethrough')}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer" 
              title="취소선"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
            
            <div className="w-px h-4 bg-[#27272a] mx-1"></div>
            
            <button 
              onClick={() => injectMarkdown('code')}
              className="w-7 h-7 rounded flex items-center justify-center bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 transition-colors shadow-sm cursor-pointer" 
              title="코드 블록 삽입"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => injectMarkdown('link')}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer" 
              title="URL 링크 삽입"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => injectMarkdown('quote')}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer" 
              title="인용구 삽입"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            
            <div className="w-px h-4 bg-[#27272a] mx-1"></div>
            
            <button 
              onClick={() => injectMarkdown('list')}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer" 
              title="글머리 기호 목록 삽입"
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary screen header buttons */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#71717a] font-mono tracking-tight mr-1 select-none">
              {saveStatus}
            </span>
            <button 
              onClick={() => { alert(`공유 가능한 외부 링크가 시뮬레이션되었습니다:\nhttps://escualo.cloud/notes/share/${activeNote.id}`); }}
              className="h-8 px-3.5 rounded-lg text-xs font-semibold border border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#121215] transition-all cursor-pointer"
            >
              공유
            </button>
            <button 
              onClick={() => { alert(`문서가 에스쿠알로 허브에 제작 및 게시되었습니다:\n제목: ${activeNote.title}`); }}
              className="h-8 px-3.5 rounded-lg bg-brand-primary hover:bg-[#bbf7d0] hover:text-[#001a12] text-[#0a0012] text-xs font-bold transition-all shadow-[0_0_10px_rgba(167,139,250,0.2)] focus:ring-1 focus:ring-brand-primary cursor-pointer active:scale-95"
            >
              게시
            </button>
          </div>
        </header>

        {/* Side-by-side editing split workspace */}
        <div className="flex-grow flex flex-row overflow-hidden relative">
          
          {/* Central dragging split handle (visual divider) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#27272a] z-20 pointer-events-none"></div>

          {/* Raw Text Box area (LEFT) */}
          <div className="w-1/2 h-full bg-[#09090b] flex flex-row relative group">
            
            {/* Raw code flag marker label */}
            <div className="absolute top-2 right-2 p-1 bg-[#121215] border border-[#27272a] rounded text-[8px] font-mono text-[#71717a] pointer-events-none z-10 select-none opacity-60">
              원본 소스
            </div>

            {/* Simulated Line numbers gutter panel */}
            <div className="w-11 bg-[#0c0c0f] border-r border-[#27272a] text-right py-6 pr-2.5 text-[11px] font-mono text-[#52525b] select-none flex flex-col gap-[3.5px] overflow-hidden shrink-0">
              {lineNumbers.map((num) => (
                <div key={num} className={num === 10 ? "text-brand-primary font-bold" : ""}>
                  {num}
                </div>
              ))}
            </div>

            {/* Editable code text-area container */}
            <textarea 
              id="raw-text-area"
              value={editorContent}
              onChange={handleContentChange}
              spellCheck="false"
              placeholder="여기에 코딩을 시작하거나 마크다운 매크로를 입력하세요..." 
              className="w-full h-full bg-transparent border-none outline-none resize-none focus:outline-none focus:ring-0 text-white font-mono text-xs leading-[18.2px] py-6 px-6 placeholder-[#27272a] cursor-text"
            />
          </div>

          {/* High contrast Obsidian render live output preview (RIGHT) */}
          <div className="w-1/2 h-full bg-[#0c0c0f] overflow-y-auto p-6 md:p-8 border-l border-[#27272a] select-text">
            
            {/* Live indicator check pill */}
            <div className="flex items-center gap-1.5 mb-6 text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/10 border border-brand-primary/20 w-max px-2 py-0.5 rounded-full select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
              <span>옵시디언 실시간 컴파일 프리뷰</span>
            </div>

            {/* Rendered HTML container */}
            <div className="prose prose-invert prose-xs select-text selection:bg-brand-primary/40 leading-relaxed font-sans text-xs">
              {renderFormattedMarkdown(editorContent)}
            </div>

            {/* Empty editor guide helper */}
            {!editorContent.trim() && (
              <div className="text-center py-20 opacity-40 select-none">
                <FileCheck className="w-8 h-8 mx-auto text-[#71717a] mb-2" />
                <span className="text-xs text-[#a1a1aa] block font-sans">실시간 컴파일된 결과가 여기에 표시됩니다.</span>
              </div>
            )}
          </div>

        </div>

        {/* Secondary warning guidance for smaller screens */}
        <div id="device-warning" className="lg:hidden absolute bottom-4 right-4 bg-[#121215] border border-[#27272a] p-2.5 rounded-lg text-center text-[10px] text-brand-primary shadow-lg max-w-xs block select-none">
          좌우 분할 뷰를 보려면 태블릿이나 데스크톱의 큰 화면 형태를 이용해 주세요.
        </div>

      </div>
    </div>
  );
}
