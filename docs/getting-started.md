# First-Time Setup (Bootstrapping)

> **AI agent — read this first.** This is a one-time onboarding script for a
> brand-new user (likely a first-time coder). Walk them through each step
> **interactively and conversationally** — do one step, confirm it worked, then
> move on. Don't dump all the commands at once. Track progress with the
> checklist at the end.
>
> **🧹 Self-cleanup (important):** Once every item in the Setup Checklist is
> checked off, you MUST:
>
> 1. Delete this file (`docs/getting-started.md`) and remove its link from
>    `CLAUDE.md`.
> 2. Rewrite the **Project Overview** in `CLAUDE.md` (and the structure, if it
>    changed) to describe the user's actual project instead of the starter template.
> 3. Commit the cleanup (e.g. "Complete project bootstrapping").
>
> A template that still contains setup scaffolding after setup is confusing.
> Leave the docs describing the _real_ project, not the bootstrap process.

Guide the user through these steps:

## 1. Install dependencies

- Run `npm install`.
- Confirm it finishes without errors.

## 2. Configure environment variables

- Copy `.env.example` to `.env.local` (`cp .env.example .env.local`).
- Explain that `.env.local` is **gitignored** and must never be committed —
  it holds secrets.
- They'll fill in the Supabase values in the next step. If you add the n8n
  integration later, its variables go here too.

## 3. Create / connect a Supabase project

- Ask whether they already have a Supabase project.
  - If not, walk them through creating a free one at https://supabase.com.
- Have them copy **Project URL** and **anon/public key** from
  _Project Settings → API_ into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
  and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SETUP.md` has the detailed, click-by-click walkthrough — point them
  there if they get stuck.

## 4. Create the database schema (user-scoped)

- The bundled **Tasks** example needs a `tasks` table with a `user_id` column +
  per-user RLS. The SQL lives in `SUPABASE_SETUP.md`.
- **Preferred path — Supabase MCP:** if the Supabase MCP server is connected,
  you (the agent) can create tables, run migrations (`apply_migration`), and
  inspect the schema directly — offer to do it for them. If it isn't connected,
  tell them how to add it (Supabase MCP: https://supabase.com/docs/guides/getting-started/mcp)
  so you can manage their database, or have them paste the SQL from
  `SUPABASE_SETUP.md` into the Supabase **SQL Editor**.
- After schema changes, regenerate `types/supabase.ts` (Supabase MCP
  `generate_typescript_types`). When the user designs their **own** features,
  design the schema together and apply it the same way.

## 5. Configure authentication

- The app is **login-controlled** (everything except `/login`, `/signup`,
  `/auth/*` requires a session). Walk the user through `SUPABASE_SETUP.md` →
  _Configure Authentication_:
  - Enable the **Email** provider; **disable "Confirm email"** for local dev.
  - (Optional) Enable **Google**/**GitHub** providers and add the redirect URLs
    (`http://localhost:3000/auth/callback`, `/auth/confirm`).

## 6. Verify everything works

- Run `npm run dev` and open http://localhost:3000 → you should be redirected
  to `/login`.
- Sign up at `/signup`, confirm the nav shows your email, and that `/tasks`
  create/toggle/delete works. Sign out and confirm you're sent back to `/login`.
- Run `npm test` — all tests should pass.

## 7. (Optional) Make it yours — the design system

- Your app's look (colors, typography, components) is documented in
  [`DESIGN.md`](../DESIGN.md). It mirrors the live theme in `app/globals.css` and
  shows which token maps to which CSS variable.
- To rebrand, edit the HSL variables in `app/globals.css` directly, then update the
  matching tokens in `DESIGN.md` and run `npm run design:lint` to validate.

## Setup Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` created with Supabase credentials
- [ ] Supabase project created & connected
- [ ] Database schema applied (`tasks` table with `user_id` + RLS, + any custom tables)
- [ ] Auth providers configured (Email; optionally Google/GitHub)
- [ ] App runs locally: signup → `/tasks` → sign out all work end-to-end
- [ ] `npm test` passes
- [ ] **Cleanup done:** this file removed & Project Overview rewritten for the real project
