-- Fix RLS Policies to Allow Writes
-- Run this in Supabase SQL Editor if you're getting permission errors

-- Drop existing write policies
DROP POLICY IF EXISTS "Authenticated write access" ON skills;
DROP POLICY IF EXISTS "Authenticated write access" ON education;
DROP POLICY IF EXISTS "Authenticated write access" ON projects;
DROP POLICY IF EXISTS "Authenticated write access" ON top_skills;
DROP POLICY IF EXISTS "Authenticated write access" ON quick_stats;
DROP POLICY IF EXISTS "Authenticated write access" ON static_content;
DROP POLICY IF EXISTS "Authenticated write access" ON page_content;

-- Create new policies that allow all writes (since we use cookie-based auth)
CREATE POLICY "Allow all writes" ON skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON education FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON top_skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON quick_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON static_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all writes" ON page_content FOR ALL USING (true) WITH CHECK (true);

