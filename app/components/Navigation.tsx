'use client'

import Link from 'next/link'

export default function Navigation() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-purple-600 transition-colors">
            My Next.js App
          </Link>
          <nav className="flex gap-4">
            <Link 
              href="/"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              🏠 Home
            </Link>
            <Link 
              href="/tasks"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              ✅ Tasks Example
            </Link>
            <Link 
              href="/markdown-preview"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              📚 BMAD Docs
            </Link>
            <Link 
              href="/test-dashboard"
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              🧪 Test Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
