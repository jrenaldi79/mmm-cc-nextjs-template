import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function WelcomeCard() {
  return (
    <Card>
      <CardContent className="pt-8">
        <h2 className="text-3xl font-bold mb-4">
          🚀 Northwestern MMM &amp; MPD2 Starter Template
        </h2>
        <p className="text-muted-foreground mb-6">
          Welcome to your Next.js starter project! This is a &quot;shell&quot;
          app that you&apos;ll replace with your own amazing idea.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-800 font-semibold mb-2">
            💡 Quick Start Guide:
          </p>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Replace this page with your app&apos;s home page</li>
            <li>
              Add your components in the{' '}
              <code className="bg-blue-100 px-1 rounded">app/components</code>{' '}
              folder
            </li>
            <li>
              Build your UI with{' '}
              <code className="bg-blue-100 px-1 rounded">shadcn/ui</code>{' '}
              components in{' '}
              <code className="bg-blue-100 px-1 rounded">components/ui</code>
            </li>
            <li>
              Create API routes in{' '}
              <code className="bg-blue-100 px-1 rounded">app/api</code>
            </li>
            <li>
              Customize{' '}
              <code className="bg-blue-100 px-1 rounded">CLAUDE.md</code> to
              guide your AI coding assistant
            </li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button variant="secondary" asChild>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Next.js Docs →
            </a>
          </Button>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-green-800 font-semibold mb-2">
            🗄️ Database Integration Example:
          </p>
          <p className="text-green-700 mb-3">
            This template includes a working{' '}
            <strong>Supabase database example</strong> showing full CRUD
            operations.
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/tasks">View Tasks Example →</Link>
          </Button>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mt-4">
          <p className="text-purple-800 font-semibold mb-2">
            📊 Charting Example:
          </p>
          <p className="text-purple-700 mb-3">
            Visualize data with <strong>Recharts</strong> wrapped in shadcn/ui
            chart components.
          </p>
          <Button asChild>
            <Link href="/charts">View Charts Example →</Link>
          </Button>
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mt-4">
          <p className="text-indigo-800 font-semibold mb-2">
            💬 Streaming LLM Agent:
          </p>
          <p className="text-indigo-700 mb-3">
            A chat UI that streams an <strong>n8n</strong> LLM agent response
            token-by-token (with a placeholder until you connect your webhook).
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/chat">Try the Chat Example →</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
