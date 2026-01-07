-- Seed Database with Default Data
-- Run this in Supabase SQL Editor after running the schema

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE skills, education, top_skills, quick_stats CASCADE;

-- Insert Skills
INSERT INTO skills (category, name, description, proficiency) VALUES
-- Languages
('languages', 'Python', 'Advanced Python with data structures, algorithms, and web development.', 90),
('languages', 'JavaScript', 'Expert-level for both frontend and backend development with modern frameworks.', 95),
('languages', 'Java', 'Strong object-oriented programming skills for application development.', 85),
('languages', 'C#', 'Extensive Unity game development experience, placed top 10 nationally in competitions.', 95),
('languages', 'C/C++', 'System-level programming and performance-critical applications.', 80),
('languages', 'TypeScript', 'Type-safe JavaScript for modern web applications.', 90),
('languages', 'SQL', 'Database design, query optimization, and management systems.', 85),
-- Frameworks
('frameworks', 'React', 'Building modern, responsive user interfaces with hooks and state management.', 90),
('frameworks', 'Next.js', 'Full-stack React framework for production applications with SSR.', 88),
('frameworks', 'Node.js', 'Backend development with Express.js, RESTful APIs, and authentication.', 85),
('frameworks', 'Unity', 'Game development engine, created multiple published games.', 95),
('frameworks', 'Tailwind CSS', 'Utility-first CSS framework for rapid responsive design.', 92),
-- APIs
('apis', 'REST APIs', 'Design and implementation of RESTful services with Express.js and FastAPI.', 90),
('apis', 'GraphQL', 'Query language for APIs with Apollo Client and schema design.', 85),
('apis', 'WebSockets', 'Real-time communication for live updates and interactive features.', 80),
-- Tools
('tools', 'Git/GitHub', 'Version control, branching strategies, and collaborative development.', 95),
('tools', 'Docker', 'Containerization for application deployment and orchestration.', 80),
('tools', 'AWS', 'Cloud services including EC2, S3, Lambda for scalable applications.', 75),
('tools', 'CI/CD', 'Continuous integration and deployment pipelines with automated testing.', 80);

-- Insert Education
INSERT INTO education (category, name, description, link, link_text) VALUES
-- Coursework
('coursework', 'Data Structures & Algorithms', 'Advanced study of trees, graphs, hash tables, and algorithm optimization techniques.', '', ''),
('coursework', 'Computer Systems', 'Low-level system programming, memory management, and computer architecture.', '', ''),
('coursework', 'Database Systems', 'Relational database design, SQL optimization, and database administration.', '', ''),
-- Certifications
('certifications', 'CS50x - Harvard University', 'Introduction to Computer Science covering algorithms, data structures, and multiple languages.', '#', 'View Certificate'),
('certifications', 'Computer Science Principles', 'Comprehensive certification covering fundamental computer science concepts.', '#', 'View Certificate'),
-- Courses
('courses', 'The Complete Web Development Bootcamp', 'Full-stack web development: HTML, CSS, JavaScript, React, Node.js, and databases.', '#', 'View Course'),
-- Awards
('awards', 'SkillsUSA - National Top 10', 'Placed top 10 nationally in game development competition two consecutive years.', '#', 'Learn More'),
('awards', 'State Champion - Game Development', 'Won state championship in SkillsUSA game development competition.', '#', 'Learn More');

-- Insert Top Skills
INSERT INTO top_skills (name, proficiency, category, "order") VALUES
('JavaScript', 95, 'languages', 1),
('C#', 95, 'languages', 2),
('Unity', 95, 'frameworks', 3),
('Git/GitHub', 95, 'tools', 4),
('Python', 90, 'languages', 5),
('React', 90, 'frameworks', 6),
('REST APIs', 90, 'apis', 7),
('Tailwind CSS', 92, 'frameworks', 8);

-- Insert Quick Stats
INSERT INTO quick_stats (value, label, sublabel, "order") VALUES
('8+', 'Years', 'Coding', 1),
('7+', 'Languages', 'Proficient', 2),
('20+', 'Projects', 'Completed', 3),
('Top 10', 'National', 'Competitions', 4);

