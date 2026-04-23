-- Migration SQL for Enhanced Project Page
-- This migration documents the extended JSON structure for technologies and highlights

-- IMPORTANT: Run this SQL in your Supabase SQL editor to add the highlights column:
ALTER TABLE projects ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;

-- The technologies column in the projects table now supports extended JSON structure:
-- Each technology object can include:
-- {
--   "title": "Technology Name",      -- Required
--   "link": "https://...",          -- Optional
--   "category": "frontend|backend|game-dev|tools|other",  -- Optional (auto-detected if not provided)
--   "proficiency": 0-100,           -- Optional (defaults based on technology if not provided)
--   "color": "from-blue-500 to-cyan-500",  -- Optional (auto-assigned if not provided)
--   "icon": "⚛️"                    -- Optional (auto-assigned if not provided)
-- }

-- Example of a technology with all fields:
-- {
--   "title": "React",
--   "link": "https://react.dev",
--   "category": "frontend",
--   "proficiency": 90,
--   "color": "from-blue-500 to-cyan-500",
--   "icon": "⚛️"
-- }

-- Example of a minimal technology (backward compatible):
-- {
--   "title": "React",
--   "link": "https://react.dev"
-- }

-- Note: The new project page component automatically:
-- 1. Categorizes technologies if category is not provided
-- 2. Assigns default proficiency based on technology name if not provided
-- 3. Assigns color scheme based on technology name if not provided
-- 4. Assigns icon emoji based on technology name if not provided

-- To update existing technologies, you can run:
-- UPDATE projects 
-- SET technologies = jsonb_set(
--   technologies,
--   '{0,category}',
--   '"frontend"'
-- )
-- WHERE id = <project_id>;

-- Or update the entire technologies array:
-- UPDATE projects
-- SET technologies = '[
--   {
--     "title": "React",
--     "link": "https://react.dev",
--     "category": "frontend",
--     "proficiency": 90,
--     "color": "from-blue-500 to-cyan-500",
--     "icon": "⚛️"
--   }
-- ]'::jsonb
-- WHERE id = <project_id>;

-- The highlights column in the projects table supports JSON array structure:
-- Each highlight object can include:
-- {
--   "icon": "🚀",              -- Optional (emoji)
--   "title": "Full-Stack",      -- Required
--   "description": "Complete Application"  -- Optional
-- }

-- Example of highlights array:
-- [
--   {
--     "icon": "🚀",
--     "title": "Full-Stack",
--     "description": "Complete Application"
--   },
--   {
--     "icon": "⚡",
--     "title": "Modern Stack",
--     "description": "Latest Technologies"
--   },
--   {
--     "icon": "🎯",
--     "title": "Production Ready",
--     "description": "Deployed & Live"
--   },
--   {
--     "icon": "💡",
--     "title": "Innovative",
--     "description": "Unique Solutions"
--   }
-- ]

-- To add highlights to a project:
-- UPDATE projects
-- SET highlights = '[
--   {"icon": "🚀", "title": "Full-Stack", "description": "Complete Application"},
--   {"icon": "⚡", "title": "Modern Stack", "description": "Latest Technologies"}
-- ]'::jsonb
-- WHERE id = <project_id>;

-- Blog posts table for rich text blog authoring
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_html TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);

-- Blog engagement counters
ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS views_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS likes_count INTEGER NOT NULL DEFAULT 0;

-- Per-user (anonymous fingerprinted) engagement events for dedupe
CREATE TABLE IF NOT EXISTS blog_post_engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'like')),
  fingerprint TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, event_type, fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_blog_engagement_post_id ON blog_post_engagement_events(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_engagement_event_type ON blog_post_engagement_events(event_type);

-- =========================
-- Security hardening (RLS)
-- =========================
-- Run this section after your tables are created.
--
-- This project uses a custom admin session (server cookie), not Supabase Auth
-- users. So the secure model is:
-- 1) Public read only for content that must render on the website
-- 2) No direct client writes to DB tables
-- 3) Sensitive tables have no public read policy
-- 4) Admin writes happen only through server API routes using service role key

