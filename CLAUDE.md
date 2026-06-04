# Northwestern MPD2 Starter Template

This file is the lean entry point for agents. Detailed, path-scoped guidance lives in
`.claude/rules/` (auto-loaded when editing matching files) and longer references in `docs/`.
Mechanical enforcement (git hooks + check scripts) is the source of truth — prose guides,
hooks enforce.

## Project Overview

A **Next.js 16** starter template for Northwestern MPD2 students: TypeScript, Tailwind CSS +
shadcn/ui, Supabase (auth + data, `@supabase/ssr`), a TDD framework, and an n8n LLM streaming
chat scaffold. The app is **login-controlled** (everything outside `/login`, `/signup`,
`/auth/*` requires a session). The `/` route is a shell that students replace with their own
project.

- **Your role**: expert in TypeScript, Node.js, React, Next.js 16, Tailwind, and shadcn/ui.
- **New project? Start here**: walk through [docs/getting-started.md](docs/getting-started.md)
  (first-time setup: env, Supabase, auth, verify) — then delete it once bootstrapping is done.

---

## Essential Commands

```bash
npm run dev            # Dev server (http://localhost:5000)
npm run build          # Production build
npm run lint           # ESLint
npm run type-check     # tsc --noEmit
npm run validate       # type-check + lint (run before committing)
npm run format         # Prettier write
npm test               # Jest (unit + integration)
npm run test:coverage  # Coverage report (80% gate)
```

### Enforcement scripts (run in git hooks)

```bash
node scripts/check-secrets.js          # Block staged secrets (API keys, tokens, private keys)
node scripts/check-file-sizes.js       # Block source files over 300 lines
node scripts/check-test-colocation.js  # Block source modules without a test in tests/
node scripts/generate-docs.js          # Regenerate the AUTO sections below
node scripts/generate-docs.js --check  # CI: verify AUTO sections are current
node scripts/validate-docs.js --full   # Verify required doc sections/markers exist
```

`.claude/settings.json` pre-approves test/lint/build/format, `node scripts/*`, and safe git;
denies `rm -rf /`, force-push, hard reset, `npm publish`, and pipe-to-shell.

---

## Directory Structure

<!-- AUTO:tree -->
app/
├── api/
│   ├── chat/
│   │   └── route.ts  # Streams an LLM agent response back to the UI.
│   ├── tasks/
│   │   ├── [id]/
│   │   │   └── route.ts
│   │   └── route.ts
│   └── test-runner/
│       └── route.ts
├── auth/
│   ├── callback/
│   │   └── route.ts  # OAuth / PKCE callback. The provider redirects here with a `?code=...` which
│   ├── confirm/
│   │   └── route.ts  # Email confirmation / magic-link handler. Supabase emails a link containing a
│   └── signout/
│       └── route.ts  # Signs the user out and sends them to /login. Called by the Sign Out form in
├── charts/
│   └── page.tsx
├── chat/
│   └── page.tsx
├── components/
│   ├── ExampleComponent.tsx
│   ├── Navigation.tsx
│   └── OAuthButtons.tsx  # Social sign-in buttons. OAuth must be initiated from the browser because it
├── login/
│   ├── actions.ts  # Email/password sign-in. Called as a form action from /login.
│   └── page.tsx
├── signup/
│   └── page.tsx
├── tasks/
│   └── page.tsx
├── test-dashboard/
│   ├── components/
│   │   ├── CoverageCard.tsx
│   │   ├── TestSuiteList.tsx
│   │   └── TestSummaryCard.tsx
│   ├── page.tsx
│   └── types.ts
├── globals.css
├── layout.tsx
└── page.tsx
components/
└── ui/
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── chart-container.tsx
    ├── chart-context.tsx
    ├── chart-legend.tsx
    ├── chart-tooltip.tsx
    ├── chart.tsx
    ├── checkbox.tsx
    ├── input.tsx
    ├── label.tsx
    └── select.tsx  # A lightweight select built on the native `<select>` element.
