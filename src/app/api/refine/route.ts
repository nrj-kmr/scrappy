import { db } from '@/db';
import { users } from '@/db/schema';
import { groq } from '@ai-sdk/groq';
import { createServerClient } from '@supabase/ssr';
import { generateText } from 'ai';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
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
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [dbUser] = await db
      .select({ credits: users.credits })
      .from(users)
      .where(eq(users.id, user.id));

    if (!dbUser || dbUser.credits <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits for AI refinement.' },
        { status: 402 }
      );
    }

    const { currentContent, instructions } = await req.json();

    if (!currentContent || !instructions) {
      return NextResponse.json({ error: 'Missing content or instructions' }, { status: 400 });
    }

    const { text: refinedContent } = await generateText({
      model: groq('llama-3.1-8b-instant'),
      system:
        "You are an expert tech editor and ghostwriter. Refine the provided text exactly according to the user's instructions. Maintain the original markdown formatting unless instructed otherwise. IMPORTANT: Output ONLY the refined text. Do not include any conversational filler like 'Here is the refined text'.",
      prompt: `User Instructions: ${instructions}\n\nOriginal Text:\n${currentContent}`,
    });

    return NextResponse.json({ success: true, content: refinedContent });
  } catch (error) {
    console.error('Refine Error:', error);
    return NextResponse.json({ error: 'Failed to refine content.' }, { status: 500 });
  }
}
