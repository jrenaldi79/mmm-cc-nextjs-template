---
name: Northwestern MPD2 Starter
colors:
  # Light theme — these mirror the :root values in app/globals.css.
  background: '#FFFFFF'
  foreground: '#020817'
  card: '#FFFFFF'
  cardForeground: '#020817'
  popover: '#FFFFFF'
  popoverForeground: '#020817'
  primary: '#7C3AED'
  primaryForeground: '#F8FAFC'
  secondary: '#F1F5F9'
  secondaryForeground: '#0F172A'
  muted: '#F1F5F9'
  mutedForeground: '#64748B'
  accent: '#F1F5F9'
  accentForeground: '#0F172A'
  destructive: '#EF4444'
  destructiveForeground: '#F8FAFC'
  border: '#E2E8F0'
  input: '#E2E8F0'
  ring: '#7C3AED'
  chart1: '#7C3AED'
  chart2: '#2A9D90'
  chart3: '#264754'
  chart4: '#E8C468'
  chart5: '#F4A462'
typography:
  h1:
    fontFamily: Inter
    fontSize: '2.25rem'
    fontWeight: 700
    lineHeight: '2.5rem'
    letterSpacing: '-0.02em'
  h2:
    fontFamily: Inter
    fontSize: '1.5rem'
    fontWeight: 600
    lineHeight: '2rem'
    letterSpacing: '-0.01em'
  body:
    fontFamily: Inter
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: '1.5rem'
  label:
    fontFamily: Inter
    fontSize: '0.875rem'
    fontWeight: 500
    lineHeight: '1.25rem'
  small:
    fontFamily: Inter
    fontSize: '0.75rem'
    fontWeight: 400
    lineHeight: '1rem'
rounded:
  sm: '4px'
  md: '6px'
  lg: '0.5rem'
spacing:
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '24px'
  xl: '32px'
components:
  button:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primaryForeground}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '0.5rem 1rem'
  buttonSecondary:
    backgroundColor: '{colors.secondary}'
    textColor: '{colors.secondaryForeground}'
    typography: '{typography.label}'
    rounded: '{rounded.md}'
    padding: '0.5rem 1rem'
  card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.cardForeground}'
    rounded: '{rounded.lg}'
    padding: '1.5rem'
---

# DESIGN.md — Your App's Design System

This file is the structured description of your app's **visual identity**, written
in the [Google `DESIGN.md`](https://github.com/google-labs-code/design.md) format.
The YAML tokens above are machine-readable values; the prose below explains _why_
they exist and _how_ to apply them. AI coding agents read this file so the UI they
generate stays consistent with your brand.

## How to edit your design system

The tokens above are **documentation that mirrors the real theme**. The _live_
values that actually style the app are the **HSL CSS variables in
[`app/globals.css`](app/globals.css)** (mapped to Tailwind classes in
`tailwind.config.js`). To rebrand the app, edit those variables **directly** — then
update the matching token here so this file stays accurate.

Each color token maps 1:1 to a CSS variable (drop the `--`, e.g. `primaryForeground`
→ `--primary-foreground`). The one gotcha: `globals.css` stores colors as HSL
**`H S% L%`** (no `hsl()` wrapper), while this file uses hex — convert when you edit.

| Token here            | CSS variable in `app/globals.css` | What it controls                     |
| --------------------- | --------------------------------- | ------------------------------------ |
| `primary`             | `--primary`                       | Main brand / action color            |
| `primaryForeground`   | `--primary-foreground`            | Text/icons on a primary surface      |
| `background`          | `--background`                    | Page background                      |
| `foreground`          | `--foreground`                    | Default body text                    |
| `secondary` / `muted` | `--secondary` / `--muted`         | Subtle surfaces                      |
| `accent`              | `--accent`                        | Hover/highlight surfaces             |
| `destructive`         | `--destructive`                   | Errors / delete actions              |
| `border` / `input`    | `--border` / `--input`            | Hairlines and field borders          |
| `ring`                | `--ring`                          | Focus ring                           |
| `chart1`…`chart5`     | `--chart-1`…`--chart-5`           | Data-visualization palette           |
| `rounded.lg`          | `--radius`                        | Corner radius (md/sm derive from it) |

> **Tip:** after editing, run `npm run design:lint` to validate this file against
> the spec (broken token references, WCAG contrast, etc.). Dark-mode values live in
> the `.dark` block of `app/globals.css` and follow the same variable names.

## Overview

A clean, modern starter identity built on **shadcn/ui (new-york style)**. The feel is
neutral and professional — slate grays for surfaces and text, with a single vivid
**violet** as the brand/action color. It should read as calm and trustworthy, with
plenty of whitespace, so that student projects layered on top look polished by
default. When a specific token isn't defined, prefer restraint: neutral surfaces,
one accent, generous spacing.

## Colors

The palette is **slate neutrals + a violet primary**. `primary` (`#7C3AED`) drives
buttons, links, focus rings, and the first chart series. Neutrals (`background`,
`foreground`, `secondary`, `muted`, `accent`, `border`) come from the slate scale.
`destructive` (`#EF4444`) is reserved for errors and destructive actions only. Every
color has a paired `*Foreground` for accessible text on that surface. The app ships
with a full **dark theme** (the `.dark` block in `app/globals.css`) using the same
token names with darker surfaces and a slightly brighter violet.

## Typography

A single typeface — **Inter** — loaded via `next/font/google` in `app/layout.tsx`.
The scale follows Tailwind's defaults: `h1` for page titles, `h2` for sections,
`body` for prose, `label` for UI/controls, and `small` for captions and metadata.
Headings use tight letter-spacing and heavier weights; body stays at weight 400 for
readability.

## Layout

Spacing uses **Tailwind's default 4px-based scale** (`xs`–`xl` above are the common
steps). Content is centered with a max width via the Tailwind `container` (2rem
padding, capped at 1400px on `2xl`). Design **mobile-first** and let layouts reflow
responsively. Keep generous breathing room — prefer more whitespace over dense UI.

## Elevation & Depth

Depth is **subtle**. Separate surfaces primarily with the `border` color and the
`card`/`background` contrast rather than heavy shadows. Use light shadows only to
lift transient surfaces (popovers, dropdowns, dialogs). Avoid stacking multiple
strong shadows.

## Shapes

Corners are **moderately rounded**. `rounded.lg` (`0.5rem`, the `--radius` value) is
the base; `md` and `sm` derive from it for smaller controls. Keep radii consistent
across a component family — don't mix sharp and pill shapes arbitrarily.

## Components

Reusable primitives live in `components/ui/` (shadcn/ui). Compose those first rather
than hand-rolling markup. The token entries above capture the key ones:

- **button** — violet `primary` surface, `primaryForeground` text, `md` corners.
- **buttonSecondary** — the subtle `secondary` variant for low-emphasis actions.
- **card** — neutral surface with `lg` corners and generous padding.

Express variants (hover, active, disabled) by adjusting the same tokens; keep the
shape and typography consistent within a family.

## Do's and Don'ts

- **Do** use semantic tokens / Tailwind classes (`bg-primary`,
  `text-muted-foreground`, `border-border`) — never hard-coded hex in components.
- **Do** keep text/background pairs at **WCAG AA** contrast (≥ 4.5:1).
- **Do** reach for a `components/ui/` primitive before writing custom UI.
- **Don't** introduce new one-off colors; extend the palette here first.
- **Don't** rely on heavy drop shadows for hierarchy — use borders and spacing.
- **Don't** let this file drift: when you change `app/globals.css`, update the
  matching token here and run `npm run design:lint`.