lib/
├── supabase/
│   ├── client.ts  # Supabase client for use inside Client Components (`'use client'`).
│   ├── middleware.ts  # Refreshes the Supabase auth session on every request and gates access.
│   └── server.ts  # Supabase client for use on the server: Server Components, Route Handlers, and
└── utils.ts  # Merge Tailwind class names, resolving conflicts (later classes win).
types/
├── index.ts
└── supabase.ts
<!-- /AUTO:tree -->

---

## Key Modules

<!-- AUTO:modules -->
| Module | Purpose | Key Exports |
|--------|---------|-------------|
| `app/layout.tsx` |  | `metadata`, `RootLayout` |
| `app/page.tsx` |  | `HomePage` |
| `app/api/chat/route.ts` | Streams an LLM agent response back to the UI. | `maxDuration`, `POST` |
| `app/api/tasks/route.ts` |  | `GET`, `POST` |
| `app/api/tasks/[id]/route.ts` |  | `PATCH`, `DELETE` |
| `app/api/test-runner/route.ts` |  | `POST` |
| `app/auth/callback/route.ts` | OAuth / PKCE callback. The provider redirects here with a `?code=...` which | `GET` |
| `app/auth/confirm/route.ts` | Email confirmation / magic-link handler. Supabase emails a link containing a | `GET` |
| `app/auth/signout/route.ts` | Signs the user out and sends them to /login. Called by the Sign Out form in | `POST` |
| `app/charts/page.tsx` |  | `ChartsPage` |
| `app/chat/page.tsx` |  | `ChatPage` |
| `app/components/ExampleComponent.tsx` |  | `ExampleComponent` |
| `app/components/Navigation.tsx` |  | `Navigation` |
| `app/components/OAuthButtons.tsx` | Social sign-in buttons. OAuth must be initiated from the browser because it | `OAuthButtons` |
| `app/login/actions.ts` | Email/password sign-in. Called as a form action from /login. | `login`, `signup` |
| `app/login/page.tsx` |  | `LoginPage`, `default` |
| `app/signup/page.tsx` |  | `SignupPage`, `default` |
| `app/tasks/page.tsx` |  | `TasksPage` |
| `app/test-dashboard/page.tsx` |  | `TestDashboard` |
| `app/test-dashboard/types.ts` |  | `TestResult`, `TestSuite`, `Coverage`, `TestSummary`, `TestRunResult` |
| `app/test-dashboard/components/CoverageCard.tsx` |  | `CoverageCard` |
| `app/test-dashboard/components/TestSuiteList.tsx` |  | `TestSuiteList` |
| `app/test-dashboard/components/TestSummaryCard.tsx` |  | `TestSummaryCard` |
| `components/ui/badge.tsx` |  | `BadgeProps`, `Badge`, `badgeVariants` |
| `components/ui/button.tsx` |  | `ButtonProps`, `Button`, `buttonVariants` |
| `components/ui/card.tsx` |  | `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardDescription` |
| `components/ui/chart-container.tsx` |  | `ChartContainer` |
| `components/ui/chart-context.tsx` |  | `THEMES`, `ChartConfig`, `ChartContext`, `useChart`, `ChartStyle` |
| `components/ui/chart-legend.tsx` |  | `ChartLegend`, `ChartLegendContent` |
| `components/ui/chart-tooltip.tsx` |  | `ChartTooltip`, `ChartTooltipContent` |
| `components/ui/chart.tsx` |  | `ChartStyle`, `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend` |
| `components/ui/checkbox.tsx` |  | `Checkbox` |
| `components/ui/input.tsx` |  | `Input` |
| `components/ui/label.tsx` |  | `Label` |
| `components/ui/select.tsx` | A lightweight select built on the native `<select>` element. | `Select` |
| `lib/utils.ts` | Merge Tailwind class names, resolving conflicts (later classes win). | `cn` |
| `lib/supabase/client.ts` | Supabase client for use inside Client Components (`'use client'`). | `createClient` |
| `lib/supabase/middleware.ts` | Refreshes the Supabase auth session on every request and gates access. | `updateSession` |
| `lib/supabase/server.ts` | Supabase client for use on the server: Server Components, Route Handlers, and | `createClient` |
| `types/index.ts` |  | `ApiError` |
| `types/supabase.ts` |  | `Json`, `Database`, `Task`, `TaskInsert`, `TaskUpdate` |
<!-- /AUTO:modules -->

