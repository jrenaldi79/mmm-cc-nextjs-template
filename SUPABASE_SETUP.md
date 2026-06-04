# Supabase Database Example Setup

This template includes a working Supabase integration example showing how to build a full-stack application with database CRUD operations.

## 📋 What's Included

- **Database Client** (`lib/supabase.ts`) - Configured Supabase client
- **TypeScript Types** (`types/supabase.ts`) - Type-safe database schema definitions
- **API Routes** (`app/api/tasks/`) - RESTful endpoints for CRUD operations
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
-- Create the tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development/testing)
-- NOTE: In production, you should restrict this based on user authentication
CREATE POLICY "Allow all operations for development" ON tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO tasks (title, priority) VALUES
  ('Complete Next.js tutorial', 'high'),
  ('Learn TypeScript basics', 'medium'),
  ('Set up Supabase database', 'high'),
  ('Write unit tests', 'medium'),
  ('Deploy to production', 'low');
```

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

When deploying, add the same variables in your hosting provider's environment settings.

### 4. Test the Integration

1. Restart your Next.js development server
2. Navigate to [http://localhost:5000/tasks](http://localhost:5000/tasks)
3. You should see your sample tasks and be able to:
   - ✅ Create new tasks
   - ✅ Mark tasks as complete/incomplete
   - ✅ Delete tasks
   - ✅ See different priority levels

## 🔒 Security Best Practices

### Row Level Security (RLS)

The example includes a permissive RLS policy for development. **In production**, you should:

1. **Enable Authentication:**
   ```sql
   -- Remove the permissive policy
   DROP POLICY "Allow all operations for development" ON tasks;
   
   -- Add user-specific policies
   CREATE POLICY "Users can view their own tasks" ON tasks
     FOR SELECT
     USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can insert their own tasks" ON tasks
     FOR INSERT
     WITH CHECK (auth.uid() = user_id);
   
   CREATE POLICY "Users can update their own tasks" ON tasks
     FOR UPDATE
     USING (auth.uid() = user_id)
     WITH CHECK (auth.uid() = user_id);
   
   CREATE POLICY "Users can delete their own tasks" ON tasks
     FOR DELETE
     USING (auth.uid() = user_id);
   ```

2. **Add a user_id column:**
   ```sql
   ALTER TABLE tasks ADD COLUMN user_id UUID REFERENCES auth.users(id);
   ```

### Environment Variables

- Use your hosting provider's environment settings in production (not committed `.env` files)
- Never commit API keys to your repository
- Use `NEXT_PUBLIC_` prefix only for client-side variables
- Keep server-only secrets without the prefix

## 📚 Code Structure

```
.
├── lib/
│   └── supabase.ts              # Supabase client initialization
├── types/
│   └── supabase.ts              # Database type definitions
├── app/
│   ├── api/
│   │   └── tasks/
│   │       ├── route.ts         # GET /api/tasks, POST /api/tasks
│   │       └── [id]/
│   │           └── route.ts     # PATCH /api/tasks/:id, DELETE /api/tasks/:id
│   └── tasks/
│       └── page.tsx             # Tasks UI page
└── .env.example                 # Environment variable template
```

## 🧪 API Endpoints

### GET /api/tasks
Fetch all tasks, ordered by creation date (newest first)

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
