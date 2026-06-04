import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TddFrameworkCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🧪 Test-Driven Development (TDD) Framework</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          This template enforces TDD methodology. Every feature must start with
          tests!
        </p>

        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-bold text-red-700 mb-1">
              🔴 Red Phase - Write Failing Tests
            </h4>
            <p className="text-muted-foreground text-sm mb-2">
              Start by writing tests that define what success looks like.
            </p>
            <div className="bg-muted/50 p-3 rounded text-sm font-mono">
              <div className="text-muted-foreground">
                # Create test file first
              </div>
              <div className="text-blue-600">
                tests/unit/app/api/users/route.test.ts
              </div>
              <div className="text-muted-foreground mt-2">
                # Run tests - they should fail!
              </div>
              <div className="text-red-600">
                npm test -- ❌ FAIL (0 passing, 3 failing)
              </div>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-bold text-green-700 mb-1">
              🟢 Green Phase - Make Tests Pass
            </h4>
            <p className="text-muted-foreground text-sm mb-2">
              Write the simplest code to make your tests pass.
            </p>
            <div className="bg-muted/50 p-3 rounded text-sm font-mono">
              <div className="text-muted-foreground">
                # Now create implementation
              </div>
              <div className="text-blue-600">app/api/users/route.ts</div>
              <div className="text-muted-foreground mt-2">
                # Run tests again
              </div>
              <div className="text-green-600">
                npm test -- ✓ PASS (3 passing)
              </div>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-bold text-blue-700 mb-1">
              🔵 Refactor Phase - Optimize Code
            </h4>
            <p className="text-muted-foreground text-sm mb-2">
              Clean up and optimize while keeping tests green.
            </p>
            <div className="bg-muted/50 p-3 rounded text-sm font-mono">
              <div className="text-muted-foreground">
                # Refactor implementation
              </div>
              <div className="text-muted-foreground">
                # Run tests after each change
              </div>
              <div className="text-green-600">npm test -- ✓ Still passing!</div>
              <div className="text-muted-foreground mt-2"># Check coverage</div>
              <div className="text-purple-600">
                npm run test:coverage -- 85% coverage ✓
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Important:</strong> The AI assistant will refuse to write
            implementation code until tests are written first. This ensures you
            always have a safety net and clear specifications for your features.
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-blue-800 font-semibold mb-2">
            🎯 Visual Test Dashboard
          </p>
          <p className="text-blue-700 mb-4">
            Not comfortable with the command line? Use the Test Dashboard to run
            tests and see results in a friendly interface!
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/test-dashboard">Open Test Dashboard →</Link>
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" size="sm">
            npm test
          </Button>
          <Button variant="secondary" size="sm">
            npm run test:watch
          </Button>
          <Button variant="secondary" size="sm">
            npm run test:coverage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
