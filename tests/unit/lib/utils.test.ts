import { cn } from '@/lib/utils';
import { studioCard, studioCardHover } from '@/lib/utils';

describe('cn', () => {
  it('merges multiple class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('resolves conflicting Tailwind classes (later wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('ignores falsey/conditional values', () => {
    expect(cn('a', false && 'b', undefined, null, 'c')).toBe('a c');
  });

  it('supports conditional object and array inputs', () => {
    expect(cn(['a', 'b'], { c: true, d: false })).toBe('a b c');
  });
});

describe('studio card classes', () => {
  it('studioCard carries the ink border and hard shadow', () => {
    expect(studioCard).toContain('border-foreground');
    expect(studioCard).toContain('shadow-hard');
  });

  it('studioCardHover extends studioCard with a hover transform', () => {
    expect(studioCardHover.startsWith(studioCard)).toBe(true);
    expect(studioCardHover).toContain('hover:shadow-hard-lg');
  });
});