---

## Rules Map (path-scoped, in `.claude/rules/`)

| When editing… | Rule |
|---------------|------|
| Any feature work | [tdd.md](.claude/rules/tdd.md) — **TDD is the law** (tests first) |
| `tests/**` / any source | [testing.md](.claude/rules/testing.md) — centralized `tests/`, 80% gate |
| Any source | [code-quality.md](.claude/rules/code-quality.md) — 300-line limit, logging, doc sync |
| `**/*.ts(x)` | [typescript.md](.claude/rules/typescript.md) — strict, naming, default-export exemptions |
| `app/**`, `components/**` (tsx) | [react.md](.claude/rules/react.md) · [ui-styling.md](.claude/rules/ui-styling.md) |
| `app/api/**` | [api.md](.claude/rules/api.md) — REST, Zod, server client |
| `lib/supabase/**`, `app/auth/**`, `middleware.ts` | [database.md](.claude/rules/database.md) — Supabase + auth |
| Anything sensitive | [security.md](.claude/rules/security.md) — RLS, secrets, input validation |

## Docs Map

| Topic | File |
|-------|------|
| First-time setup (bootstrapping) | [docs/getting-started.md](docs/getting-started.md) |
| Supabase project + schema + auth setup | [SUPABASE_SETUP.md](SUPABASE_SETUP.md) |
| n8n LLM agent streaming chat | [docs/integrations/n8n.md](docs/integrations/n8n.md) |

---

## TDD — The Law (summary)

**EVERY feature or change starts with a failing test, before any implementation.** Red →
Green → Refactor. The pre-commit hook blocks staged source modules with no matching test.
Full rule: [.claude/rules/tdd.md](.claude/rules/tdd.md).

## Code Quality (summary)

- **300-line limit** on source in `app/`/`components/`/`lib/`/`types/` (hook-enforced; tests
  and `*.d.ts` exempt). **Functions** under ~50 lines.
- **Docs sync**: the pre-commit hook regenerates the AUTO sections above and auto-stages
  CLAUDE.md. Do not hand-edit content between `<!-- AUTO:* -->` markers.
- Full rules: [.claude/rules/code-quality.md](.claude/rules/code-quality.md).

---

## Git Hooks (husky)

| Hook | Steps |
|------|-------|
| **pre-commit** | `lint-staged` (eslint + prettier on staged) → `check-secrets` → `check-file-sizes` → `check-test-colocation` → `generate-docs` → `validate-docs` |
| **pre-push** | `validate` + `test` (SHA-cached via `.test-passed`, skipped if HEAD already passed) → `npm audit` (warn-only) |

---

## Working in this repo

- **Server validation**: after starting the dev server, check its output for warnings/errors
  before proceeding.
- **Library verification**: verify library versions before installing (especially CSS
  frameworks); restart the dev server fully when chasing styling issues.
- **Initial connection tests**: test auth/external API connections with small scripts before
  building major features.
- **Response style**: simple, everyday language. Don't remove existing code/comments or
  reformat unrelated code unless necessary for the change.
- **Maintenance**: update CLAUDE.md / the relevant `.claude/rules/*` when adding major
  dependencies or architectural patterns, changing structure or env vars, or changing API
  response formats or testing patterns.
