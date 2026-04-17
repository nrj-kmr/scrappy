'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function TopNav() {
  const pathname = usePathname();

  // A quick utility to format the URL into a readable page title
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Repurpose Content';
    if (pathname === '/history') return 'Generation History';
    if (pathname === '/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 lg:px-8 transition-colors">
      <h1 className="text-sm font-medium text-foreground">{getPageTitle()}</h1>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        {/* Placeholder for User Avatar (We will wire this to Supabase Auth later) */}
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-purple-600 border-2 border-border cursor-pointer"></div>
      </div>
    </header>
  );
}
