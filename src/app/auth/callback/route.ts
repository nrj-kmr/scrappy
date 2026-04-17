import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    console.error('Auth Callback Error: No code provided in URL');
    return NextResponse.redirect(new URL('/login?error=No_code_provided', request.url));
  }

  // if (code) {
  //   const cookieStore = await cookies();
  //   const supabase = createServerClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //     {
  //       cookies: {
  //         getAll() {
  //           return cookieStore.getAll();
  //         },
  //         setAll(cookiesToSet) {
  //           try {
  //             cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
  //           } catch {
  //             // The `setAll` method was called from a Server Component.
  //             // This can be ignored if you have middleware refreshing user sessions.
  //           }
  //         },
  //       },
  //     }
  //   );

  //   const {error} = await supabase.auth.exchangeCodeForSession(code);

  //   if(!error){
  //     return NextResponse.redirect(`${origin}${next}`);
  //   }
  // }

  // return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);

  try {
    const cookieStore = await cookies();

    // Check if env vars are actually loaded
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase Environment Variables are missing.');
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              console.warn('Cookie setting warning:', error);
            }
          },
        },
      }
    );

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
