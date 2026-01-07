-- Complete RLS Policy Fix
-- Run this in Supabase SQL Editor to fix all policies

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Public read access" ON skills;
DROP POLICY IF EXISTS "Public read access" ON education;
DROP POLICY IF EXISTS "Public read access" ON projects;
DROP POLICY IF EXISTS "Public read access" ON top_skills;
DROP POLICY IF EXISTS "Public read access" ON quick_stats;
DROP POLICY IF EXISTS "Public read access" ON static_content;
DROP POLICY IF EXISTS "Public read access" ON page_content;

DROP POLICY IF EXISTS "Authenticated write access" ON skills;
DROP POLICY IF EXISTS "Authenticated write access" ON education;
DROP POLICY IF EXISTS "Authenticated write access" ON projects;
DROP POLICY IF EXISTS "Authenticated write access" ON top_skills;
DROP POLICY IF EXISTS "Authenticated write access" ON quick_stats;
DROP POLICY IF EXISTS "Authenticated write access" ON static_content;
DROP POLICY IF EXISTS "Authenticated write access" ON page_content;

DROP POLICY IF EXISTS "Allow all writes" ON skills;
DROP POLICY IF EXISTS "Allow all writes" ON education;
DROP POLICY IF EXISTS "Allow all writes" ON projects;
DROP POLICY IF EXISTS "Allow all writes" ON top_skills;
DROP POLICY IF EXISTS "Allow all writes" ON quick_stats;
DROP POLICY IF EXISTS "Allow all writes" ON static_content;
DROP POLICY IF EXISTS "Allow all writes" ON page_content;

-- Recreate read policies (public access)
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON top_skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON quick_stats FOR SELECT USING (true);
CREATE POLICY "Public read access" ON static_content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON page_content FOR SELECT USING (true);

-- Create write policies (allow all writes - since we use cookie-based auth)
CREATE POLICY "Allow all writes" ON skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON education FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON top_skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON quick_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON static_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON page_content FOR ALL USING (true) WITH CHECK (true);

