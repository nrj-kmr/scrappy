import { NextResponse } from 'next/server';
import { db } from '@/db/index';
import { sources } from '@/db/schema';
import { getAuthUser } from '@/utils/supabase/server';

function extractVideoId(url: string) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
}

const formatOffset = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`;
};

export async function POST(req: Request) {
  try {
    const { user } = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { sourceUrl } = await req.json();
    if (!sourceUrl) return NextResponse.json({ error: 'sourceUrl is required' }, { status: 400 });

    const videoId = extractVideoId(sourceUrl);
    if (!videoId) return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });

    if (!process.env.RAPIDAPI_KEY) {
      throw new Error('Server configuration error: Missing API Key.');
    }

    const fetchTranscript = async (language: string) => {
      return await fetch(
        `https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${videoId}&lang=${language}`,
        {
          method: 'GET',
          headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
            'x-rapidapi-host': 'youtube-transcriptor.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
        }
      );
    };

    let res = await fetchTranscript('en');
    let data = await res.json();

    if (data && data.error && data.availableLangs && data.availableLangs.length > 0) {
      const fallbackLang = data.availableLangs[0];
      console.log(`English unavailable. Retrying with language: ${fallbackLang}`);

      res = await fetchTranscript(fallbackLang);
      data = await res.json();
    }

    if (data && data.error) {
      throw new Error(`RapidAPI Error: ${data.error}`);
    }

    let rawArray = null;
    if (Array.isArray(data)) rawArray = data;
    else if (data && Array.isArray(data.transcript)) rawArray = data.transcript;
    else if (data && Array.isArray(data.data)) rawArray = data.data;
    else if (data && Array.isArray(data.captions)) rawArray = data.captions;
    else if (data && Array.isArray(data.subtitles)) rawArray = data.subtitles;

    if (!rawArray || rawArray.length === 0) {
      console.error('RAPID API RAW RESPONSE:', data);
      throw new Error(
        `API returned an unexpected format: ${JSON.stringify(data).substring(0, 80)}...`
      );
    }

    let formattedTranscript = '';
    let currentParagraph = '';

    rawArray.forEach((t: unknown, index: number) => {
      let text = '';
      let rawStart: unknown = 0;

      if (typeof t === 'string') {
        text = t;
      } else if (t !== null && typeof t === 'object') {
        const obj = t as Record<string, unknown>;

        const foundText = obj.text || obj.snippet || obj.subtitle || obj.content || '';
        text = typeof foundText === 'string' ? foundText : String(foundText);

        rawStart = obj.start ?? obj.offset ?? obj.startTime ?? 0;

        if (!text) {
          for (const key in obj) {
            const val = obj[key];
            if (typeof val === 'string' && val.trim().length > 0 && isNaN(Number(val))) {
              text = val;
              break;
            }
          }
        }
      }

      const startSeconds = typeof rawStart === 'string' ? parseFloat(rawStart) : Number(rawStart);

      if (index % 5 === 0) {
        if (currentParagraph) {
          formattedTranscript += currentParagraph.trim() + '\n\n';
        }
        currentParagraph = `${formatOffset(startSeconds)} ${text} `;
      } else {
        currentParagraph += `${text} `;
      }
    });

    if (currentParagraph) formattedTranscript += currentParagraph.trim();

    if (!formattedTranscript || formattedTranscript.length < 10) {
      console.error('FAILED ARRAY ITEM:', rawArray[0]);
      throw new Error(
        `Text extraction failed. The API gave us this format: ${JSON.stringify(rawArray[0]).substring(0, 100)}...`
      );
    }

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

    return NextResponse.json({
      success: true,
      message: 'Transcript saved successfully!',
      sourceId: newSource.id,
      transcript: formattedTranscript,
    });
  } catch (error: unknown) {
    console.error('Scraping Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to scrape video.';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
