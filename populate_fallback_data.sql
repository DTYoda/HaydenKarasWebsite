-- SQL script to populate database with fallback data
-- This ensures the site works immediately without showing static fallback data first
-- Run this script in your Supabase SQL editor to populate initial data

-- Insert home intro content if it doesn't exist
-- Note: Assumes 'key' column has a unique constraint
INSERT INTO page_content (key, page, section, content, type)
VALUES 
  ('home-intro-text', 'home', 'intro', 'Hi, my name is', 'text'),
  ('home-intro-name', 'home', 'intro', 'Hayden Karas', 'text'),
  ('home-intro-roles', 'home', 'intro', '["Coder", "Developer", "Mathematician"]', 'json'),
  ('home-intro-resume', 'home', 'intro', '/resume.pdf', 'text'),
  ('home-intro-linkedin', 'home', 'intro', 'https://www.linkedin.com/in/haydenkaras/', 'text'),
  ('home-intro-github', 'home', 'intro', 'https://github.com/DTYoda', 'text')
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  type = EXCLUDED.type;

-- Insert quick stats if they don't exist
-- Note: Adjust based on your table's unique constraints
-- If you have a unique constraint on (value, label), use: ON CONFLICT (value, label) DO NOTHING
-- Otherwise, check for existing records first or use a different approach
DO $$
BEGIN
  -- Only insert if the table is empty or doesn't have these stats
  IF NOT EXISTS (SELECT 1 FROM quick_stats WHERE value = '8+' AND label = 'Years') THEN
    INSERT INTO quick_stats (value, label, sublabel, "order")
    VALUES 
      ('8+', 'Years', 'Coding', 0),
      ('7+', 'Languages', 'Proficient', 1),
      ('20+', 'Projects', 'Completed', 2),
      ('Top 10', 'National', 'Competitions', 3);
  END IF;
END $$;

-- Note: Top skills are fetched from the skills table, so ensure skills are populated there
-- This is typically done through the admin interface, but you can add some default skills here if needed:
-- INSERT INTO skills (name, proficiency, category, "order")
-- VALUES 
--   ('JavaScript', 95, 'languages', 0),
--   ('C#', 95, 'languages', 1),
--   ('Unity', 95, 'frameworks', 2),
--   ('Git/GitHub', 95, 'tools', 3),
--   ('Python', 90, 'languages', 4),
--   ('React', 90, 'frameworks', 5),
--   ('REST APIs', 90, 'apis', 6),
--   ('Tailwind CSS', 92, 'frameworks', 7)
-- ON CONFLICT (name) DO NOTHING;

