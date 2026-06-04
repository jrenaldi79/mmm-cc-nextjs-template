# Northwestern MPD2 Starter Template

## Overview
This project is a Next.js 16 starter template for Northwestern MPD2 students. It provides a production-ready foundation with TypeScript, Tailwind CSS, a TDD framework, and Turbopack, accelerating student development by focusing on innovation over setup complexities. The `/` route is a shell main app that students replace with their own projects.

-   **Your Role**: You are an expert in TypeScript, Node.js, React, Next.js 16, Tailwind, and shadcn/ui.
-   **Shell Main App (`/`)**: A starter structure for students to replace with their own projects. This is where you will build.

## 🚀 First-Time Setup (Bootstrapping)

> **AI agent — read this first.** This section is a one-time onboarding script
> for a brand-new user (likely a first-time coder). Walk them through each step
> **interactively and conversationally** — do one step, confirm it worked, then
> move on. Don't dump all the commands at once. Track progress with the
> checklist at the end.
>
> **🧹 Self-cleanup (important):** Once every item in the Setup Checklist is
> checked off, you MUST:
> 1. Delete this entire "First-Time Setup (Bootstrapping)" section from
>    `CLAUDE.md`.
> 2. Rewrite the **Overview** (and **Project Structure**, if it changed) to
>    describe the user's actual project instead of the starter template.
> 3. Commit the cleanup (e.g. "Complete project bootstrapping").
>
> A template that still contains setup scaffolding after setup is confusing.
> Leave the file describing the *real* project, not the bootstrap process.

Guide the user through these steps:

### 1. Install dependencies
- Run `npm install`.
- Confirm it finishes without errors.

### 2. Configure environment variables
- Copy `.env.example` to `.env.local` (`cp .env.example .env.local`).
- Explain that `.env.local` is **gitignored** and must never be committed —
  it holds secrets.
- They'll fill in the Supabase values in the next step. If you add the n8n
  integration later, its variables go here too.

### 3. Create / connect a Supabase project
- Ask whether they already have a Supabase project.
  - If not, walk them through creating a free one at https://supabase.com.
- Have them copy **Project URL** and **anon/public key** from
  *Project Settings → API* into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
  and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SETUP.md` has the detailed, click-by-click walkthrough — point them
  there if they get stuck.

### 4. Create the database schema
- The bundled **Tasks** example needs a `tasks` table. The SQL lives in
  `SUPABASE_SETUP.md`.
- **Preferred path — Supabase MCP:** if the Supabase MCP server is connected,
  you (the agent) can create tables, run migrations (`apply_migration`), and
  inspect the schema directly — offer to do it for them. If it isn't connected,
  tell them how to add it (Supabase MCP: https://supabase.com/docs/guides/getting-started/mcp)
  so you can manage their database, or have them paste the SQL from
  `SUPABASE_SETUP.md` into the Supabase **SQL Editor**.
- When the user designs their **own** features, design the schema together and
  apply it the same way (Supabase MCP `apply_migration` or the SQL Editor).

### 5. Verify everything works
- Run `npm run dev` and open http://localhost:5000.
- Visit `/tasks` and confirm create/toggle/delete works against their Supabase
  project. Visit `/charts` to confirm the UI renders.
- Run `npm test` — all tests should pass.

### Setup Checklist
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` created with Supabase credentials
- [ ] Supabase project created & connected
- [ ] Database schema applied (`tasks` table + any custom tables)
- [ ] App runs locally and `/tasks` works end-to-end
- [ ] `npm test` passes
- [ ] **Cleanup done:** this section removed & Overview rewritten for the real project

## 1. AI Agent Pre-Implementation Checklist

Before writing ANY implementation code, the AI MUST verify:
- [ ] Have I written failing tests that define success?
- [ ] Have I run those tests to confirm they're RED?
- [ ] Can I describe what "passing" looks like in concrete assertions?

If ANY answer is "no" → STOP and write tests first.

## 2. 🚨 THE LAW: Test-Driven Development (TDD) First

**EVERY feature request or code change MUST start by writing tests *before* any implementation. This is the most important rule. There are no exceptions for feature work.**

### TDD Process - ALWAYS FOLLOW:

1.  **Red Phase (REQUIRED FIRST STEP)**:
    -   Your FIRST response to a feature request MUST be: **"Let me start by writing the tests that define what success looks like for this feature."**
    -   Write comprehensive failing tests in the `tests/` directory.
    -   Run tests to confirm they fail (shows "red" in the test runner). This proves the test works.

