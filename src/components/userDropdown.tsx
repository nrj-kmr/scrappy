'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Settings, LayoutDashboard, User } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface UserDropdownProps {
  user: {
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
    credits: number;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuRef]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-muted/50 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 overflow-hidden"
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt="Profile"
            width={30}
            height={30}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {/* Dropdown Tray */}
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+12px)] w-64 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          {/* User Info Header */}
          <div className="p-4 border-b border-border bg-muted/10">
            <p className="text-sm font-semibold text-foreground truncate">
              {user.name || 'Architect'}
            </p>
            <p className="text-xs text-muted-foreground font-mono truncate mt-0.5">
              @{user.username || 'user'}
            </p>

            {/* Credit Usage Bar inside Tray */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  Credits
                </span>
                <span className="text-[10px] font-mono font-bold text-foreground">
                  {user.credits || 0} / 10
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    (user.credits / 10) * 100 <= 30
                      ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(((user.credits || 0) / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="p-1.5 flex flex-col">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/dashboard');
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full text-left"
            >
              <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/settings');
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full text-left"
            >
              <Settings className="w-4 h-4" /> Account Settings
            </button>

            <div className="h-px bg-border my-1 mx-2" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
