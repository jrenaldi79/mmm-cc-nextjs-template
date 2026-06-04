import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names, resolving conflicts (later classes win).
 * Used by all shadcn/ui components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Studio Bauhaus card chrome — 2px ink border + hard offset shadow.
 * Use `studioCard` for static panels, `studioCardHover` for interactive cards.
 */
export const studioCard = 'border-2 border-foreground rounded-2xl shadow-hard';

export const studioCardHover =
  studioCard +
  ' transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg';
