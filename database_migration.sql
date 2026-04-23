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