-- Enable RLS on every public table.
DO $$
DECLARE
  t RECORD;
BEGIN
  FOR t IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
  END LOOP;
END
$$;

-- Cleanup old auth-user based hardening if it exists.
-- Drop policies that depend on is_site_admin() first.
DO $$
DECLARE
  table_name TEXT;
BEGIN
  IF to_regclass('public.site_admins') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "site_admins_self_read" ON public.site_admins';
    EXECUTE 'DROP POLICY IF EXISTS "site_admins_admin_manage" ON public.site_admins';
  END IF;

  IF to_regclass('public.blog_posts') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "public_read_published_blog_posts" ON public.blog_posts';
    EXECUTE 'DROP POLICY IF EXISTS "admin_write_blog_posts" ON public.blog_posts';
  END IF;

  FOREACH table_name IN ARRAY ARRAY[
    'projects',
    'quick_stats',
    'skills',
    'education',
    'page_content',
    'static_content',
    'top_skills'
  ]
  LOOP
    IF to_regclass('public.' || table_name) IS NOT NULL THEN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'admin_write_' || table_name, table_name);
    END IF;
  END LOOP;

  IF to_regclass('public.blog_post_engagement_events') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "admin_read_engagement_events" ON public.blog_post_engagement_events';
    EXECUTE 'DROP POLICY IF EXISTS "admin_modify_engagement_events" ON public.blog_post_engagement_events';
    EXECUTE 'DROP POLICY IF EXISTS "admin_delete_engagement_events" ON public.blog_post_engagement_events';
  END IF;
END
$$;

DROP FUNCTION IF EXISTS public.is_site_admin();
DROP TABLE IF EXISTS public.site_admins;

-- ---------------------------
-- Public readable content
-- ---------------------------
DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'projects',
    'quick_stats',
    'skills',
    'education',
    'page_content',
    'static_content',
    'top_skills'
  ]
  LOOP
    IF to_regclass('public.' || table_name) IS NOT NULL THEN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'public_read_' || table_name, table_name);
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true)',
        'public_read_' || table_name,
        table_name
      );
    END IF;
  END LOOP;

  IF to_regclass('public.blog_posts') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "public_read_published_blog_posts" ON public.blog_posts';
    EXECUTE '
      CREATE POLICY "public_read_published_blog_posts"
      ON public.blog_posts
      FOR SELECT
      TO anon, authenticated
      USING (status = ''published'')
    ';
  END IF;
END
$$;

-- IMPORTANT: We intentionally do NOT create write policies for public tables.
-- With RLS enabled and no INSERT/UPDATE/DELETE policies, anon/authenticated
-- clients cannot write directly. Only server routes using service role can.

-- Cleanup old write policies if they exist.
DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'projects',
    'quick_stats',
    'skills',
    'education',
    'page_content',
    'static_content',
    'top_skills',
    'blog_posts'
  ]
  LOOP
    IF to_regclass('public.' || table_name) IS NOT NULL THEN
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'admin_write_' || table_name, table_name);
    END IF;
  END LOOP;
END
$$;

-- -------------------------------------
-- Sensitive table: no public read/write
-- -------------------------------------
-- blog_post_engagement_events contains fingerprints/IP/user-agent and should
-- never be readable or writable from anon/authenticated clients directly.
-- Writes for engagement tracking are handled only by server API + service role.
DO $$
BEGIN
  IF to_regclass('public.blog_post_engagement_events') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "public_insert_engagement_events" ON public.blog_post_engagement_events';
    EXECUTE 'DROP POLICY IF EXISTS "admin_read_engagement_events" ON public.blog_post_engagement_events';
    EXECUTE 'DROP POLICY IF EXISTS "admin_modify_engagement_events" ON public.blog_post_engagement_events';
    EXECUTE 'DROP POLICY IF EXISTS "admin_delete_engagement_events" ON public.blog_post_engagement_events';
  END IF;
END
$$;

