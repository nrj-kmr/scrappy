import { getAuthUser } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    console.error('Auth Callback Error: No code provided in URL');
    return NextResponse.redirect(new URL('/login?error=No_code_provided', request.url));
  }

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase Environment Variables are missing.');
    }

    const { supabase } = await getAuthUser();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Supabase Exchange Error:', error.message);
      throw error;
    }

    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('CRITICAL CALLBACK ERROR:', errorMessage);
    return NextResponse.redirect(`${origin}/login?error=Authentication failed`);
  }
}
