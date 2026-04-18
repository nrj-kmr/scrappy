'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useRef, useState } from 'react';
import { UserDropdown } from '@/components/userDropdown';

interface MarketingNavProps {
  user: {
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
    credits: number;
  } | null;
}

export function MarketingNav({ user }: MarketingNavProps) {
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

          {/* DYNAMIC AUTH RENDERING */}
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
