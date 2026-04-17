'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, History, Settings, Sparkles, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface SidebarProps {
  user:
    | {
        name: string | null;
        avatarUrl: string | null;
        credits: number;
      }
    | undefined
    | null;
}

const navigation = [
  { name: 'Repurpose', href: '/dashboard', icon: Home },
  { name: 'History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

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

      {/* Credits / Plan Area (Static for now) */}
      {/* <div className="p-4 border-t border-border">

        <div className="bg-background rounded-md p-3 pt-1">
          <span>
            <Image 
            src={user.avatarUrl} 
            alt='user image' 
            width={32}
            height={32}
            className='rounded-full object-cover'
            />
            <p className="text-xs font-medium text-accent-foreground tracking-wider mb-2">{user?.name}</p>
          </span>
          <div className="flex justify-between text-sm text-foreground mb-1">
            <span>Credits</span>
            <span>{user?.credits} / 10</span>
          </div>
          <div className="w-full bg-accent-foreground rounded-full h-1.5 mt-2">
            <div className="bg-blue-500 h-1.5 rounded-full w-[80%]"></div>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          className="w-full hover:text-muted-foreground mt-2"
        >
          <LogOut className='w-4 h-4 mr-2' />
          Logout
        </Button>
      </div> */}

      {/* Credits / Plan Area */}
      <div className="p-4 border-t border-border bg-muted/5 space-y-4">
        {/* User Identity */}
        <div className="flex items-center gap-3 px-2">
          <Image
            src={user?.avatarUrl || '/default-avatar.png'}
            alt="User avatar"
            width={36}
            height={36}
            className="rounded-full object-cover border border-border shadow-sm shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono truncate">
              Hobbyist Plan
            </p>
          </div>
        </div>

        {/* Credit Usage Card */}
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
              className="bg-foreground h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(((user?.credits || 0) / 10) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Logout Action */}
        <Button
          // variant="ghost"
          onClick={handleLogout}
          className="w-full hover:text-foreground hover:bg-muted/90 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </aside>
  );
}
