import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AiInstructionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🤖 AI Coding Assistant Instructions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          The{' '}
          <code className="bg-purple-100 px-2 py-1 rounded text-purple-700 font-mono">
            CLAUDE.md
          </code>{' '}
          file is your command center for AI coding assistants. It contains
          comprehensive rules and guidelines that any AI agent will follow when
          helping you code.
        </p>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
          <p className="text-purple-800 font-semibold mb-2">
            What&apos;s in CLAUDE.md:
          </p>
          <ul className="list-disc list-inside text-purple-700 space-y-1">
            <li>
              <strong>Project Architecture</strong> - Tech stack, dependencies,
              and structure
            </li>
            <li>
              <strong>TDD Requirements</strong> - Mandatory test-first
              development (80% coverage)
            </li>
            <li>
              <strong>Coding Standards</strong> - TypeScript, React, and Next.js
              best practices
            </li>
            <li>
              <strong>Security Rules</strong> - Input validation, authentication
              patterns
            </li>
            <li>
              <strong>API Design</strong> - RESTful conventions and response
              formats
            </li>
            <li>
              <strong>Performance Guidelines</strong> - Optimization strategies
            </li>
          </ul>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>💡 Pro Tip:</strong> As you develop your app, update{' '}
            <code className="bg-muted px-1 rounded">CLAUDE.md</code> with:
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
  );
}
