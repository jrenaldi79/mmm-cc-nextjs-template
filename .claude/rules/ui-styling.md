# UI & Styling — Tailwind + shadcn/ui (applies to `app/**`, `components/**`)

- **Component library**: this template uses **shadcn/ui** (new-york style). Reusable
  primitives live in `components/ui/` (Button, Card, Input, Label, Checkbox, Badge, Select,
  Chart). **Prefer composing these over hand-rolling** — reach for a primitive first.
- **Adding components**: `npx shadcn@latest add <name>` (e.g. `dialog`, `table`). If the CLI
  can't reach the registry, copy source from https://ui.shadcn.com/docs/components into
  `components/ui/`.
- **Design tokens**: colors are CSS variables (HSL) in `app/globals.css`, mapped in
  `tailwind.config.js` (`bg-primary`, `text-muted-foreground`, `border-border`). Use tokens,
  not hard-coded colors, so light/dark theming stays consistent.
- **`cn()` helper**: merge class names with `cn()` from `@/lib/utils`.
- **Charts**: use **Recharts** via the shadcn chart wrapper in `components/ui/chart*`
  (`ChartContainer`, `ChartTooltip`, `ChartLegend`). See `app/charts/page.tsx`. Add more
  chart types from https://ui.shadcn.com/charts.
- **Version**: stay on Tailwind CSS v3.4.x (`tailwindcss@^3.4.0`) with PostCSS config and
  `@tailwind` directives in `app/globals.css`.
- **Best practices**: utility classes, responsive/mobile-first, accessible components
  (shadcn/ui is built on Radix primitives).
