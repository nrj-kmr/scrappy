'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function TopNav() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Repurpose Content';
    if (pathname === '/history') return 'Generation History';
    if (pathname === '/settings') return 'Settings';
    return 'Dashboard';
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 lg:px-8 transition-colors">
      <h1 className="text-sm font-medium text-foreground">{getPageTitle()}</h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
