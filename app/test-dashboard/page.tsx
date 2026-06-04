'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';

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
    } catch (error) {
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Test Dashboard</h1>
          <p className="text-gray-600">Run your tests and see the results in a friendly format</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={runTests}
            disabled={isRunning}
            className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all ${
              isRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isRunning ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Running tests... this may take a moment
              </span>
            ) : (
              '▶ Run All Tests'
            )}
          </button>
        </div>

        {results && (
          <>
            {results.summary && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-700">{results.summary.totalTests}</div>
                    <div className="text-sm text-gray-600 mt-1">Total Tests</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">✓ {results.summary.passedTests}</div>
                    <div className="text-sm text-gray-600 mt-1">Passing</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">✗ {results.summary.failedTests}</div>
                    <div className="text-sm text-gray-600 mt-1">Failing</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">⏭ {results.summary.pendingTests}</div>
                    <div className="text-sm text-gray-600 mt-1">Skipped</div>
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
              </div>
            )}

            {results.coverage && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Code Coverage</h2>
                <p className="text-gray-600 mb-6">
                  Coverage shows how much of your code is being tested. Higher percentages are better!
                </p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Lines</span>
                      <span className={`font-bold ${getCoverageColor(results.coverage.lines)}`}>
                        {results.coverage.lines}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getCoverageBarColor(results.coverage.lines)}`}
                        style={{ width: `${results.coverage.lines}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      This shows what percentage of code lines were executed during testing
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Statements</span>
                      <span className={`font-bold ${getCoverageColor(results.coverage.statements)}`}>
                        {results.coverage.statements}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getCoverageBarColor(results.coverage.statements)}`}
                        style={{ width: `${results.coverage.statements}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      This measures individual statements that were run during tests
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Functions</span>
                      <span className={`font-bold ${getCoverageColor(results.coverage.functions)}`}>
                        {results.coverage.functions}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getCoverageBarColor(results.coverage.functions)}`}
                        style={{ width: `${results.coverage.functions}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      This shows what percentage of your functions were called during testing
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Branches</span>
                      <span className={`font-bold ${getCoverageColor(results.coverage.branches)}`}>
                        {results.coverage.branches}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getCoverageBarColor(results.coverage.branches)}`}
                        style={{ width: `${results.coverage.branches}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      This measures different paths through your code (if/else statements, etc.)
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">What does coverage mean?</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Green (80%+)</strong> - Excellent! Your code is well tested</li>
                    <li>• <strong>Yellow (60-79%)</strong> - Good, but there's room for improvement</li>
                    <li>• <strong>Red (&lt;60%)</strong> - More tests needed to ensure code quality</li>
                  </ul>
                </div>
              </div>
            )}

            {results.testSuites && results.testSuites.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">Test Details</h2>
                <div className="space-y-3">
                  {results.testSuites.map((suite, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSuite(suite.name)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-400">
                            {expandedSuites.has(suite.name) ? '▼' : '▶'}
                          </span>
                          <span className="font-medium text-left">{suite.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded text-sm font-medium ${
                            suite.status === 'passed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {suite.status === 'passed' ? '✓ Passed' : '✗ Failed'}
                          </span>
                          <span className="text-sm text-gray-500">{suite.duration}ms</span>
                        </div>
                      </button>
                      
                      {expandedSuites.has(suite.name) && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <div className="space-y-2">
                            {suite.tests.map((test, testIdx) => (
                              <div key={testIdx} className="pl-4 py-2 border-l-2 border-gray-200">
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
                                    <p className="text-gray-800">{test.title}</p>
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
              </div>
            )}

            {results.error && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="text-red-800 font-semibold">Error running tests</p>
                  <p className="text-red-700 text-sm mt-2">{results.error}</p>
                </div>
              </div>
            )}
          </>
        )}

        {!results && !isRunning && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🧪</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Ready to test your code?</h2>
            <p className="text-gray-600">Click the button above to run all your tests and see the results</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
