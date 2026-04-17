'use client';

import { useEffect, useState } from 'react';
import {
  Sparkles,
  Activity,
  CheckCircle2,
  Loader2,
  Copy,
  Hash,
  Mail,
  Edit3,
  Clock,
  BrushCleaning,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { SiX } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';
import { TargetType } from '@/lib/prompts';
import ReactMarkdown from 'react-markdown';

export default function DashboardPage() {
  const router = useRouter();
  const [sourceUrl, setSourceUrl] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [targetType, setTargetType] = useState<TargetType>('twitter_thread');
  const [contentLength, setContentLength] = useState<'short' | 'long'>('short');

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
  }, [sourceUrl, generatedContent]);

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

      // Phase 2: Generation
      setStatus('2/2: Architecting the narrative...');
      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: scrapeData.sourceId,
          targetType: 'twitter_thread',
          contentLength,
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
      <div className="bg-card border border-border rounded-2xl p-5 space-y-6 shadow-sm">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block font-mono">
            Source Material Link
          </label>
          <div className="flex gap-4">
            <Input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="Paste YouTube URL, GitHub Repo, or Article Link..."
              className="flex-1 bg-background h-10 rounded-xl"
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !sourceUrl}
              className="bg-foreground text-background font-bold px-8 h-10 rounded-xl cursor-pointer hover:scale-105 active:scale-95 transition-all"
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

        {/* Configuration Options */}
        <div className="flex justify-around">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block font-mono">
              Detail Depth
            </label>
            <div className="flex bg-muted/50 p-1 rounded-xl border border-border w-fit">
              <button
                onClick={() => setContentLength('short')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${contentLength === 'short' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Short Summary
              </button>
              <button
                onClick={() => setContentLength('long')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${contentLength === 'long' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Deep Dive
              </button>
            </div>
          </div>

          <div className="flex justify-around">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 block font-mono">
                Target Format
              </label>
              <div className="flex bg-muted/50 p-1 rounded-xl w-fit gap-2">
                <button
                  onClick={() => setTargetType('twitter_thread')}
                  className={`px-3 py-2 flex gap-1 items-center rounded-lg text-xs font-bold transition-all ${targetType === 'twitter_thread' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <SiX className="w-3 h-3" />
                  <span className="text-xs font-semibold">Twitter</span>
                </button>
                <button
                  onClick={() => setTargetType('linkedin_post')}
                  className={`px-3 py-2 flex gap-1 items-center rounded-lg text-xs font-bold transition-all ${targetType === 'linkedin_post' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <FaLinkedin className="w-3 h-3" />
                  <span className="text-xs font-semibold">LinkedIn</span>
                </button>
                <button
                  onClick={() => setTargetType('hashnode_article')}
                  className={`px-3 py-2 flex gap-1 items-center rounded-lg text-xs font-bold transition-all ${targetType === 'hashnode_article' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Hash className="w-3 h-3" />
                  <span className="text-xs font-semibold">Article</span>
                </button>
                <button
                  onClick={() => setTargetType('newsletter')}
                  className={`px-3 py-2 flex gap-1 items-center rounded-lg text-xs font-bold transition-all ${targetType === 'newsletter' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Mail className="w-3 h-3" />
                  <span className="text-xs font-semibold">Newsletter</span>
                </button>
                <button
                  onClick={() => setTargetType('timestamps')}
                  className={`px-3 py-2 flex gap-1 items-center rounded-lg text-xs font-bold transition-all ${targetType === 'timestamps' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Clock className="w-3 h-3" />
                  <span className="text-xs font-semibold">Timestamps</span>
                </button>
              </div>
            </div>
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
                  {targetType.replace('_', ' ')}
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
