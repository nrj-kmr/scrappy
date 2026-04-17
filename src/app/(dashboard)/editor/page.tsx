'use client';

import { useEffect, useState } from 'react';
import { Play, RefreshCw, Copy, Sparkles, Hash, Check } from 'lucide-react';
import { FaLinkedinIn } from 'react-icons/fa';
import { SiX } from 'react-icons/si';

export default function EditorWorkspace() {
  const [activePlatform, setActivePlatform] = useState<'twitter' | 'hashnode' | 'linkedin'>(
    'twitter'
  );
  const [content, setContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const savedContent = localStorage.getItem('scrappy_current_content');
    if (savedContent) {
      setTimeout(() => {
        setContent(savedContent);
      }, 0);
    }
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    localStorage.setItem('scrappy_current_content', newContent);
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full border border-border rounded-2xl overflow-hidden bg-background shadow-sm">
      {/* Left Panel: The Raw Source */}
      <section className="w-1/2 border-r border-border flex flex-col bg-muted/10 lg:flex">
        {/* Panel Header */}
        <div className="bg-muted/30 backdrop-blur-md px-6 py-3 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
              Workspace Context
            </span>
          </div>
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Sync
          </button>
        </div>

        {/* Transcript Content (Scrollable) */}
        {/* <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-2xl mx-auto font-mono text-sm leading-relaxed text-muted-foreground space-y-6">
            <p className="text-foreground">
              [00:00:12] Welcome back to the channel. Today we&apos;re diving deep into the architecture of modern LLMs and how context windows are evolving.
            </p>
            <p>
              [00:00:45] The main bottleneck isn&apos;t the processing power itself, but how we manage the attention mechanism over long sequences of data. Think of it like a library where you can only have 10 books open on the table at once.
            </p>
            <p>
              [00:01:20] But what if we could compress that knowledge? This is where the concept of semantic caching comes in. Instead of re-reading every page, we store the core concepts in a high-speed vector space.
            </p>
            <p className="bg-muted/50 p-4 border-l-2 border-primary rounded-r-lg text-foreground">
              [00:02:05] Key takeaway: Efficiency in AI isn&apos;t just about faster chips. It&apos;s about smarter retrieval patterns. If you&apos;re building an app today, focus on the retrieval layer first.
            </p>
            <p className="opacity-50 italic">... transcribing remaining 12 minutes ...</p>
          </div>
        </div> */}

        <div className="flex-1 flex items-center justify-center p-8 custom-scrollbar">
          <p className="text-sm font-mono text-muted-foreground/50 text-center max-w-xs">
            Source transcript syncing will be available in the next architectural update.
          </p>
        </div>
      </section>

      {/* Right Panel: The AI Output Editor */}
      <section className="w-full lg:w-1/2 flex flex-col bg-background relative">
        <div className="px-6 py-2 flex justify-between items-center border-b border-border">
          <span className="font-headline font-bold text-sm text-foreground">Architect Output</span>

          {/* Platform Segmented Control */}
          <div className="px-6 flex justify-center">
            <div className="bg-muted/50 p-1 rounded-lg border border-border flex gap-1">
              <button
                onClick={() => setActivePlatform('twitter')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${activePlatform === 'twitter' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <SiX className="w-3 h-3" /> Thread
              </button>
              <button
                onClick={() => setActivePlatform('hashnode')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${activePlatform === 'hashnode' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Hash className="w-3 h-3" /> Article
              </button>
              <button
                onClick={() => setActivePlatform('linkedin')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${activePlatform === 'linkedin' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <FaLinkedinIn className="w-3 h-3" /> Post
              </button>
            </div>
          </div>

          <div className="bg-muted/50 p-1 rounded-lg border border-border flex gap-1">
            <button
              onClick={() => setActivePlatform('twitter')}
              className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${activePlatform === 'twitter' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Draft
            </button>
          </div>
        </div>

        {/* The Live Text Area */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar pb-32">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Your engineered narrative will appear here. Start typing to edit..."
            className="w-full h-full min-h-125 bg-transparent resize-none outline-none text-foreground font-sans text-lg leading-relaxed placeholder:text-muted-foreground/40"
            spellCheck="false"
          />
        </div>

        {/* Floating Action Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-background/80 backdrop-blur-xl border border-border p-2 rounded-2xl shadow-2xl flex gap-2">
          <button className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Refine AI
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 bg-foreground text-background hover:opacity-90 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold text-sm shadow-md"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {isCopied ? 'Copied!' : 'Copy Output'}
          </button>
        </div>
      </section>
    </div>
  );
}
