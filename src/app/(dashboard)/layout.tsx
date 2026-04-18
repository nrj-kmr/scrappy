import { Sidebar } from '@/components/layouts/Sidebar';
import { TopNav } from '@/components/layouts/TopNav';
import { db } from '@/db';
import { users } from '@/db/schema';
import { createServerClient } from '@supabase/ssr';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const [dbUser] = await db
    .select({
      credits: users.credits,
      name: users.name,
      avatarUrl: users.avatarUrl,
      username: users.username,
      persona: users.persona,
    })
    .from(users)
    .where(eq(users.id, user.id));

  if (dbUser && (!dbUser.username || !dbUser.persona)) {
    redirect('/onboarding');
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={dbUser} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
