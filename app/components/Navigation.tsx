'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navigation() {
  return (
    <header className="bg-card shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-primary transition-colors">
            My Next.js App
          </Link>
          <nav className="flex gap-1">
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
          </nav>
        </div>
      </div>
    </header>
  )
}
