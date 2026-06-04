# Supabase Setup (Database + Authentication)

This template includes a working Supabase integration showing how to build a
**login-controlled** full-stack app: cookie-based auth (email/password + OAuth),
protected routes, and per-user database CRUD operations.

## 📋 What's Included

- **Auth clients** (`lib/supabase/{client,server,middleware}.ts`) - Cookie-aware
  Supabase clients for the browser, the server, and the auth middleware (`@supabase/ssr`)
- **Route protection** (`middleware.ts`) - Redirects unauthenticated users to `/login`
- **Auth pages & routes** (`app/login`, `app/signup`, `app/auth/*`) - Email/password +
  Google/GitHub sign-in, sign-out, and OAuth/email callbacks
- **TypeScript Types** (`types/supabase.ts`) - Type-safe database schema definitions
- **API Routes** (`app/api/tasks/`) - RESTful, per-user CRUD endpoints (require auth)
- **UI Page** (`app/tasks/page.tsx`) - Interactive task management interface

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the database to be provisioned (~2 minutes)

### 2. Create the Tasks Table

In your Supabase project dashboard:

1. Click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Paste the following SQL:

```sql
-- Create the tasks table, scoped to the signed-in user.
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Per-user policies: each user can only see and modify their own tasks.
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);
```

> No seed rows are inserted here: tasks belong to a user, so `auth.uid()` must
> be set (which only happens when a signed-in user inserts via the app). Sign in
> and create tasks from the `/tasks` page instead.
>
> **Tip:** If your Supabase project is connected via the **Supabase MCP**, ask
> Claude to apply this with `apply_migration` (named e.g. `create_tasks_table`)
> so it's tracked in your migration history.

4. Click **Run** to execute the query

### 3. Configure Environment Variables

1. In your Supabase project dashboard, click on **Settings** (gear icon)
2. Click **API** in the left sidebar
3. Copy your **Project URL** and **anon/public key**

#### Using a .env.local File

1. Create a `.env.local` file in the project root (you can copy `.env.example`)
2. Add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ IMPORTANT:** Never commit the `.env.local` file to Git! It's already in `.gitignore`.

When deploying, add the same variables in your hosting provider's environment
settings, plus `NEXT_PUBLIC_SITE_URL` (your production URL) so OAuth and email
links redirect correctly.

### 4. Configure Authentication

The whole app is login-controlled: visiting any page while signed out redirects
to `/login`. Set up the sign-in methods in your Supabase dashboard.

**Email / password**

1. Go to **Authentication → Providers → Email** and make sure it's enabled.
2. For local development, **turn OFF "Confirm email"** so new signups work
   immediately. (Leave it on in production — `/auth/confirm` handles the
   confirmation link.)

**Google / GitHub OAuth**

1. Go to **Authentication → Providers** and enable **Google** and/or **GitHub**.
2. Create an OAuth app with each provider and paste the **Client ID** and
   **Client Secret** into Supabase.
3. Go to **Authentication → URL Configuration** and add these **Redirect URLs**:
   - `http://localhost:5000/auth/callback`
   - `http://localhost:5000/auth/confirm`
   - your production equivalents (e.g. `https://your-app.com/auth/callback`)

> Don't want OAuth yet? Email/password works on its own — the Google/GitHub
> buttons simply won't function until their providers are enabled.

### 5. Test the Integration

