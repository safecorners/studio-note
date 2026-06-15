import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, FileText, Edit2, User, LogOut, Upload, FileCode, FileImage, 
  FileCheck, File, Bold, Italic, Strikethrough, Code, Link as LinkIcon, 
  Quote, List as ListIcon, Save, Heart, Sparkles, Eye, Share2, Globe, ArrowLeft
} from 'lucide-react';
import { ActiveView, NoteItem, AttachmentItem, UserState } from '../types';

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
  const [saveStatus, setSaveStatus] = useState('Saved just now');
  const [isDragOver, setIsDragOver] = useState(false);

  // Line calculations for Raw Editor
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);

  // Initial Attachments list
  const [attachments, setAttachments] = useState<AttachmentItem[]>([
    { id: 'att-1', name: 'architecture_v2.png', size: '1.2 MB', type: 'image', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUpYGNX8N9xYT1tFLlDzJz7Vxt4ZwyCCxrORQ29DQ5L_V68eQq3GD3tjhrIuFWpPghihD-Yh2ARFAP76VftpPjN9ZgjL88Xizx9NJaiqgvnFGNFEv_8p_VV26Y2nULeDhxWRfFlQ8EzH_mxleufPwivexrkNYQfT0bSoKP6tj43hhYeT7OJjqgWAzVQetRkxRIbJBqOFe5yMcfhwAIEGp2i-pzjirhB6cYJ0XkKbPJIjIyzUjty1lHr3CXzJQTLNlQZ6JnOIK_cvRt' },
    { id: 'att-2', name: 'db_schema.jpg', size: '840 KB', type: 'image', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmSZMhHFJPrmkepkUCBpaNfKWCmsFsWe4ySvOygd16ansr6zF8EPMjUmCjZuz7u1Z5w9yL619kolwk8pc55xhLx80kMqxFI6EnyeNBjpplcy8NK66ePMGsY_PlnXcnegoQ8P96HB9-p1R2a2ubZoGfgZ8lY14wd3lHFmmr6BNNqBGinje4zj-51q2SavHBVYlMb8BVSwym5kUxgkG1CGCHRYzv2mNAVTq8ucM5--fIO52aIfefiS-BxWRK30o_5pEQJdJ03SU80mH6' },
    { id: 'att-3', name: 'api_spec_final.pdf', size: '3.4 MB', type: 'document', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_OpFNHphFa91I02KVosm-6ObwlHZr6pYUDHGUtTd4PkvWskwlAXJlfj2Lwiv5cb8ZqoVtT2sy4ywBfBDdm3Q53bizz08NqYWJWNbCUq1CtPLxl_R42ucdmdAJAa7PwYvbAR-Ch2jGtw4-b14vCqKiFqPe6YTDJvDVWF2drlqkFbpB_h613oT_G6w6eUh7ZZs1KQPLLJfYkM3g5hxZSfJU-gKQ7e_BKYu5QXldBxcEkVqa0ctFyRLK4O2MToLO69uRVg8WwZTxliPl' },
    { id: 'att-4', name: 'auth_middleware.ts', size: '4 KB', type: 'snippet', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAO-34cLmxj2D117O5Z9JxXYLDzH9gNLQXsqQSESrQP5Yq1TBuFlAb92EVixtyX3DaScY7tA8Npe71SIN4Y8PUIdFEXg8N0-KkHhSKtCOjAUTb9LT5TPJYvxsagoYW5Qet_yWaR-sgb_Ks7BsOR9jbD36TejDIKQLWC8QxeOXx5wbyv_m3omw_Lah5bEj3Cd1vHJSCsY7SmJ-CkB8JkHOpsObeUryhjMTywpGjcBtIaGzCMhtiaEouYVjSXuGciG19XX7qWH3mXallE', active: true }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync content state on note change
  useEffect(() => {
    setEditorTitle(activeNote.title);
    setEditorContent(activeNote.content);
    setSaveStatus('Saved');
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
    setSaveStatus('Saving changes...');
    
    // Bubble up state update
    onUpdateNote({
      ...activeNote,
      title: editorTitle,
      content: value,
      updatedAt: 'Just now'
    });

    setTimeout(() => {
      setSaveStatus('Saved just now');
    }, 600);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditorTitle(value);
    setSaveStatus('Saving changes...');

    onUpdateNote({
      ...activeNote,
      title: value,
      content: editorContent,
      updatedAt: 'Just now'
    });

    setTimeout(() => {
      setSaveStatus('Saved just now');
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

  // Upload Simulation
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processUploadedFile = (file: File) => {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const newAttachment: AttachmentItem = {
      id: `att-${Date.now()}`,
      name: file.name,
      size: `${sizeInMB} MB`,
      type: file.type.includes('image') ? 'image' : file.name.endsWith('.ts') || file.name.endsWith('.js') ? 'snippet' : 'document',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoW5W3IooMBL00_Nml2cBTfZ4fvB8BbGU-aaX1_evJr0eNcYGmd6uEmnxFlWPGuUBB7ARRUeuf5CLRGGC7tP_xgnvrritNxNJOVCVvmXvavZHiZx7xyI5kvweTWEsaFNWaXveMT7fNaXI2XJiElthE-DBcQkAUmRoaUxZl04K2mx06Z5DAdCl1Gq837G4WmO5qszmuF_vzx-7aM9zXkKHXtG11UPojaamsbeCAi6Qw1eF11wXL_zlYL4OV-d8FGfXwTab9220M5B22',
    };

    setAttachments([newAttachment, ...attachments]);
    alert(`File processed into workspace Attachments:\nFilename: ${file.name}\nSize: ${sizeInMB} MB\nType: ${file.type}`);
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
            <div className="text-[10px] text-brand-accent font-mono uppercase font-semibold">Pro Plan Active</div>
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
            Home Directory
          </button>

          {/* Active note editor */}
          <button 
            id="editor-rail-editor"
            className="flex items-center gap-3 w-full text-left bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-lg px-4 py-2.5 font-semibold transition-all scale-[0.98]"
          >
            <FileText className="w-4 h-4 shrink-0 text-brand-primary" />
            Note Editor
          </button>

          {/* create new blank note */}
          <button 
            id="editor-rail-create"
            onClick={onCreateNewNote}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer"
          >
            <Edit2 className="w-4 h-4 shrink-0" />
            Create Note
          </button>

          {/* account session */}
          <button 
            onClick={() => { alert(`Username: ${user.fullName}\nEmail Details: ${user.email}`); }}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#18181b] hover:text-white transition-all rounded-lg px-4 py-2.5 cursor-pointer"
          >
            <User className="w-4 h-4 shrink-0" />
            Account Config
          </button>
        </div>

        {/* footer actions */}
        <div className="mt-auto pt-4 border-t border-[#27272a] space-y-4">
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full text-left text-[#a1a1aa] hover:bg-[#520000]/20 hover:text-red-400 transition-all rounded-lg px-4 py-2 font-semibold text-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500 shrink-0" />
            Logout session
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
            Attachments Folder
          </h3>
          <button 
            id="btn-upload-file"
            onClick={handleFileClick}
            className="w-6 h-6 rounded flex items-center justify-center text-[#a1a1aa] hover:bg-[#121215] hover:text-brand-primary transition-colors cursor-pointer" 
            title="Upload Local File"
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
        <div className="p-3 flex flex-col gap-1 flex-1 overflow-y-auto">
          
          {/* Drag block overlay descriptor */}
          {isDragOver && (
            <div className="bg-brand-primary/10 border border-brand-primary/30 p-4 rounded-lg text-center text-xs text-brand-primary animate-pulse select-none">
              Drop file to upload
            </div>
          )}

          {/* Segment: IMAGES */}
          <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mb-1 px-2 mt-2">Images</div>
          
          {attachments.filter(a => a.type === 'image').map(att => (
            <div 
              key={att.id}
              onClick={() => handleAttachmentClick(att)}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#121215] cursor-pointer transition-colors group"
              title="Click to insert reference tag"
            >
              <div className="w-7 h-7 rounded border border-[#27272a] bg-[#121215] overflow-hidden shrink-0 flex items-center justify-center">
                <img 
                  src={att.url} 
                  alt={att.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                />
              </div>
              <div className="flex flex-col overflow-hidden leading-none">
                <span className="text-xs text-[#a1a1aa] group-hover:text-white truncate font-medium max-w-[120px]">{att.name}</span>
                <span className="text-[9px] text-[#71717a] font-mono mt-0.5">{att.size}</span>
              </div>
            </div>
          ))}

          {/* Segment: DOCUMENTS */}
          <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mb-1 px-2 mt-4">Documents</div>
          {attachments.filter(a => a.type === 'document').map(att => (
            <div 
              key={att.id}
              onClick={() => handleAttachmentClick(att)}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#121215] cursor-pointer transition-colors group"
              title="Click to insert file reference"
            >
              <div className="w-7 h-7 rounded border border-[#27272a] bg-[#121215] overflow-hidden shrink-0 flex items-center justify-center text-[#71717a] group-hover:text-brand-primary">
                <File className="w-4 h-4" />
              </div>
              <div className="flex flex-col overflow-hidden leading-none">
                <span className="text-xs text-[#a1a1aa] group-hover:text-white truncate font-medium max-w-[120px]">{att.name}</span>
                <span className="text-[9px] text-[#71717a] font-mono mt-0.5">{att.size}</span>
              </div>
            </div>
          ))}

          {/* Segment: SNIPPETS */}
          <div className="text-[10px] font-bold text-[#71717a] uppercase tracking-wider mb-1 px-2 mt-4">Snippets</div>
          {attachments.filter(a => a.type === 'snippet').map(att => (
            <div 
              key={att.id}
              onClick={() => handleAttachmentClick(att)}
              className={`flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer transition-colors relative overflow-hidden ${
                att.active 
                  ? 'bg-[#18181b] border border-[#27272a]' 
                  : 'hover:bg-[#121215] group'
              }`}
              title="Click to insert snippet tag"
            >
              {att.active && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-primary"></div>}
              <div className={`w-7 h-7 rounded border overflow-hidden shrink-0 flex items-center justify-center ${
                att.active 
                  ? 'border-brand-primary/25 bg-[#121215] text-brand-primary' 
                  : 'border-[#27272a] bg-[#121215] text-[#71717a] group-hover:text-brand-primary'
              }`}>
                <FileCode className="w-4 h-4" />
              </div>
              <div className="flex flex-col overflow-hidden leading-none">
                <span className={`text-xs truncate font-medium max-w-[120px] ${
                  att.active ? 'text-white' : 'text-[#a1a1aa] group-hover:text-white'
                }`}>{att.name}</span>
                <span className="text-[9.5px] text-brand-primary font-semibold font-mono mt-0.5">Active</span>
              </div>
            </div>
          ))}

        </div>

        {/* Drag and drop interactive drawer indicator */}
        <div className="p-3 shrink-0 border-t border-[#27272a] select-all">
          <div className="bg-[#121215] rounded-lg p-2.5 text-center text-[10px] text-[#71717a] leading-relaxed select-all">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary mx-auto mb-1 animate-bounce" />
            <span className="text-white font-medium block">Drag files anywhere here</span>
            or click "+" above.
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
              title="Return Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <input 
              type="text" 
              value={editorTitle}
              onChange={handleTitleChange}
              placeholder="Untitled Document" 
              className="w-full max-w-sm bg-transparent border-none text-white font-bold text-base tracking-tight focus:ring-0 focus:outline-none placeholder:text-[#52525b] p-0 font-sans cursor-text"
            />
          </div>

          {/* Formatting command widgets */}
          <div className="hidden lg:flex items-center bg-[#121215] rounded-lg p-1 border border-[#27272a] shadow-inner mr-4">
            <button 
              onClick={() => injectMarkdown('bold')}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer" 
              title="Bold text"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => injectMarkdown('italic')}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer" 
              title="Italic text"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => injectMarkdown('strikethrough')}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer" 
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
            
            <div className="w-px h-4 bg-[#27272a] mx-1"></div>
            
            <button 
              onClick={() => injectMarkdown('code')}
              className="w-7 h-7 rounded flex items-center justify-center bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary/20 transition-colors shadow-sm cursor-pointer" 
              title="Code fencing block"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => injectMarkdown('link')}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer" 
              title="Insert URL Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => injectMarkdown('quote')}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer" 
              title="Blockquote paragraph"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            
            <div className="w-px h-4 bg-[#27272a] mx-1"></div>
            
            <button 
              onClick={() => injectMarkdown('list')}
              className="w-7 h-7 rounded flex items-center justify-center hover:bg-[#27272a] text-[#a1a1aa] hover:text-white transition-colors cursor-pointer" 
              title="Bulleted checklist item"
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
              onClick={() => { alert(`Public access link simulated:\nhttps://escualo.cloud/notes/share/${activeNote.id}`); }}
              className="h-8 px-3.5 rounded-lg text-xs font-semibold border border-[#27272a] text-[#a1a1aa] hover:text-white hover:bg-[#121215] transition-all cursor-pointer"
            >
              Share
            </button>
            <button 
              onClick={() => { alert(`Document published successfully to Escualo Hub:\nTitle: ${activeNote.title}`); }}
              className="h-8 px-3.5 rounded-lg bg-brand-primary hover:bg-[#bbf7d0] hover:text-[#001a12] text-[#0a0012] text-xs font-bold transition-all shadow-[0_0_10px_rgba(167,139,250,0.2)] focus:ring-1 focus:ring-brand-primary cursor-pointer active:scale-95"
            >
              Publish
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
              RAW SOURCE
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
              placeholder="Start coding or typing Markdown macros..." 
              className="w-full h-full bg-transparent border-none outline-none resize-none focus:outline-none focus:ring-0 text-white font-mono text-xs leading-[18.2px] py-6 px-6 placeholder-[#27272a] cursor-text"
            />
          </div>

          {/* High contrast Obsidian render live output preview (RIGHT) */}
          <div className="w-1/2 h-full bg-[#0c0c0f] overflow-y-auto p-6 md:p-8 border-l border-[#27272a] select-text">
            
            {/* Live indicator check pill */}
            <div className="flex items-center gap-1.5 mb-6 text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/10 border border-brand-primary/20 w-max px-2 py-0.5 rounded-full select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
              <span>Obsidian live compilation preview</span>
            </div>

            {/* Rendered HTML container */}
            <div className="prose prose-invert prose-xs select-text selection:bg-brand-primary/40 leading-relaxed font-sans text-xs">
              {renderFormattedMarkdown(editorContent)}
            </div>

            {/* Empty editor guide helper */}
            {!editorContent.trim() && (
              <div className="text-center py-20 opacity-40 select-none">
                <FileCheck className="w-8 h-8 mx-auto text-[#71717a] mb-2" />
                <span className="text-xs text-[#a1a1aa] block font-sans">Live compiled output will appear here.</span>
              </div>
            )}
          </div>

        </div>

        {/* Secondary warning guidance for smaller screens */}
        <div id="device-warning" className="lg:hidden absolute bottom-4 right-4 bg-[#121215] border border-[#27272a] p-2.5 rounded-lg text-center text-[10px] text-brand-primary shadow-lg max-w-xs block select-none">
          Use desktop screens for side-by-side splits.
        </div>

      </div>
    </div>
  );
}
