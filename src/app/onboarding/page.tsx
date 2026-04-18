'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Code2, Video, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import { TargetType } from '@/lib/prompts';
import { SiHashnode, SiX } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [persona, setPersona] = useState<'developer' | 'creator' | null>(null);
  const [target, setTarget] = useState<TargetType | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        const prefix = user.email.split('@')[0];
        setUsername(prefix.replace(/[^a-zA-Z0-9_]/g, ''));
      }
    }
    fetchUser();
  }, [supabase.auth]);

  const handleSubmit = async () => {
    if (!username || !persona || !target) {
      setError('Please choose a username, persona and target.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, persona, target }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to save profile');

      localStorage.setItem('scrappy_current_target', target);

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const targetOptions = [
    { id: 'twitter_thread', label: 'Twitter', icon: SiX, desc: 'Engaging threads' },
    { id: 'linkedin_post', label: 'LinkedIn', icon: FaLinkedin, desc: 'Professional updates' },
    { id: 'hashnode_article', label: 'Article', icon: SiHashnode, desc: 'SEO blog posts' },
  ];

  return (
    <div className="min-h-screen bg-muted/10 flex flex-col items-center py-20 px-6 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-12 relative z-10">
        <Sparkles className="w-6 h-6 text-blue-600" />
        <span className="font-bricolage font-bold text-xl text-foreground tracking-tight">
          Scrappy.
        </span>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground mb-8 relative z-10">
        <span className={step >= 1 ? 'text-primary' : ''}>Identity</span>
        <span>›</span>
        <span className={step >= 2 ? 'text-primary' : ''}>Persona</span>
        <span>›</span>
        <span className={step >= 3 ? 'text-primary' : ''}>Target</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-background border border-border/50 rounded-2xl shadow-xl overflow-hidden relative z-10">
        <div className="p-10 md:p-12 min-h-100 flex flex-col">
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-headline font-bold text-center mb-2">
                Claim your workspace handle
              </h2>
              <p className="text-center text-muted-foreground text-sm mb-10">
                This will be your unique identity in the engine.
              </p>

              <div className="max-w-md mx-auto space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono font-bold">
                    @
                  </span>
                  <Input
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())
                    }
                    placeholder="architect_dev"
                    className="pl-10 bg-muted/30 border border-border h-14 rounded-xl text-lg text-foreground font-mono focus-visible:ring-blue-500/20"
                    maxLength={20}
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-500 font-mono font-bold text-center">{error}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: PERSONA */}
          {step === 2 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-headline font-bold text-center mb-2">
                How do you build?
              </h2>
              <p className="text-center text-muted-foreground text-sm mb-10">
                This helps tailor the LLM prompt semantics.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                <button
                  onClick={() => setPersona('developer')}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    persona === 'developer'
                      ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500 shadow-sm'
                      : 'border-border bg-muted/20 hover:border-foreground/30'
                  }`}
                >
                  <Code2
                    className={`w-8 h-8 mb-4 ${persona === 'developer' ? 'text-blue-600' : 'text-muted-foreground'}`}
                  />
                  <div className="font-headline font-bold text-lg text-foreground">Developer</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Focuses on OSS, code, and technical architecture.
                  </div>
                </button>

                <button
                  onClick={() => setPersona('creator')}
                  className={`p-6 rounded-2xl border text-left transition-all ${
                    persona === 'creator'
                      ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500 shadow-sm'
                      : 'border-border bg-muted/20 hover:border-foreground/30'
                  }`}
                >
                  <Video
                    className={`w-8 h-8 mb-4 ${persona === 'creator' ? 'text-blue-600' : 'text-muted-foreground'}`}
                  />
                  <div className="font-headline font-bold text-lg text-foreground">Creator</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Focuses on video, media, and audience growth.
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TARGET */}
          {step === 3 && (
            <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-3xl font-headline font-bold text-center mb-2">Primary Output</h2>
              <p className="text-center text-muted-foreground text-sm mb-10">
                Where do you deploy your content the most?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {targetOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setTarget(opt.id as TargetType)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      target === opt.id
                        ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500 shadow-sm'
                        : 'border-border bg-muted/20 hover:border-foreground/30'
                    }`}
                  >
                    <opt.icon
                      className={`w-6 h-6 mb-4 ${target === opt.id ? 'text-blue-600' : 'text-muted-foreground'}`}
                    />
                    <div className="font-headline font-bold text-base text-foreground">
                      {opt.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Bar */}
          <div className="mt-auto pt-10 flex items-center justify-between border-t border-border/50">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : router.push('/login'))}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? !username : !persona}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-11 rounded-xl transition-all"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!target || isLoading}
                className="bg-foreground hover:bg-foreground/90 text-background font-bold px-8 h-11 rounded-xl transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isLoading ? 'Saving...' : 'Initialize Workspace'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 text-[9px] font-mono uppercase tracking-widest text-muted-foreground/50">
        AES-256 Encrypted • OAuth 2.0 Secure
      </div>
    </div>
  );
}
