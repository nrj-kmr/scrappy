'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';

type EmailType = 'idle' | 'success' | 'error';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ type: EmailType; message: string }>({
    type: 'idle',
    message: '',
  });

  const supabase = createClient();

  const handleLogin = async (provider: 'github' | 'google') => {
    try {
      setIsLoading(provider);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.log('Auth error:', error);
      setIsLoading(null);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading('email');
    setEmailStatus({ type: 'idle', message: '' });

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setEmailStatus({
        type: 'success',
        message: 'Magic link sent! Please Check your inbox.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send magic link.';
      console.error('Email Login Error:', error);
      setEmailStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="bg-background/60 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-2xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-normal text-foreground">
          Welcome to Scrappy
        </h1>
        <p className="text-muted-foreground text-sm font-sans">
          Sign in to your account to continue architecting content.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => handleLogin('github')}
          disabled={isLoading !== null}
          className="w-full relative flex items-center justify-center gap-3 bg-foreground text-background font-bold py-3.5 rounded-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading === 'github' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FaGithub className="w-5 h-5" />
          )}
          Continue with GitHub
        </Button>

        <Button
          onClick={() => handleLogin('google')}
          disabled={isLoading !== null}
          className="w-full relative flex items-center justify-center gap-3 bg-muted/50 border border-border text-foreground font-semibold py-3.5 rounded-xl transition-all hover:bg-muted active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading === 'google' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FaGoogle className="w-5 h-5 text-foreground" />
          )}
          Continue with Google
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background/80 px-2 text-muted-foreground tracking-widest font-mono">
            Or
          </span>
        </div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading !== null || emailStatus.type === 'success'}
            placeholder="name@example.com"
            className="flex-1 bg-muted/30 border border-border rounded-xl px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            required
          />
          <Button
            type="submit"
            disabled={isLoading !== null || !email || emailStatus.type === 'success'}
            className="bg-muted hover:bg-muted/80 border border-border text-foreground px-4 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isLoading === 'email' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Status Messages */}
        {emailStatus.message && (
          <div
            className={`flex items-center justify-center gap-2 text-xs font-semibold p-2 rounded-lg ${
              emailStatus.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-red-500/10 text-red-500'
            }`}
          >
            {emailStatus.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
            {emailStatus.message}
          </div>
        )}
      </form>

      <p className="text-center text-xs text-muted-foreground font-sans pt-4">
        By clicking continue, you agree to our{' '}
        <a href="#" className="underline hover:text-foreground">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline hover:text-foreground">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
