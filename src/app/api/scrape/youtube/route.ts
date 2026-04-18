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

    const body = await req.json();
    const { sourceUrl } = body;

    if (!sourceUrl) {
      return NextResponse.json({ error: 'sourceUrl is required' }, { status: 400 });
    }

    // The Extraction: Fetch the transcript array
    // Note: This returns an array of objects like { text: "hello", duration: 1.5, offset: 0 }
    const transcriptRaw = await YoutubeTranscript.fetchTranscript(sourceUrl);

    // Helper function to convert milliseconds to [MM:SS] format
    const formatOffset = (offsetMs: number) => {
      const totalSeconds = Math.floor(offsetMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`;
    };

    let formattedTranscript = '';
    let currentParagraph = '';

    transcriptRaw.forEach((t, index) => {
      if (index % 5 === 0) {
        if (currentParagraph) {
          formattedTranscript += currentParagraph.trim() + '\n\n';
        }
        currentParagraph = `${formatOffset(t.offset)} ${t.text} `;
      } else {
        currentParagraph += `${t.text} `;
      }
    });

    if (currentParagraph) formattedTranscript += currentParagraph.trim();

    const [newSource] = await db
      .insert(sources)
      .values({
        userId: user.id,
        url: sourceUrl,
        type: 'youtube',
        title: 'Draft YouTube Video',
        rawContent: formattedTranscript,
      })
      .returning();

    // Return success to the frontend
    return NextResponse.json({
      success: true,
      message: 'Transcript saved successfully!',
      sourceId: newSource.id,
      transcript: formattedTranscript,
    });
  } catch (error) {
    console.error('Scraping Error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape video. It might not have closed captions.' },
      { status: 500 }
    );
  }
}
