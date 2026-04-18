'use client';

import { useEffect, useState } from 'react';
import {
  Sparkles,
  Activity,
  CheckCircle2,
  Loader2,
  Copy,
  Mail,
  Edit3,
  Clock,
  BrushCleaning,
  CheckCircle,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SiHashnode, SiX } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';
import { ContentLength, Perspective, TargetType } from '@/lib/prompts';
import ReactMarkdown from 'react-markdown';

export default function DashboardPage() {
  const router = useRouter();
  const [sourceUrl, setSourceUrl] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [targetType, setTargetType] = useState<TargetType>('twitter_thread');
  const [contentLength, setContentLength] = useState<ContentLength>('short');
  const [perspective, setPerspective] = useState<Perspective>('creator');

  useEffect(() => {
    const savedUrl = localStorage.getItem('scrappy_current_url');
    const savedContent = localStorage.getItem('scrappy_current_content');

    if (savedUrl) {
      setTimeout(() => {
        setSourceUrl(savedUrl);
      }, 0);
    }
    if (savedContent) {
      setTimeout(() => {
        setGeneratedContent(savedContent);
      }, 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('scrappy_current_url', sourceUrl);
    localStorage.setItem('scrappy_current_content', generatedContent);
  }, [sourceUrl, generatedContent, targetType]);

  const handleGenerate = async () => {
    if (!sourceUrl) return;

    setIsGenerating(true);

    try {
      setGeneratedContent('');

      // Phase 1: Ingestion
      setStatus('1/2: Extracting source material...');
      const scrapeRes = await fetch('/api/scrape/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceUrl }),
      });

      const scrapeData = await scrapeRes.json();
      if (!scrapeRes.ok) throw new Error(scrapeData.error);

      localStorage.setItem('scrappy_current_transcript', scrapeData.transcript);
      localStorage.setItem('scrappy_source_id', scrapeData.sourceId);
      localStorage.setItem('scrappy_content_length', contentLength);
      localStorage.setItem('scrappy_perspective', perspective);

      // Phase 2: Generation
      setStatus('2/2: Architecting the narrative...');
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: scrapeData.sourceId,
          targetType,
          contentLength,
          perspective,
        }),
      });

      const genData = await genRes.json();
      if (!genRes.ok) throw new Error(genData.error || 'Failed to generate');

      // Set the mock/real AI content
      setGeneratedContent(genData.content || 'Your engineered narrative goes here...');
      setStatus(null);

      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(errorMessage); // Replace with a nice toast notification later
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setSourceUrl('');
    setGeneratedContent('');
    localStorage.removeItem('scrappy_current_url');
    localStorage.removeItem('scrappy_current_content');
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const targetOptions = [
    { id: 'twitter_thread', label: 'Twitter', icon: SiX },
    { id: 'linkedin_post', label: 'LinkedIn', icon: FaLinkedin },
    { id: 'hashnode_article', label: 'Article', icon: SiHashnode },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'youtube_timestamps', label: 'Timestamps', icon: Clock },
  ] as const;

  const activeTarget = targetOptions.find((t) => t.id === targetType) || targetOptions[0];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-headline font-bold text-foreground">Architect Engine</h1>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 animate-pulse">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-bold tracking-tight uppercase font-mono mt-px">
              Engine Ready
            </span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm font-sans">
          Configure parameters and extract your narrative.
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-6 shadow-sm">
        {/* Source Link Input */}
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block font-mono">
            Source Material Link
          </label>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="Paste YouTube URL, GitHub Repo, or Article Link..."
              className="flex-1 bg-background h-11 rounded-xl"
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !sourceUrl}
              className="bg-foreground text-background font-bold px-8 h-11 rounded-xl cursor-pointer hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? 'Compiling...' : 'Generate'}
            </Button>
          </div>
        </div>

        {/* Configuration Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
          {/* Detail Depth */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block font-mono">
              Detail Depth
            </label>
            <div
              className={`flex bg-muted/50 p-1 rounded-xl border border-border ${generatedContent ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <button
                onClick={() => setContentLength('short')}
                disabled={!!generatedContent}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${contentLength === 'short' ? 'bg-background text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Short Summary
              </button>
              <button
                onClick={() => setContentLength('long')}
                disabled={!!generatedContent}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${contentLength === 'long' ? 'bg-background text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Deep Dive
              </button>
            </div>
          </div>

          {/* Content Owner */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block font-mono">
              Content Owner
            </label>
            <div
              className={`flex bg-muted/50 p-1 rounded-xl border border-border ${generatedContent ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <button
                onClick={() => setPerspective('creator')}
                disabled={!!generatedContent}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${perspective === 'creator' ? 'bg-background text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
              >
                My Content
              </button>
              <button
                onClick={() => setPerspective('curator')}
                disabled={!!generatedContent}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all ${perspective === 'curator' ? 'bg-background text-foreground shadow-sm border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Curated
              </button>
            </div>
          </div>

          {/* Target Format Dropdown */}
          <div className="relative">
            <label className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 font-mono">
              <span>Target Format</span>
            </label>
            {generatedContent ? (
              <button
                onClick={() => router.push('/editor')}
                className="w-full flex items-center justify-between bg-muted/30 border border-border px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-2 text-muted-foreground opacity-70">
                  <activeTarget.icon className="w-4 h-4" />
                  {activeTarget.label}
                </div>
                <span className="text-xs text-blue-500 font-bold group-hover:underline flex items-center gap-1">
                  Change in Workspace <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-muted/30 border border-border px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <activeTarget.icon className="w-4 h-4 text-muted-foreground" />
                    {activeTarget.label}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                )}

                {isDropdownOpen && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-1 flex flex-col">
                      {targetOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => {
                            setTargetType(option.id as TargetType);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left
                            ${targetType === option.id ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}
                          `}
                        >
                          <option.icon
                            className={`w-4 h-4 ${targetType === option.id ? 'text-foreground' : ''}`}
                          />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Pulse */}
      {status && (
        <div className="flex items-center gap-3 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 font-mono text-sm animate-pulse">
          <Activity className="w-4 h-4" />
          {status}
        </div>
      )}

      {generatedContent && (
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 relative group mt-8 shadow-sm">
          <div className="sticky -top-6 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 pt-6 md:pt-8 bg-card -mx-6 px-6 md:-mx-8 md:px-8 -mt-6 md:-mt-8 mb-6 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-headline font-bold text-foreground">
                Generation Complete
              </h2>
              <div className="flex gap-2 items-center bg-muted text-muted-foreground text-[10px] uppercase tracking-widest font-mono px-2 py-1 rounded-md">
                <Sparkles className="w-3 h-3" />
                <span className="text-xs font-bold tracking-tight uppercase font-mono mt-px">
                  {targetType.replace('_', ' ')} - ({contentLength})
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClear} className="h-8 text-xs">
                <BrushCleaning className="w-4 h-4" />
                Clear Context
              </Button>
              <Button size="sm" onClick={handleCopy} className="h-8 text-xs">
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Output'}
              </Button>
              <Button
                size="sm"
                onClick={() => router.push('/editor')}
                className="h-8 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-3 h-3" /> Workspace
              </Button>
            </div>
          </div>

          <div className="max-w-3xl pb-4 mx-auto font-mono text-sm leading-relaxed text-muted-foreground space-y-5">
            <ReactMarkdown
              components={{
                // Standard text
                p: ({ ...props }) => <p className="text-foreground" {...props} />,
                // Bold text
                strong: ({ ...props }) => (
                  <strong className="text-foreground font-semibold" {...props} />
                ),
                // The highlighted "Blockquote" style from your prototype
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="bg-muted/50 p-4 border-l-2 border-primary rounded-r-lg text-foreground my-6 [&>p]:m-0"
                    {...props}
                  />
                ),
                // Headings break out of mono-font for better hierarchy
                h1: ({ ...props }) => (
                  <h1
                    className="text-2xl font-headline font-bold text-foreground mt-10 mb-4"
                    {...props}
                  />
                ),
                h2: ({ ...props }) => (
                  <h2
                    className="text-xl font-headline font-bold text-foreground mt-8 mb-4"
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    className="text-lg font-headline font-semibold text-foreground mt-6 mb-3"
                    {...props}
                  />
                ),
                // Custom technical list styling
                ul: ({ ...props }) => <ul className="space-y-3 my-6 pl-2" {...props} />,
                li: ({ ...props }) => (
                  <li className="flex gap-3 text-muted-foreground">
                    <span className="text-primary select-none">›</span>
                    <span className="flex-1">{props.children}</span>
                  </li>
                ),
                // Inline and block code styling
                code: ({
                  inline,
                  children,
                  ...props
                }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
                  return inline ? (
                    <code
                      className="bg-muted px-1.5 py-0.5 rounded-md text-foreground font-mono text-[13px]"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <div className="bg-muted/30 p-4 rounded-xl border border-border my-6 overflow-x-auto">
                      <code className="text-foreground font-mono text-[13px]" {...props}>
                        {children}
                      </code>
                    </div>
                  );
                },
              }}
            >
              {generatedContent}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
