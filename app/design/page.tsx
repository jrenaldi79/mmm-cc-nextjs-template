import type { Metadata } from 'next';
import Navigation from '../components/Navigation';
import { ConceptsSection } from './components/ConceptsSection';
import { ColorTokens } from './components/ColorTokens';
import { TypeAndShapeSection } from './components/TypeAndShapeSection';
import { ComponentGallery } from './components/ComponentGallery';
import { EnforcementSection } from './components/EnforcementSection';
import { AddComponentGuide } from './components/AddComponentGuide';

export const metadata: Metadata = {
  title: 'Design System',
  description:
    'A guided tour of this app’s design system — colors, components, and how consistency is enforced.',
};

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto w-full max-w-content space-y-16 px-6 py-12 md:px-9">
        <header className="space-y-4">
          <span className="inline-flex rounded-full bg-foreground px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-background">
            ● Design System
          </span>
          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
            The{' '}
            <span className="font-serif font-normal italic text-primary">
              living
            </span>{' '}
            design system.
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            A guided tour of how this app stays good-looking and consistent —
            what a design system is, the colors and building blocks you have,
            how new components get added, and how it&apos;s all kept on-brand
            automatically. No experience needed.
          </p>
        </header>

        <ConceptsSection />
        <ColorTokens />
        <TypeAndShapeSection />
        <ComponentGallery />
        <EnforcementSection />
        <AddComponentGuide />
      </main>
    </div>
  );
}
