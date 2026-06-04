'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Navigation from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TestResult {
  title: string;
  status: 'passed' | 'failed' | 'pending' | 'skipped';
  failureMessages?: string[];
}

interface TestSuite {
  name: string;
  status: string;
  tests: TestResult[];
  duration: number;
}

interface Coverage {
  lines: string;
  statements: string;
  functions: string;
  branches: string;
}

interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  pendingTests: number;
  success: boolean;
}

interface TestRunResult {
  success: boolean;
  summary: TestSummary | null;
  testSuites: TestSuite[];
  coverage: Coverage | null;
  error?: string;
}

export default function TestDashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestRunResult | null>(null);
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set());

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

  const toggleSuite = (suiteName: string) => {
    const newExpanded = new Set(expandedSuites);
    if (newExpanded.has(suiteName)) {
      newExpanded.delete(suiteName);
    } else {
      newExpanded.add(suiteName);
    }
    setExpandedSuites(newExpanded);
  };

  const getCoverageColor = (percentage: string) => {
    const pct = parseFloat(percentage);
    if (pct >= 80) return 'text-green-600';
    if (pct >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCoverageBarColor = (percentage: string) => {
    const pct = parseFloat(percentage);
    if (pct >= 80) return 'bg-green-500';
    if (pct >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Test Dashboard</h1>
            <p className="text-muted-foreground">Run your tests and see the results in a friendly format</p>
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
              {results.summary && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Test Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-3xl font-bold text-gray-700">{results.summary.totalTests}</div>
                        <div className="text-sm text-muted-foreground mt-1">Total Tests</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600">✓ {results.summary.passedTests}</div>
                        <div className="text-sm text-muted-foreground mt-1">Passing</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-3xl font-bold text-red-600">✗ {results.summary.failedTests}</div>
                        <div className="text-sm text-muted-foreground mt-1">Failing</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-3xl font-bold text-yellow-600">⏭ {results.summary.pendingTests}</div>
                        <div className="text-sm text-muted-foreground mt-1">Skipped</div>
                      </div>
                    </div>

                    {results.summary.success ? (
                      <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <p className="text-green-800 font-semibold">🎉 All tests passed! Great work!</p>
                      </div>
                    ) : (
                      <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                        <p className="text-red-800 font-semibold">
                          {results.summary.failedTests} {results.summary.failedTests === 1 ? 'test needs' : 'tests need'} attention
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {results.coverage && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Code Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      Coverage shows how much of your code is being tested. Higher percentages are better!
                    </p>

                    <div className="space-y-4">
                      {([
                        ['Lines', results.coverage.lines, 'This shows what percentage of code lines were executed during testing'],
                        ['Statements', results.coverage.statements, 'This measures individual statements that were run during tests'],
                        ['Functions', results.coverage.functions, 'This shows what percentage of your functions were called during testing'],
                        ['Branches', results.coverage.branches, 'This measures different paths through your code (if/else statements, etc.)'],
                      ] as const).map(([label, value, explanation]) => (
                        <div key={label}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{label}</span>
                            <span className={`font-bold ${getCoverageColor(value)}`}>
                              {value}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${getCoverageBarColor(value)}`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{explanation}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">What does coverage mean?</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• <strong>Green (80%+)</strong> - Excellent! Your code is well tested</li>
                        <li>• <strong>Yellow (60-79%)</strong> - Good, but there&apos;s room for improvement</li>
                        <li>• <strong>Red (&lt;60%)</strong> - More tests needed to ensure code quality</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.testSuites && results.testSuites.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Test Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.testSuites.map((suite, idx) => (
                        <div key={idx} className="border rounded-lg overflow-hidden">
                          <Button
                            variant="ghost"
                            onClick={() => toggleSuite(suite.name)}
                            className="w-full h-auto px-4 py-3 bg-muted/50 hover:bg-muted flex items-center justify-between rounded-none"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-muted-foreground">
                                {expandedSuites.has(suite.name) ? '▼' : '▶'}
                              </span>
                              <span className="font-medium text-left">{suite.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className={
                                  suite.status === 'passed'
                                    ? 'bg-green-100 text-green-800 border-green-200'
                                    : 'bg-red-100 text-red-800 border-red-200'
                                }
                              >
                                {suite.status === 'passed' ? '✓ Passed' : '✗ Failed'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{suite.duration}ms</span>
                            </div>
                          </Button>

                          {expandedSuites.has(suite.name) && (
                            <div className="p-4 bg-card border-t">
                              <div className="space-y-2">
                                {suite.tests.map((test, testIdx) => (
                                  <div key={testIdx} className="pl-4 py-2 border-l-2">
                                    <div className="flex items-start space-x-2">
                                      <span className={`mt-1 ${
                                        test.status === 'passed'
                                          ? 'text-green-600'
                                          : test.status === 'failed'
                                          ? 'text-red-600'
                                          : 'text-yellow-600'
                                      }`}>
                                        {test.status === 'passed' ? '✓' : test.status === 'failed' ? '✗' : '⏭'}
                                      </span>
                                      <div className="flex-1">
                                        <p className="text-foreground">{test.title}</p>
                                        {test.failureMessages && test.failureMessages.length > 0 && (
                                          <div className="mt-2 p-3 bg-red-50 rounded text-sm">
                                            <p className="font-semibold text-red-800 mb-1">Error:</p>
                                            {test.failureMessages.map((msg, msgIdx) => (
                                              <pre key={msgIdx} className="text-red-700 whitespace-pre-wrap font-mono text-xs">
                                                {msg}
                                              </pre>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.error && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                      <p className="text-red-800 font-semibold">Error running tests</p>
                      <p className="text-red-700 text-sm mt-2">{results.error}</p>
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
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Ready to test your code?</h2>
                <p className="text-muted-foreground">Click the button above to run all your tests and see the results</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
