import Link from 'next/link';
import { db } from '@/db';
import { users } from '@/db/schema';
import { createServerClient } from '@supabase/ssr';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { MarketingNav } from '@/components/layouts/MarketingNav';

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
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
  let dbUser = null;

  if (user) {
    const [result] = await db
      .select({
        name: users.name,
        username: users.username,
        avatarUrl: users.avatarUrl,
        credits: users.credits,
      })
      .from(users)
      .where(eq(users.id, user.id));

    dbUser = result || null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <MarketingNav user={dbUser} />

      {/* Page Content Injected Here */}
      <main className="flex-1 flex flex-col pt-16">{children}</main>

      {/* Global Footer */}
      <footer className="w-full py-12 border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-bold text-foreground font-bricolage uppercase">
              Scrappy AI
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                The Digital Architect&apos;s Atelier.
              </p>
            </span>
          </div>

          <div className="flex gap-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#solutions" className="hover:text-primary transition-colors">
              Solutions
            </Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center items-center px-6">
          <p className="text-muted-foreground text-xs tracking-wide">
            © 2026 Scrappy AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
