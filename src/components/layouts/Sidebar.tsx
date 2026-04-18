'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, History, Settings, Sparkles, LogOut, ChevronUp, User } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface SidebarProps {
  user:
    | {
        name: string | null;
        username: string | null;
        avatarUrl: string | null;
        credits: number;
      }
    | undefined
    | null;
}

const navigation = [
  { name: 'Repurpose', href: '/dashboard', icon: Home },
  { name: 'History', href: '/history', icon: History },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.addEventListener('mousedown', handleClickOutside);
  }, [menuRef]);

  return (
    <aside className="w-64 border-r border-border bg-background hidden md:flex flex-col">
      {/* Brand Logo Area */}
      <div
        onClick={() => router.push('/')}
        className="h-16 flex items-center px-6 border-b border-border cursor-pointer"
      >
        <Sparkles className="w-5 h-5 text-blue-500 mr-2" />
        <span className="text-lg font-bold text-foreground tracking-tight font-bricolage">
          Scrappy.
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-background text-foreground'
                  : 'text-muted-foreground hover:mask-b-from-orange-950 hover:text-accent-foreground'
              }`}
            >
              <item.icon
                className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-500' : 'text-foreground'}`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border bg-muted/5 relative" ref={menuRef}>
        {/* Floating Settings/Logout Menu */}
        {isMenuOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-1 flex flex-col">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/settings');
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full text-left"
              >
                <Settings className="w-4 h-4" /> Account Settings
              </button>
              <div className="h-px bg-border my-1 mx-2" />
              <Button
                onClick={handleLogout}
                className="rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/80 hover:text-red-50 transition-all w-full"
              >
                <LogOut className="w-4 h-4 mr-2" /> Log Out
              </Button>
            </div>
          </div>
        )}

        {/* User Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-muted transition-colors text-left group mb-2"
        >
          <div className="flex items-center gap-3 min-w-0">
            {user?.avatarUrl ? (
              <Image
                src={user?.avatarUrl}
                alt="User avatar"
                width={36}
                height={36}
                className="rounded-full object-cover border border-border shadow-sm shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-muted border border-border shadow-sm shrink-0 flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.name || 'Architect'}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                @{user?.username || 'user'}
              </p>
            </div>
          </div>
          <ChevronUp
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : 'opacity-0 group-hover:opacity-100'}`}
          />
        </button>

        {/* Credit Usage Bar */}
        <div className="bg-muted/40 rounded-xl p-3 border border-border/50 shadow-inner">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Engine Credits</span>
            <span className="text-xs font-mono font-bold text-foreground">
              {user?.credits || 0} / 10
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5 border border-border/50 overflow-hidden">
            {/* Dynamic width calculation based on remaining credits */}
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                ((user?.credits || 0) / 10) * 100 <= 38
                  ? 'bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                  : 'bg-foreground'
              }`}
              style={{ width: `${Math.min(((user?.credits || 0) / 10) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
