-- Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  proficiency INTEGER DEFAULT 80,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT DEFAULT '',
  link_text TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url_title TEXT NOT NULL,
  title TEXT NOT NULL,
  descriptions TEXT NOT NULL,
  images TEXT DEFAULT '[]',
  links TEXT DEFAULT '[]',
  technologies TEXT DEFAULT '[]',
  type TEXT DEFAULT 'website',
  date TEXT DEFAULT 'undefined',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Top Skills table
CREATE TABLE IF NOT EXISTS top_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  proficiency INTEGER NOT NULL,
  category TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quick Stats table
CREATE TABLE IF NOT EXISTS quick_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sublabel TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Static Content table
CREATE TABLE IF NOT EXISTS static_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  section TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page Content table
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - Allow public read, authenticated write
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE top_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON top_skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON quick_stats FOR SELECT USING (true);
CREATE POLICY "Public read access" ON static_content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON page_content FOR SELECT USING (true);

-- Policies for write access (allowing all writes for now - you can restrict this later)
-- Since we're using custom cookie-based auth, we allow all writes
-- For production, you should add proper authentication checks
CREATE POLICY "Allow all writes" ON skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON education FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON top_skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON quick_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON static_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON page_content FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_education_category ON education(category);
CREATE INDEX IF NOT EXISTS idx_projects_url_title ON projects(url_title);
CREATE INDEX IF NOT EXISTS idx_page_content_key ON page_content(key);
CREATE INDEX IF NOT EXISTS idx_page_content_page_section ON page_content(page, section);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_top_skills_updated_at BEFORE UPDATE ON top_skills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quick_stats_updated_at BEFORE UPDATE ON quick_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_static_content_updated_at BEFORE UPDATE ON static_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON page_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

