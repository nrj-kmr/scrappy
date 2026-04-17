import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center relative overflow-hidden">
      {/* The Ambient Glowing Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />

      {/* Minimal Brand Header */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="w-5 h-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
          <span className="font-headline font-bold text-foreground tracking-tight">Scrappy.</span>
        </Link>
      </div>

      {/* The Login Card gets injected here */}
      <div className="relative z-10 w-full max-w-md px-6">{children}</div>
    </div>
  );
}
