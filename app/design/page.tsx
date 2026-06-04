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
      <main className="container mx-auto space-y-14 px-6 py-10">
        <header className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Your Design System
          </h1>
          <p className="max-w-3xl text-muted-foreground">
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
