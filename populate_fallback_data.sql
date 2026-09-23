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

-- About page starting content
INSERT INTO page_content (key, page, section, content, type)
VALUES
  ('about-whoami-title', 'about', 'whoami', 'Who Am I?', 'text'),
  ('about-whoami-subtitle', 'about', 'whoami', 'Always Curious, Forever Learning', 'text'),
  ('about-whoami-paragraph1', 'about', 'whoami',
   'Hi, I''m <span class="text-orange-500 font-semibold">Hayden Karas</span>, a Computer Science major from Cranston, Rhode Island. I am currently a freshman at <span class="text-orange-500 font-semibold">Carnegie Mellon University''s</span> School of Computer Science. I''ve always loved learning, from physics to technology to engineering, and began coding in fifth grade. I value my relationships more than anything else in the world, and try to learn something new every single day.',
   'html'),
  ('about-whoami-paragraph2', 'about', 'whoami',
   'I am an excellent communicator, always ready to share my thoughts and ideas with others. I am also a great problem solver, always looking for the most simple and efficient solutions to problems. With this comes being a leader and listener, always ready to understand and respond to thoughts and ideas, as well as provide my own.',
   'html'),
  ('about-whoami-image', 'about', 'whoami', '/CrossArmImage.png', 'text'),
  ('about-background-title', 'about', 'background', 'My Journey', 'text'),
  ('about-background-subtitle', 'about', 'background', 'Pursuing Growth and Knowledge', 'text'),
  ('about-background-paragraph1', 'about', 'background',
   'My journey into the world of technology began with a fascination for how things work and a relentless curiosity to dig deeper. Starting with the idea of creating Minecraft mods in third grade, I started with game development with <span class="text-orange-500 font-semibold">Scratch</span> and then slowly learned new technologies, languages, and frameworks. Entering high school, I began entering technology classes and doing various projects. This resulted in entering the <span class="text-orange-500 font-semibold">SkillsUSA game development competition</span>, winning states two years in a row and placing top 10 nationally twice.',
   'html'),
  ('about-background-paragraph2', 'about', 'background',
   'Aside from Game Development, I also explored full-stack web development through college courses and online courses like <span class="text-orange-500 font-semibold">CS50x</span>. I presented one of my earliest web projects at the University of Rhode Island''s Computer Science Summit. I also was the captain of my school''s math team throughout high school, competing there as well, learning advanced math topics as well as leadership and teamwork skills.',
   'html'),
  ('about-background-image', 'about', 'background', '/SkillsUSAImage.jpeg', 'text')
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  type = EXCLUDED.type;

-- Contact page starting content
INSERT INTO page_content (key, page, section, content, type)
VALUES
  ('contact-content-availableFor', 'contact', 'content',
   '["Internships and full-time opportunities","Game development projects","Web development collaborations","Research opportunities","Open-source contributions"]',
   'json'),
  ('contact-content-links', 'contact', 'content',
   '[["https://www.linkedin.com/in/haydenkaras/","LinkedIn"],["https://github.com/DTYoda","GitHub"],["/resume.pdf","Resume"]]',
   'json'),
  ('contact-content-email', 'contact', 'content', 'hkaras1121@gmail.com', 'text')
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  type = EXCLUDED.type;

