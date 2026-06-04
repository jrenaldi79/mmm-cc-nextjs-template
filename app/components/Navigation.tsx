'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-card shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center gap-4">
          <Link
            href="/"
            className="text-2xl font-bold hover:text-primary transition-colors"
          >
            My Next.js App
          </Link>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" asChild>
              <Link href="/">🏠 Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/tasks">✅ Tasks Example</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/charts">📊 Charts</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/chat">💬 Chat</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/test-dashboard">🧪 Test Dashboard</Link>
            </Button>

            {email && (
              <div className="flex items-center gap-2 pl-2 ml-1 border-l">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {email}
                </span>
                <form action="/auth/signout" method="post">
                  <Button type="submit" variant="ghost">
                    Sign Out
                  </Button>
                </form>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
