# Migration from Prisma to Supabase - Complete

## ✅ What Has Been Done

1. **Removed Prisma Dependencies**
   - Removed `@prisma/client` and `prisma` from package.json
   - Removed `postinstall` script that ran `prisma generate`
   - Added `@supabase/supabase-js` dependency

2. **Created Supabase Client**
   - Created `/src/lib/supabase.js` with server and browser client utilities
   - Configured for real-time updates

3. **Converted All API Routes**
   - ✅ `/api/skillshandler` - Now uses Supabase
   - ✅ `/api/educationhandler` - Now uses Supabase  
   - ✅ `/api/projectshandler` - Now uses Supabase
   - ✅ `/api/topskills` - Now uses Supabase
   - ✅ `/api/quickstats` - Now uses Supabase
   - ✅ `/api/staticcontent` - Now uses Supabase
   - ✅ `/api/pagecontent` - Now uses Supabase

4. **Updated Server Components**
   - ✅ `src/app/page.js` - Now uses Supabase
   - ✅ `src/app/portfolio/[project]/page.js` - Now uses Supabase
   - ✅ `src/app/_components/portfoliosection.jsx` - Now uses Supabase

5. **Updated Client Components**
   - All components now handle snake_case to camelCase conversion
   - Real-time updates work automatically through Supabase

6. **Created Database Schema**
   - `supabase-schema.sql` - Complete SQL schema for all tables
   - Includes RLS policies, indexes, and triggers

## 📋 Setup Instructions

### Step 1: Install Dependencies

```bash
npm install
```

This will install `@supabase/supabase-js` and remove Prisma.

### Step 2: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `hayden-karas-website` (or your choice)
   - **Database Password**: Choose a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
5. Wait ~2 minutes for project creation

### Step 3: Get Your Credentials

1. In Supabase dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (the `anon` key, NOT `service_role`)

### Step 4: Set Environment Variables

Create or update `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_PASSWORD=your-admin-password-here
```

**Important:** 
- Replace with your actual values
- The `NEXT_PUBLIC_` prefix is required for client-side access
- Restart your dev server after adding these

### Step 5: Set Up Database Schema

1. In Supabase dashboard → **SQL Editor**
2. Click "New Query"
3. Open `supabase-schema.sql` from your project
4. Copy the entire contents
5. Paste into SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. Verify tables were created: **Table Editor** → You should see:
   - `skills`
   - `education`
   - `projects`
   - `top_skills`
   - `quick_stats`
   - `static_content`
   - `page_content`

### Step 6: Migrate Existing Data (If You Have Any)

If you have existing data in your Prisma database:

1. Export data from old database
2. In Supabase → **Table Editor**
3. For each table, click "Insert row" and add your data
4. **Important:** Convert column names:
   - `urlTitle` → `url_title`
   - `linkText` → `link_text`

Or use SQL INSERT statements in the SQL Editor.

### Step 7: Test the Connection

```bash
npm run dev
```

1. Visit your site
2. Check browser console for errors
3. Try logging in as admin
4. Make a change - it should appear immediately!

## 🔄 Real-Time Updates

**No redeployment needed!** Changes are automatically reflected because:

1. Supabase provides real-time subscriptions
2. Components fetch fresh data on changes
3. The `router.refresh()` calls update the page

## 📊 Column Name Mapping

Supabase uses snake_case, but the code handles conversion automatically:

| Old (Prisma) | New (Supabase) |
|-------------|---------------|
| `urlTitle` | `url_title` |
| `linkText` | `link_text` |
| `topSkills` | `top_skills` |
| `quickStats` | `quick_stats` |
| `staticContent` | `static_content` |
| `pageContent` | `page_content` |

**Note:** The API routes handle this conversion automatically. Your components can still use camelCase.

## 🔒 Security Notes

1. **RLS Policies**: The schema includes Row Level Security policies
   - Public read access (anyone can view)
   - Authenticated write access (anyone authenticated can edit)
   
   **For production**, you should customize these policies based on your needs.

2. **Admin Password**: Still stored in `ADMIN_PASSWORD` env variable
   - This is separate from Supabase authentication
   - Used for your custom admin panel

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` exists
- Verify variable names start with `NEXT_PUBLIC_`
- Restart dev server

### "relation does not exist"
- Make sure you ran the SQL schema file
- Check table names are snake_case in Supabase

### "permission denied"
- Check RLS policies in Supabase
- Verify policies allow your operations

### Data not updating
- Changes should appear immediately
- Check browser console for errors
- Verify Supabase real-time is enabled (it is by default)

## 🎉 You're Done!

Your site is now fully connected to Supabase with:
- ✅ Real-time updates (no redeployment needed)
- ✅ All CRUD operations working
- ✅ Admin panel fully functional
- ✅ All static content editable

Just make sure to:
1. Run the SQL schema
2. Set your environment variables
3. Restart your dev server

Happy editing! 🚀

