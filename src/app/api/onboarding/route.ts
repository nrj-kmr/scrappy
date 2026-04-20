import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { user } = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { username, persona, target } = await req.json();

    if (!username || !persona || !target) {
      return NextResponse.json(
        { error: 'Username, Persona and Target are required' },
        { status: 400 }
      );
    }

    const [dbUser] = await db.select().from(users).where(eq(users.id, user.id));
    const currentSettings = (dbUser?.settings as Record<string, unknown>) || {};

    await db
      .update(users)
      .set({
        username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        persona: persona,
        settings: { ...currentSettings, defaultTarget: target },
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Onboarding Error:', error);
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === '23505'
    ) {
      return NextResponse.json({ error: 'Username is already taken.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to save profile.' }, { status: 500 });
  }
}
