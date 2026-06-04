'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { TestRunResult } from './types';
import { TestSummaryCard } from './components/TestSummaryCard';
import { CoverageCard } from './components/CoverageCard';
import { TestSuiteList } from './components/TestSuiteList';

export default function TestDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestRunResult | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    setResults(null);

    try {
      const response = await fetch('/api/test-runner', {
        method: 'POST',
      });

      const data = await response.json();
      setResults(data);
    } catch {
      setResults({
        success: false,
        summary: null,
        testSuites: [],
        coverage: null,
        error: 'Failed to run tests. Please try again.',
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Test Dashboard</h1>
            <p className="text-muted-foreground">
              Run your tests and see the results in a friendly format
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <Button
                onClick={runTests}
                disabled={isRunning}
                size="lg"
                className="w-full text-lg h-auto py-4"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Running tests... this may take a moment
                  </>
                ) : (
                  '▶ Run All Tests'
                )}
              </Button>
            </CardContent>
          </Card>

          {results && (
            <>
              {results.summary && <TestSummaryCard summary={results.summary} />}

              {results.coverage && <CoverageCard coverage={results.coverage} />}

              {results.testSuites && results.testSuites.length > 0 && (
                <TestSuiteList testSuites={results.testSuites} />
              )}

              {results.error && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                      <p className="text-red-800 font-semibold">
                        Error running tests
                      </p>
                      <p className="text-red-700 text-sm mt-2">
                        {results.error}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!results && !isRunning && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">🧪</div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  Ready to test your code?
                </h2>
                <p className="text-muted-foreground">
                  Click the button above to run all your tests and see the
                  results
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