1. Restart your Next.js development server.
2. Navigate to [http://localhost:5000](http://localhost:5000) — you'll be
   redirected to `/login`.
3. Go to `/signup`, create an account, and you'll land on the home page with
   your email shown in the nav.
4. Visit [http://localhost:5000/tasks](http://localhost:5000/tasks) and:
   - ✅ Create new tasks
   - ✅ Mark tasks as complete/incomplete
   - ✅ Delete tasks
   - ✅ See different priority levels
5. Click **Sign Out** — you're returned to `/login` and protected pages are
   no longer accessible.

## 🔒 Security Best Practices

### Row Level Security (RLS)

This template ships **per-user RLS** out of the box (see the table SQL above):
each policy checks `auth.uid() = user_id`, so users can only read and modify
their own rows. Because the API routes use the cookie-aware server client
(`lib/supabase/server.ts`), the signed-in user is passed to the database and
these policies are enforced automatically — even though the app only ever uses
the public anon key. This is the correct, safe pattern: never ship a permissive
`USING (true)` policy to production.

### Environment Variables

- Use your hosting provider's environment settings in production (not committed `.env` files)
- Never commit API keys to your repository
- Use `NEXT_PUBLIC_` prefix only for client-side variables
- Keep server-only secrets without the prefix

## 📚 Code Structure

```
.
├── middleware.ts                # Refreshes the session & protects routes
├── lib/
│   └── supabase/
│       ├── client.ts            # Browser client (Client Components)
│       ├── server.ts            # Server client (Server Components/Actions/Routes)
│       └── middleware.ts        # updateSession() used by middleware.ts
├── types/
│   └── supabase.ts              # Database type definitions (incl. user_id)
├── app/
│   ├── login/                   # Login page + email/password server actions
│   ├── signup/                  # Signup page
│   ├── auth/
│   │   ├── callback/route.ts    # OAuth/PKCE code exchange
│   │   ├── confirm/route.ts     # Email-confirmation / magic link
│   │   └── signout/route.ts     # POST sign-out
│   ├── components/
│   │   └── OAuthButtons.tsx     # Google/GitHub buttons
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts         # GET /api/tasks, POST /api/tasks (per-user)
│   │       └── [id]/
│   │           └── route.ts     # PATCH/DELETE /api/tasks/:id (per-user)
│   └── tasks/
│       └── page.tsx             # Tasks UI page
└── .env.example                 # Environment variable template
```

## 🧪 API Endpoints

All task endpoints require an authenticated session and return `401 Unauthorized`
when signed out. Each operation is automatically scoped to the current user.

### GET /api/tasks

Fetch the current user's tasks, ordered by creation date (newest first)

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Task title",
      "completed": false,
      "priority": "high",
      "created_at": "2024-11-08T12:00:00Z",
      "updated_at": "2024-11-08T12:00:00Z"
    }
  ],
  "metadata": {
    "count": 5
  }
}
```

### POST /api/tasks

Create a new task

**Request:**

```json
{
  "title": "New task",
  "priority": "medium"
}
```

**Response:** `201 Created` with task data

### PATCH /api/tasks/:id

Update an existing task

**Request:**

```json
{
  "completed": true
}
```

**Response:** `200 OK` with updated task data

### DELETE /api/tasks/:id

Delete a task

**Response:** `200 OK` with success message

## 🎓 Learning Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TypeScript with Supabase](https://supabase.com/docs/guides/api/generating-types)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🐛 Troubleshooting

### "Missing Supabase environment variables" Error

**Problem:** The app can't find your Supabase credentials.

**Solution:**

1. Check that you've added the environment variables (in `.env.local` or your host's environment settings)
2. Restart your development server after adding the variables
3. Verify the variable names match exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### API Returns 500 Error

**Problem:** Supabase query is failing.

**Solution:**

1. Check that the `tasks` table exists in your Supabase project
2. Verify RLS policies are set up correctly
3. Check the browser console for detailed error messages
4. Verify your Supabase credentials are correct

### Tasks Don't Appear After Creating

**Problem:** New tasks aren't showing in the list.

**Solution:**

1. Check browser console for errors
2. Verify RLS policies allow INSERT operations
3. Check Network tab to see if the POST request succeeded
4. Try refreshing the page manually

## 🚀 Next Steps

Now that you have a working database integration:

1. **Modify the Schema:** Add new columns to the tasks table
2. **Add Filtering:** Implement filter by priority or completion status
3. **Add Sorting:** Let users sort tasks by different fields
4. **Add Pagination:** Implement pagination for large task lists
5. **Add Search:** Implement full-text search on task titles
6. **Replace with Your Data:** Create your own tables and integrate them into your app

This example is yours to customize and expand upon as you build your unique application!
