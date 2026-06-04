import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TestSummary } from '../types';

export function TestSummaryCard({ summary }: { summary: TestSummary }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-3xl font-bold text-gray-700">
              {summary.totalTests}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Total Tests
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              ✓ {summary.passedTests}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Passing</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600">
              ✗ {summary.failedTests}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Failing</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">
              ⏭ {summary.pendingTests}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Skipped</div>
          </div>
        </div>

        {summary.success ? (
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-green-800 font-semibold">
              🎉 All tests passed! Great work!
            </p>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-800 font-semibold">
              {summary.failedTests}{' '}
              {summary.failedTests === 1 ? 'test needs' : 'tests need'}{' '}
              attention
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