2.  **Green Phase**:
    -   Implement the **simplest possible code** in the `app/` directory that makes the tests pass.
    -   Run tests to confirm they now pass (shows "green").

3.  **Refactor Phase**:
    -   Clean up and optimize your implementation and test code without changing behavior.
    -   Run tests after each refactor to ensure nothing is broken.

4.  **Finalization Phase**:
    -   Run the full test suite: `npm run test`
    -   Validate test coverage is over 90%: `npm run test:coverage`

### TDD Self-Check Questions
Before writing implementation code, ask yourself:
1.  Have I written tests that will fail without this code?
2.  Have I run those tests and confirmed they are RED?
3.  Can I describe what "passing" looks like in concrete test assertions?
**If the answer to ANY of these is "no", STOP and write the tests first.**

### Correct TDD Pattern:
```
User: "Add streaming tracing support"
Assistant: "Following TDD - I'll write tests first to define what success looks like."
Assistant: *Creates tests/unit/test_streaming_tracing.test.ts*
Assistant: *Runs tests - shows RED (failing)*
Assistant: *NOW creates app/utils/streaming-tracer.ts*
Assistant: *Runs tests again - shows GREEN (passing)*
```

## 3. General Workflow & Verification

-   **Server Validation**: After starting any development server, **ALWAYS** check the server output for warnings, errors, or compilation issues before proceeding.
-   **Library Verification**: Always verify library versions before installation, especially for CSS frameworks.
-   **Initial Connection Tests**: Test authentication and external API connections with simple scripts before building out major features.
-   **Styling Issues**: When encountering styling issues, check CSS framework version compatibility and restart the dev server completely first.

## 4. Project Structure & Naming Conventions

All file paths must conform to this structure.

```
.
├── app/                          # Main application (App Router)
│   ├── components/              # Shared or single-use components
│   │   └── auth-wizard/         # Example: directory for a complex component
│   ├── api/                     # API Route Handlers
│   │   └── users/[id]/posts/    # Example: nested API route
│   │       └── route.ts
│
├── tests/                       # All tests live here
│   ├── unit/                    # Unit tests (mirror `app` structure)
│   └── integration/             # Integration tests
│
├── types/                       # Shared TypeScript type definitions
└── ...
```

-   **Directories**: `lowercase-with-dashes` (e.g., `components/auth-wizard`).
-   **Components/Types/Interfaces**: `PascalCase`.
-   **Variables/Functions**: `camelCase`.
-   **Constants**: `UPPER_CASE`.
-   **Test Files**: Match implementation: `app/utils/foo.ts` → `tests/unit/test_foo.test.ts`.

## 5. Front-End & React Best Practices

-   **RSC First**: Favor React Server Components. Minimize `'use client'`, `useEffect`, and `useState`.
-   **Component Structure Order (MANDATORY)**:
    1.  `useState` declarations.
    2.  Computed values (`const isRunning = status === 'RUNNING'`).
    3.  Function definitions (`handle...`, `fetch...`).
    4.  `useEffect` hooks (Ensure all dependencies are declared *before* the `useEffect` call).
    5.  The JSX `return` statement.
-   **File Structure**: Inside a component file, the order should be: exported component, subcomponents, helpers, static content, and finally type definitions. Co-locate props interfaces with their components.
-   **Component Definition**: Use `function`, not `const`, for components.
-   **Performance**: Use `next/dynamic` for non-critical components and `next/image` for optimized images.
-   **Async**: Prefer async/await over raw Promises.

## 6. UI & Styling (Tailwind CSS + shadcn/ui)

-   **Component library**: This template uses **shadcn/ui** (new-york style).
    Reusable primitives live in `components/ui/` (Button, Card, Input, Label,
    Checkbox, Badge, Select, Chart). **Prefer composing these over hand-rolling
    custom components** — reach for a shadcn/ui component first, and only write
    bespoke markup when no primitive fits.
-   **Adding components**: `npx shadcn@latest add <name>` (e.g. `dialog`,
    `dropdown-menu`, `table`). If the CLI can't reach the registry, copy the
    source from https://ui.shadcn.com/docs/components into `components/ui/`.
-   **Design tokens**: Colors are CSS variables (HSL) defined in
    `app/globals.css` and mapped in `tailwind.config.js` (e.g. `bg-primary`,
    `text-muted-foreground`, `border-border`). Use the tokens, not hard-coded
    colors, so light/dark theming stays consistent.
