'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useRef, useState } from 'react';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('');
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrolling.current) return;

      const sections = ['features', 'solutions', 'pricing'];
      let current = '';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 3 && rect.bottom >= 0) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-16">
          <div className="flex flex-1 justify-start">
            <Link
              href="/"
              onClick={() => {
                window.scrollTo(0, 0);
                setActiveSection('');
              }}
              className="text-xl font-bold tracking-tighter font-bricolage text-foreground cursor-pointer hover:opacity-80 transition-opacity"
            >
              Scrappy.
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-center gap-8">
            {[
              { id: 'features', label: 'Features' },
              { id: 'solutions', label: 'Solutions' },
              { id: 'pricing', label: 'Pricing' },
            ].map((link) => (
              <Link
                key={link.id}
                href={`#${link.id}`}
                onClick={() => {
                  setActiveSection(link.id);
                  isClickScrolling.current = true;
                  setTimeout(() => {
                    isClickScrolling.current = false;
                  }, 1000);
                }}
                className={`font-headline font-semibold text-sm transition-all duration-200 ${
                  activeSection === link.id
                    ? 'text-primary border-primary border-b-2 pb-1'
                    : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/login"
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content Injected Here */}
      <main className="flex-1 flex flex-col pt-16">{children}</main>

      {/* Global Footer */}
      <footer className="w-full py-12 border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-bold text-foreground font-bricolage uppercase">
              Scrappy AI
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                The Digital Architect&apos;s Atelier.
              </p>
            </span>
          </div>

          <div className="flex gap-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#solutions" className="hover:text-primary transition-colors">
              Solutions
            </Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center items-center px-6">
          <p className="text-muted-foreground text-xs tracking-wide">
            © 2026 Scrappy AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
