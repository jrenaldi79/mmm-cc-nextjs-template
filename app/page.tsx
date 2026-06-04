import React from 'react';
import ExampleComponent from './components/ExampleComponent';
import Navigation from './components/Navigation';
import { WelcomeCard } from './components/home/WelcomeCard';
import { AiInstructionsCard } from './components/home/AiInstructionsCard';
import { TddFrameworkCard } from './components/home/TddFrameworkCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const resources = [
  {
    href: 'https://ui.shadcn.com/docs',
    title: 'shadcn/ui',
    description: 'Accessible component building blocks',
  },
  {
    href: 'https://tailwindcss.com/docs',
    title: 'Tailwind CSS',
    description: 'Utility-first CSS framework',
  },
  {
    href: 'https://www.typescriptlang.org/docs/',
    title: 'TypeScript',
    description: 'JavaScript with syntax for types',
  },
  {
    href: 'https://react.dev',
    title: 'React',
    description: 'Library for web and native UIs',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navigation />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <WelcomeCard />
          <AiInstructionsCard />
          <TddFrameworkCard />

          <Card>
            <CardHeader>
              <CardTitle>Example Component</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Below is a simple example component to show you the structure.
                Feel free to modify or delete it!
              </p>
              <ExampleComponent />
            </CardContent>
          </Card>

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
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="mt-auto border-t bg-card">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-muted-foreground">
            Northwestern MPD2 Starter Template | Built with Next.js 16,
            TypeScript, Tailwind CSS &amp; shadcn/ui
          </p>
          <p className="text-center text-sm text-muted-foreground mt-2">
            💡 Tip: Start by editing{' '}
            <code className="bg-muted px-2 py-1 rounded">app/page.tsx</code> and
            check <code className="bg-muted px-2 py-1 rounded">CLAUDE.md</code>{' '}
            for AI instructions
          </p>
        </div>
      </footer>
    </div>
  );
}