-   **`cn()` helper**: Merge class names with `cn()` from `@/lib/utils`.
-   **Charts**: Use **Recharts** via the shadcn chart wrapper in
    `components/ui/chart.tsx` (`ChartContainer`, `ChartTooltip`,
    `ChartLegend`). See `app/charts/page.tsx` for a working example. Add more
    chart types from https://ui.shadcn.com/charts.
-   **Version**: Stay on Tailwind CSS v3.4.x for stability (`tailwindcss@^3.4.0`),
    with traditional PostCSS config (`postcss.config.js`) and `@tailwind`
    directives in `app/globals.css`.
-   **Best Practices**: Utility classes, responsive/mobile-first design, and
    accessible components (shadcn/ui is built on Radix primitives).

## 7. API Design & Backend

-   **Logic**: Use Node.js within Next.js Route Handlers for all backend logic.
-   **REST Principles**: Use consistent HTTP methods (`GET`, `POST`, `PUT`/`PATCH`, `DELETE`) and proper status codes (2xx, 4xx, 5xx).
-   **Standardized Responses**: Use a consistent response format (e.g., `{ data, metadata, error }`).
-   **Features**: Implement standardized pagination, filtering, and sorting via query parameters.
-   **Validation**: Implement input validation for all API endpoints using **Zod**.

## 8. TypeScript Best Practices

-   **Strict Mode**: Always use TypeScript in strict mode.
-   **Path Aliases**: Use `@/components/...` for clean, maintainable imports.
-   **Type Imports**: Use explicit `type` imports: `import type { MyType } from '@/types/index'`.
-   **Import Order**: Use consistent import ordering and structure, managed by the linter.
-   **Barrel Files**: Prefer explicit file paths (`../types/index`) over barrel file directories (`../types`) to improve tree-shaking.

## 9. Testing & Quality

-   **TDD is Law**: See Section 2.
-   **Performance**: Prefer running single tests for speed during development, and run the whole suite after completing medium-sized tasks.
-   **Unit Tests**: Focus on critical functionality. Mock dependencies until they are built. Test all data scenarios (valid, invalid, edge cases).
-   **Component Tests**: Use React Testing Library to test user interactions. Test component behavior with different props, states, loading, and error conditions.
-   **Integration Tests**: Test API endpoints for the full request/response cycle.
-   **Code Quality Tools**: Use ESLint and Prettier. Implement pre-commit hooks to run linting and basic tests.

## 10. Linting & Type-Checking

### TypeScript Type Checking
-   **Type Safety First**: All code must pass TypeScript type checking before deployment.
-   **Command**: Run `npm run type-check` to validate types without building.
-   **CI/CD Integration**: Type checking runs automatically during the build process (`npm run build`).
-   **Fix Approach**: Address type errors by adding proper type annotations, not by using `any` or `@ts-ignore` unless absolutely necessary.

### ESLint Configuration
-   **Version**: ESLint 9 with flat config format (`eslint.config.mjs`), required for Next.js 16.
-   **Plugins**: 
    -   `typescript-eslint` - TypeScript-specific linting rules
    -   `eslint-plugin-react` - React best practices
    -   `eslint-plugin-react-hooks` - React Hooks rules enforcement
-   **Command**: Run `npm run lint` to check code quality.
-   **Rules**:
    -   `@typescript-eslint/no-explicit-any`: warn - Discourage `any` usage
    -   `@typescript-eslint/no-unused-vars`: warn - Flag unused variables (ignores variables/args starting with `_`)
    -   `react/react-in-jsx-scope`: off - Not needed in Next.js
    -   `react-hooks/rules-of-hooks`: error - Enforce Hook rules
    -   `react-hooks/exhaustive-deps`: warn - Check Hook dependencies

### Combined Validation
-   **Command**: Run `npm run validate` to execute both type-check and lint together.
-   **When to Run**:
    -   Before committing code
    -   Before requesting code review
    -   Before deploying to production
    -   After major refactoring
-   **Goal**: Zero type errors in `app/` directory; minimize warnings.

### Ignored Files
The following are excluded from linting:
-   Build output: `.next/**`, `out/**`, `build/**`
-   Dependencies: `node_modules/**`
-   Tests: `tests/**` (have separate validation)
-   Config files: `*.config.js`, `*.config.mjs`, `*.config.ts`

