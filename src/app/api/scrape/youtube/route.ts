import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { db } from '@/db/index';
import { sources } from '@/db/schema';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

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
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the incoming JSON payload
    const body = await req.json();
    const { sourceUrl } = body;

    // Guardrails: Validate the input
    if (!sourceUrl) {
      return NextResponse.json({ error: 'sourceUrl is required' }, { status: 400 });
    }

    // The Extraction: Fetch the transcript array
    // Note: This returns an array of objects like { text: "hello", duration: 1.5, offset: 0 }
    const transcriptRaw = await YoutubeTranscript.fetchTranscript(sourceUrl);

    // The Transformation: Combine the array into one massive string of text
    const fullText = transcriptRaw.map((t) => t.text).join(' ');

    // The Injection: Save it to our Postgres Database
    // We use .returning() so Postgres hands us back the newly created row
    const [newSource] = await db
      .insert(sources)
      .values({
        userId: user.id,
        url: sourceUrl,
        type: 'youtube',
        title: 'Draft YouTube Video',
        rawContent: fullText,
      })
      .returning();

    // Return success to the frontend
    return NextResponse.json({
      success: true,
      message: 'Transcript saved successfully!',
      sourceId: newSource.id,
    });
  } catch (error) {
    console.error('Scraping Error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape video. It might not have closed captions.' },
      { status: 500 }
    );
  }
}
