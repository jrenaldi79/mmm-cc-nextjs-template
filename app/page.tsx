import React from 'react'
import Link from 'next/link'
import ExampleComponent from './components/ExampleComponent'
import Navigation from './components/Navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const resources = [
  { href: 'https://ui.shadcn.com/docs', title: 'shadcn/ui', description: 'Accessible component building blocks' },
  { href: 'https://tailwindcss.com/docs', title: 'Tailwind CSS', description: 'Utility-first CSS framework' },
  { href: 'https://www.typescriptlang.org/docs/', title: 'TypeScript', description: 'JavaScript with syntax for types' },
  { href: 'https://react.dev', title: 'React', description: 'Library for web and native UIs' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <Card>
            <CardContent className="pt-8">
              <h2 className="text-3xl font-bold mb-4">
                🚀 Northwestern MPD2 Starter Template
              </h2>
              <p className="text-muted-foreground mb-6">
                Welcome to your Next.js starter project! This is a &quot;shell&quot; app that you&apos;ll replace with your own amazing idea.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-blue-800 font-semibold mb-2">💡 Quick Start Guide:</p>
                <ol className="list-decimal list-inside text-blue-700 space-y-1">
                  <li>Replace this page with your app&apos;s home page</li>
                  <li>Add your components in the <code className="bg-blue-100 px-1 rounded">app/components</code> folder</li>
                  <li>Build your UI with <code className="bg-blue-100 px-1 rounded">shadcn/ui</code> components in <code className="bg-blue-100 px-1 rounded">components/ui</code></li>
                  <li>Create API routes in <code className="bg-blue-100 px-1 rounded">app/api</code></li>
                  <li>Customize <code className="bg-blue-100 px-1 rounded">CLAUDE.md</code> to guide your AI coding assistant</li>
                </ol>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <Button variant="secondary" asChild>
                  <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
                    Next.js Docs →
                  </a>
                </Button>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-green-800 font-semibold mb-2">🗄️ Database Integration Example:</p>
                <p className="text-green-700 mb-3">
                  This template includes a working <strong>Supabase database example</strong> showing full CRUD operations.
                </p>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/tasks">View Tasks Example →</Link>
                </Button>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mt-4">
                <p className="text-purple-800 font-semibold mb-2">📊 Charting Example:</p>
                <p className="text-purple-700 mb-3">
                  Visualize data with <strong>Recharts</strong> wrapped in shadcn/ui chart components.
                </p>
                <Button asChild>
                  <Link href="/charts">View Charts Example →</Link>
                </Button>
              </div>

              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mt-4">
                <p className="text-indigo-800 font-semibold mb-2">💬 Streaming LLM Agent:</p>
                <p className="text-indigo-700 mb-3">
                  A chat UI that streams an <strong>n8n</strong> LLM agent response token-by-token (with a placeholder until you connect your webhook).
                </p>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/chat">Try the Chat Example →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Agent Instructions Section */}
          <Card>
            <CardHeader>
              <CardTitle>🤖 AI Coding Assistant Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                The <code className="bg-purple-100 px-2 py-1 rounded text-purple-700 font-mono">CLAUDE.md</code> file is your command center for AI coding assistants.
                It contains comprehensive rules and guidelines that any AI agent will follow when helping you code.
              </p>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
                <p className="text-purple-800 font-semibold mb-2">What&apos;s in CLAUDE.md:</p>
                <ul className="list-disc list-inside text-purple-700 space-y-1">
                  <li><strong>Project Architecture</strong> - Tech stack, dependencies, and structure</li>
                  <li><strong>TDD Requirements</strong> - Mandatory test-first development (80% coverage)</li>
                  <li><strong>Coding Standards</strong> - TypeScript, React, and Next.js best practices</li>
                  <li><strong>Security Rules</strong> - Input validation, authentication patterns</li>
                  <li><strong>API Design</strong> - RESTful conventions and response formats</li>
                  <li><strong>Performance Guidelines</strong> - Optimization strategies</li>
                </ul>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>💡 Pro Tip:</strong> As you develop your app, update <code className="bg-muted px-1 rounded">CLAUDE.md</code> with:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Your specific API endpoints and their purposes</li>
                  <li>Custom business logic rules</li>
                  <li>Database schema decisions</li>
                  <li>UI/UX preferences for your app</li>
                  <li>Any unique patterns or conventions you establish</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* TDD Framework Section */}
          <Card>
            <CardHeader>
              <CardTitle>🧪 Test-Driven Development (TDD) Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                This template enforces TDD methodology. Every feature must start with tests!
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <h4 className="font-bold text-red-700 mb-1">🔴 Red Phase - Write Failing Tests</h4>
                  <p className="text-muted-foreground text-sm mb-2">Start by writing tests that define what success looks like.</p>
                  <div className="bg-muted/50 p-3 rounded text-sm font-mono">
                    <div className="text-muted-foreground"># Create test file first</div>
                    <div className="text-blue-600">tests/unit/app/api/users/route.test.ts</div>
                    <div className="text-muted-foreground mt-2"># Run tests - they should fail!</div>
                    <div className="text-red-600">npm test -- ❌ FAIL (0 passing, 3 failing)</div>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-bold text-green-700 mb-1">🟢 Green Phase - Make Tests Pass</h4>
                  <p className="text-muted-foreground text-sm mb-2">Write the simplest code to make your tests pass.</p>
                  <div className="bg-muted/50 p-3 rounded text-sm font-mono">
                    <div className="text-muted-foreground"># Now create implementation</div>
                    <div className="text-blue-600">app/api/users/route.ts</div>
                    <div className="text-muted-foreground mt-2"># Run tests again</div>
                    <div className="text-green-600">npm test -- ✓ PASS (3 passing)</div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold text-blue-700 mb-1">🔵 Refactor Phase - Optimize Code</h4>
                  <p className="text-muted-foreground text-sm mb-2">Clean up and optimize while keeping tests green.</p>
                  <div className="bg-muted/50 p-3 rounded text-sm font-mono">
                    <div className="text-muted-foreground"># Refactor implementation</div>
                    <div className="text-muted-foreground"># Run tests after each change</div>
                    <div className="text-green-600">npm test -- ✓ Still passing!</div>
                    <div className="text-muted-foreground mt-2"># Check coverage</div>
                    <div className="text-purple-600">npm run test:coverage -- 85% coverage ✓</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> The AI assistant will refuse to write implementation code until tests are written first.
                  This ensures you always have a safety net and clear specifications for your features.
                </p>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-blue-800 font-semibold mb-2">🎯 Visual Test Dashboard</p>
                <p className="text-blue-700 mb-4">
                  Not comfortable with the command line? Use the Test Dashboard to run tests and see results in a friendly interface!
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/test-dashboard">Open Test Dashboard →</Link>
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="secondary" size="sm">npm test</Button>
                <Button variant="secondary" size="sm">npm run test:watch</Button>
                <Button variant="secondary" size="sm">npm run test:coverage</Button>
              </div>
            </CardContent>
          </Card>

          {/* Example Component Section */}
          <Card>
            <CardHeader>
              <CardTitle>Example Component</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Below is a simple example component to show you the structure. Feel free to modify or delete it!
              </p>
              <ExampleComponent />
            </CardContent>
          </Card>

          {/* Resources Section */}
          <Card>
            <CardHeader>
              <CardTitle>📚 Helpful Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {resources.map((resource) => (
                  <a
                    key={resource.href}
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 border rounded-lg hover:border-primary transition-colors"
                  >
                    <h4 className="font-semibold mb-1">{resource.title}</h4>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-card">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-muted-foreground">
            Northwestern MPD2 Starter Template | Built with Next.js 16, TypeScript, Tailwind CSS &amp; shadcn/ui
          </p>
          <p className="text-center text-sm text-muted-foreground mt-2">
            💡 Tip: Start by editing <code className="bg-muted px-2 py-1 rounded">app/page.tsx</code> and check <code className="bg-muted px-2 py-1 rounded">CLAUDE.md</code> for AI instructions
          </p>
        </div>
      </footer>
    </div>
  )
}
