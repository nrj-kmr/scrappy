import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { sources, generations, users } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { generateText } from 'ai';

import { groq } from '@ai-sdk/groq';
import { buildSystemPrompt } from '@/lib/prompts';
import { getAuthUser } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const { user } = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [dbUser] = await db
      .select({ credits: users.credits })
      .from(users)
      .where(eq(users.id, user.id));

    if (!dbUser || dbUser.credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits. Please upgrade.' }, { status: 402 });
    }

    const body = await req.json();
    const { sourceId, targetType, contentLength, perspective } = body;

    const [source] = await db
      .select()
      .from(sources)
      .where(and(eq(sources.id, sourceId), eq(sources.userId, user.id)));

    if (!source || !source.rawContent) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    const systemPrompt = buildSystemPrompt(targetType, contentLength, perspective);

    // *** note: remove this substring part when moving to production
    const safeTranscript = source.rawContent.substring(0, 6000);

    const { text: aiOutput } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system: systemPrompt,
      prompt: `Here is the raw transcript to repurpose. Note that it may be truncated for length:\n\n${safeTranscript}`,
    });

    const [newGeneration] = await db
      .insert(generations)
      .values({
        userId: user.id,
        sourceId: sourceId,
        type: targetType,
        content: aiOutput,
        status: 'draft',
      })
      .returning();

    await db
      .update(users)
      .set({ credits: sql`${users.credits} - 1` })
      .where(eq(users.id, user.id));

    return NextResponse.json({
      success: true,
      generationId: newGeneration.id,
      content: aiOutput,
    });
  } catch (error: unknown) {
    console.error('Generation Error:', error);

    let errorMessage = 'Failed to generate content.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