### Type Definition Best Practices
-   **Supabase Types**: Use `Record<string, never>` for empty schema containers (Views, Functions, Enums, CompositeTypes).
-   **API Routes**: Always add explicit return type annotations (e.g., `Promise<NextResponse>`) to API handlers.
-   **Dynamic Routes**: In Next.js 16, params must be typed as `Promise<{ id: string }>` and awaited.

## 11. Database (Supabase)

-   **Interaction**: Use the Supabase SDK for all data fetching and querying.
    The client is created lazily in `lib/supabase.ts` (`supabase` proxy) so the
    app builds without credentials; the missing-env error surfaces on first use.
-   **Security**: Use Row Level Security (RLS) policies in Supabase for all data access control.
-   **Schema & migrations**: Prefer the **Supabase MCP server** so the agent can
    `apply_migration`, `list_tables`, and inspect advisors directly. Otherwise
    use the Supabase SQL Editor. Keep migrations under version control.
-   **Type Safety**: Use TypeScript for type safety when interacting with
    Supabase. Regenerate `types/supabase.ts` after schema changes (Supabase MCP
    `generate_typescript_types` or the Supabase CLI).

## 11a. Integration: n8n LLM Agent Streaming

This template is designed to call an **n8n** workflow over an HTTP webhook and
**stream an LLM agent's response back to the UI** token-by-token.

-   **Architecture**: Chat UI → Next.js Route Handler (`app/api/chat/route.ts`)
    → n8n Webhook (AI Agent node with streaming) → response streamed back
    through the route handler to the browser. **Always proxy through the route
    handler** — keep the n8n webhook URL/secret server-side (`N8N_WEBHOOK_URL`),
    never call n8n from the browser.
-   **Streaming transport**: Uses the **Web Streams API**, which is built into
    Next.js / Node 20+ and the browser — no polyfill required. The route handler
    forwards `response.body` (a `ReadableStream`); the client reads it.
-   **Recommended dependencies** (install when building this feature):
    -   `ai` + `@ai-sdk/react` — `useChat` / `useCompletion` React hooks plus
        streaming message state on the client and a standard stream protocol on
        the server. (If you want zero new runtime deps, you can stream natively
        with `fetch()` + `response.body.getReader()` + `TextDecoder`.)
    -   `zod` — validate the chat request body (this template's API-validation
        rule already assumes Zod; it is not yet installed).
    -   `react-markdown` + `remark-gfm` — render the streamed assistant markdown
        safely as React components (avoid `dangerouslySetInnerHTML`).
-   **n8n config**: Enable streaming on the AI Agent / "Respond to Webhook"
    node. Its chunk format isn't a fixed standard, so **normalize n8n's chunks
    into a plain text stream (or the AI SDK data-stream protocol) inside the
    route handler**. Use the AI SDK client with `streamProtocol: 'text'` if you
    forward raw token text.
-   **Env**: Add `N8N_WEBHOOK_URL` (and any auth header/secret) to `.env.local`
    and document them in `.env.example`.

## 12. Logging, Monitoring & Error Handling

-   **Global Logging**: Every function must have appropriate logging using **Winston**. Avoid `console.log`.
-   **Structured Logging**: Implement structured logs with consistent levels (error, warn, info, debug) and correlation IDs.
-   **Monitoring**: Implement health check endpoints (`/api/health`) for services.
-   **Error Handling**:
    -   Use Next.js `error.js` for boundaries and React Error Boundaries for granularity.
    -   Implement retry logic for network requests.
    -   Gracefully handle `loading.js`, error, and empty states in all UI components.
    -   Validate and sanitize all inputs at API boundaries.

## 13. Security Best Practices

-   **Authentication**: Implement proper authentication and authorization using Supabase. Validate JWTs and handle expiration.
-   **Data Access**: Adhere to the principle of least privilege via RLS policies.
-   **Input Sanitization**: Sanitize all user inputs to prevent XSS and injection attacks.
-   **API Security**: Configure CORS policies and implement rate limiting on API endpoints.
-   **Secrets**: Store all sensitive configuration in environment variables. **Never commit secrets to code.**

## 14. Your Response Constraints

-   **Communication Style**: Simple, everyday language.
-   **Code Modification**: Do not remove existing code, comments, or commented-out code unless necessary. Do not change formatting unless important for new functionality.

## 15. Maintenance Guidelines

Update this rules file when:
-   Adding new major dependencies or architectural patterns.
-   Modifying directory structure or environment variables.
-   Changing API response formats or testing patterns.