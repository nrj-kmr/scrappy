'use client';

import { useEffect, useState } from 'react';
import {
  Play,
  Copy,
  Sparkles,
  Check,
  X,
  ArrowRight,
  Mail,
  Clock,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { TargetType } from '@/lib/prompts';
import { SiHashnode, SiX } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';

export default function EditorWorkspace() {
  const [activePlatform, setActivePlatform] = useState<TargetType>('twitter_thread');
  const [content, setContent] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const [isRefining, setIsRefining] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [isRefiningLoading, setIsRefiningLoading] = useState(false);

  const [sourceId, setSourceId] = useState<number | null>(null);
  const [contentLength, setContentLength] = useState<string>('short');
  const [perspective, setPerspective] = useState<string>('creator');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedContent = localStorage.getItem('scrappy_current_content');
    const savedTarget = localStorage.getItem('scrappy_current_target') as TargetType | null;
    const savedTranscript = localStorage.getItem('scrappy_current_transcript');

    const savedSource = localStorage.getItem('scrappy_source_id');
    const savedLength = localStorage.getItem('scrappy_content_length');
    const savedPersp = localStorage.getItem('scrappy_perspective');

    if (savedContent) setTimeout(() => setContent(savedContent), 0);
    if (savedTarget) setTimeout(() => setActivePlatform(savedTarget), 0);
    if (savedTranscript) setTimeout(() => setTranscript(savedTranscript), 0);

    if (savedSource) setTimeout(() => setSourceId(parseInt(savedSource)), 0);
    if (savedLength) setTimeout(() => setContentLength(savedLength), 0);
    if (savedPersp) setTimeout(() => setPerspective(savedPersp), 0);

    if (savedSource) {
      const sid = parseInt(savedSource);
      setTimeout(() => setSourceId(sid), 0);

      const cacheKey = `scrappy_drafts_${sid}`;
      const cached = localStorage.getItem(cacheKey);
      const parsedDrafts: Record<string, string> = cached ? JSON.parse(cached) : {};

      if (savedTarget && savedContent && !parsedDrafts[savedTarget]) {
        parsedDrafts[savedTarget] = savedContent;
        localStorage.setItem(cacheKey, JSON.stringify(parsedDrafts));
      }

      setTimeout(() => {
        setDrafts(parsedDrafts);
        if (savedTarget && parsedDrafts[savedTarget]) {
          setContent(parsedDrafts[savedTarget]);
        } else if (savedContent) {
          setContent(savedContent);
        }
      }, 0);
    }
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    localStorage.setItem('scrappy_current_content', newContent);

    if (sourceId) {
      const newDrafts = { ...drafts, [activePlatform]: newContent };
      setDrafts(newDrafts);
      localStorage.setItem(`scrappy_drafts_${sourceId}`, JSON.stringify(newDrafts));
    }
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleConvertFormat = async (newFormat: TargetType) => {
    setActivePlatform(newFormat);
    setIsDropdownOpen(false);
    localStorage.setItem('scrappy_current_target', newFormat);

    if (drafts[newFormat]) {
      setContent(drafts[newFormat]);
      localStorage.setItem('scrappy_current_content', drafts[newFormat]);
      return;
    }

    if (!sourceId) {
      alert('Source context lost. Please generate a new link from the dashboard first.');
      return;
    }

    setIsConverting(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId,
          targetType: newFormat,
          contentLength,
          perspective,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setContent(data.content);
      localStorage.setItem('scrappy_current_content', data.content);

      const newDrafts = { ...drafts, [newFormat]: data.content };
      setDrafts(newDrafts);
      localStorage.setItem(`scrappy_drafts_${sourceId}`, JSON.stringify(newDrafts));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Conversion failed';
      alert(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  const handleRefineSubmit = async () => {
    if (!refinePrompt || !content) {
      setIsRefining(false);
      return;
    }

    setIsRefiningLoading(true);
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentContent: content, instructions: refinePrompt }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setContent(data.content);
      localStorage.setItem('scrappy_current_content', data.content);

      if (sourceId) {
        const newDrafts = { ...drafts, [activePlatform]: data.content };
        setDrafts(newDrafts);
        localStorage.setItem(`scrappy_drafts_${sourceId}`, JSON.stringify(newDrafts));
      }

      setRefinePrompt('');
      setIsRefining(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Refine failed';
      alert(errorMessage);
    } finally {
      setIsRefiningLoading(false);
    }
  };

  const targetOptions = [
    { id: 'twitter_thread', label: 'Twitter Thred', icon: SiX },
    { id: 'linkedin_post', label: 'LinkedIn Post', icon: FaLinkedin },
    { id: 'hashnode_article', label: 'Hashnode Article', icon: SiHashnode },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'youtube_timestamps', label: 'YT Timestamps', icon: Clock },
  ] as const;

  const activeTarget = targetOptions.find((t) => t.id === activePlatform) || targetOptions[0];

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full border border-border rounded-2xl overflow-hidden bg-background shadow-sm">
      {/* Left Panel: The Raw Source */}
      <section className="w-1/2 border-r border-border flex flex-col bg-muted/10  lg:flex">
        {/* Panel Header (Added shrink-0 so it doesn't get squished by the text) */}
        <div className="bg-muted/30 backdrop-blur-md px-6 py-3 flex items-center justify-between border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
              Workspace Context
            </span>
          </div>
        </div>

        {/* The Raw Context Area (Added precise overflow-y-auto controls) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 pb-32">
          {transcript ? (
            <div className="font-mono text-sm leading-relaxed space-y-6">
              {transcript.split('\n\n').map((paragraph, i) => {
                const match = paragraph.match(/^(\[\d{2}:\d{2}\])/);
                if (match) {
                  return (
                    <p key={i} className="text-foreground/90">
                      <span className="text-blue-600 font-bold mr-2">{match[1]}</span>
                      {paragraph.slice(match[1].length)}
                    </p>
                  );
                }
                return (
                  <p key={i} className="text-muted-foreground/90">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm font-mono text-muted-foreground/50 text-center max-w-xs">
                No active transcript. Generate a narrative to sync source material.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Right Panel: The AI Output Editor */}
      <section className="w-full lg:w-1/2 flex flex-col bg-background relative">
        <div className="px-6 py-2 flex justify-between items-center border-b border-border">
          <span className="font-headline font-bold text-sm text-foreground">Architect Output</span>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isConverting}
              className="bg-muted/50 px-3 py-1.5 flex items-center gap-2 rounded-lg border border-border text-[10px] uppercase tracking-widest font-bold text-foreground shadow-sm hover:bg-muted transition-colors disabled:opacity-50"
            >
              {isConverting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <activeTarget.icon className="w-3 h-3" />
              )}
              {isConverting ? 'Converting...' : activeTarget.label}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
            )}

            {isDropdownOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-1 flex flex-col">
                  {targetOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleConvertFormat(option.id as TargetType)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left
                        ${activePlatform === option.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}
                      `}
                    >
                      <option.icon
                        className={`w-4 h-4 ${activePlatform === option.id ? 'text-foreground' : ''}`}
                      />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* The Live Text Area */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar pb-32">
          {isRefiningLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground animate-pulse gap-4">
              <Sparkles className="w-8 h-8 text-blue-500" />
              <p className="font-mono text-xs uppercase tracking-widest">
                {isConverting ? 'Engineering new format...' : 'AI is refining your draft...'}
              </p>
            </div>
          ) : (
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Your engineered narrative will appear here. Start typing to edit..."
              className="w-full h-full min-h-125 bg-transparent resize-none outline-none text-foreground font-sans text-lg leading-relaxed placeholder:text-muted-foreground/40"
              spellCheck="false"
            />
          )}
        </div>

        {/* Hidden Input Field that reveals when "Refine AI" is clicked */}
        {isRefining && (
          <div className="flex items-center gap-2 p-1  border border-border">
            <input
              autoFocus
              value={refinePrompt}
              onChange={(e) => setRefinePrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRefineSubmit()}
              placeholder="E.g., 'Make it punchier', 'Add more emojis'..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none px-2 py-2"
              disabled={isRefiningLoading}
            />
            <button
              onClick={() => setIsRefining(false)}
              className="p-1 hover:bg-muted rounded-md text-muted-foreground mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Floating Action Bar */}
        <div className="flex gap-4 p-4">
          <button
            onClick={() => (isRefining ? handleRefineSubmit() : setIsRefining(true))}
            disabled={isRefiningLoading || isConverting}
            className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold text-sm disabled:opacity-50"
          >
            {isRefining ? (
              <ArrowRight className="w-4 h-4 text-blue-500" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-500" />
            )}
            {isRefining ? 'Submit Edit' : 'Refine AI'}
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 bg-foreground/80 text-background hover:opacity-90 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold text-sm shadow-md"
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
