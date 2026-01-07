# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - Name: `hayden-karas-website` (or your preferred name)
   - Database Password: Choose a strong password (save this!)
   - Region: Choose the closest region to you
5. Wait for the project to be created (takes ~2 minutes)

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (the `anon` key, not the `service_role` key)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root (if it doesn't exist) and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
ADMIN_PASSWORD=your_admin_password_here
```

**Important:** 
- Replace `your_project_url_here` with your Project URL
- Replace `your_anon_key_here` with your anon/public key
- Replace `your_admin_password_here` with your desired admin password

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" to execute the SQL
5. Verify the tables were created by going to **Table Editor**

## 5. Migrate Existing Data (Optional)

If you have existing data in your Prisma database, you'll need to migrate it:

1. Export your data from the old database
2. Import it into Supabase using the Table Editor or SQL INSERT statements
3. Make sure to convert column names from camelCase to snake_case:
   - `urlTitle` → `url_title`
   - `linkText` → `link_text`

## 6. Install Dependencies

Run:
```bash
npm install
```

This will install `@supabase/supabase-js` and remove Prisma dependencies.

## 7. Update Row Level Security (RLS) Policies (Optional)

The default setup allows public read access and authenticated write access. For better security:

1. Go to **Authentication** → **Policies** in Supabase
2. Review and customize the RLS policies based on your needs
3. You can restrict write access to specific users or roles

## 8. Enable Real-time (Already Configured)

Real-time subscriptions are already set up in the code. Changes will automatically appear without redeployment.

## 9. Test the Connection

1. Start your development server: `npm run dev`
2. Visit your site and check the browser console for any errors
3. Try logging in as admin and making a change
4. The change should appear immediately without refreshing

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists and has the correct variables
- Restart your dev server after adding environment variables
- Check that variable names start with `NEXT_PUBLIC_` for client-side access

### "relation does not exist"
- Make sure you ran the SQL schema file in Supabase
- Check that table names match (they should be snake_case)

### "permission denied"
- Check your RLS policies in Supabase
- Make sure the policies allow the operations you're trying to perform

### Data not updating in real-time
- Check that you're logged in (real-time works better with authentication)
- Verify your Supabase project has real-time enabled (it's enabled by default)
- Check browser console for WebSocket connection errors

## Column Name Mapping

Supabase uses snake_case, but the API routes handle conversion automatically:

| Prisma (camelCase) | Supabase (snake_case) |
|-------------------|----------------------|
| `urlTitle` | `url_title` |
| `linkText` | `link_text` |
| `topSkills` | `top_skills` |
| `quickStats` | `quick_stats` |
| `staticContent` | `static_content` |
| `pageContent` | `page_content` |

The conversion is handled automatically in the API routes and components.

