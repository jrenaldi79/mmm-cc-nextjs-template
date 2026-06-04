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
- **Design system (`DESIGN.md`)**: the repo-root [`DESIGN.md`](../../DESIGN.md) describes the
  app's visual identity (colors, typography, components) in Google's DESIGN.md format. **Read
  it before generating UI** so output stays on-brand. The **live** tokens are the HSL vars in
  `app/globals.css` — edit those directly to change the theme; `DESIGN.md` documents them and
  is updated alongside to stay accurate. Format note: `DESIGN.md` colors are hex/oklch, the
  live vars are `H S% L%` (no `hsl()` wrapper); keep `*-foreground` pairs WCAG AA. Validate
  the file with `npm run design:lint`.
- **`cn()` helper**: merge class names with `cn()` from `@/lib/utils`.
- **Charts**: use **Recharts** via the shadcn chart wrapper in `components/ui/chart*`
  (`ChartContainer`, `ChartTooltip`, `ChartLegend`). See `app/charts/page.tsx`. Add more
  chart types from https://ui.shadcn.com/charts.
- **Version**: stay on Tailwind CSS v3.4.x (`tailwindcss@^3.4.0`) with PostCSS config and
  `@tailwind` directives in `app/globals.css`.
- **Best practices**: utility classes, responsive/mobile-first, accessible components
  (shadcn/ui is built on Radix primitives).
