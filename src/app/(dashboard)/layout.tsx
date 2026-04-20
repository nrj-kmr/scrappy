import { Sidebar } from '@/components/layouts/Sidebar';
import { TopNav } from '@/components/layouts/TopNav';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getAuthUser } from '@/utils/supabase/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, error } = await getAuthUser();

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
