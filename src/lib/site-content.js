import { createServerClient } from "@/lib/supabase";
import { getTagMeta } from "@/lib/tags";
import {
  getLatestProjects,
  mapProject,
  parseJsonField,
} from "@/lib/projects";

export async function getPageContentRows(page, section) {
  const supabase = createServerClient();
  let query = supabase.from("page_content").select("*");
  if (page) query = query.eq("page", page);
  if (section) query = query.eq("section", section);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching page content:", error);
    return [];
  }
  return data || [];
}

export function contentMapFromRows(rows) {
  return (rows || []).reduce((map, item) => {
    map[item.key] = item.content;
    return map;
  }, {});
}

export function pickContent(map, key, fallback = "") {
  const value = map?.[key];
  if (value === undefined || value === null || value === "") return fallback;
  return value;
}

export function mapHomeIntro(map) {
  return {
    introText: pickContent(map, "home-intro-text"),
    name: pickContent(map, "home-intro-name"),
    roles: parseJsonField(pickContent(map, "home-intro-roles", "[]"), []),
    resumeLink: pickContent(map, "home-intro-resume"),
    linkedinLink: pickContent(map, "home-intro-linkedin"),
    githubLink: pickContent(map, "home-intro-github"),
  };
}

export function mapQuote(map, page, section, fallback = {}) {
  const prefix = `${page}-${section}`;
  return {
    quote: pickContent(map, `${prefix}-quote`, fallback.quote || ""),
    author: pickContent(map, `${prefix}-author`, fallback.author || ""),
    links: parseJsonField(
      pickContent(map, `${prefix}-links`, JSON.stringify(fallback.links || [])),
      fallback.links || []
    ),
  };
}

const DEFAULT_WHOAMI = {
  title: "Who Am I?",
  subtitle: "Always Curious, Forever Learning",
  paragraph1:
    'Hi, I\'m <span class="text-orange-500 font-semibold">Hayden Karas</span>, a Computer Science major from Cranston, Rhode Island. I am currently a freshman at <span class="text-orange-500 font-semibold">Carnegie Mellon University\'s</span> School of Computer Science. I\'ve always loved learning, from physics to technology to engineering, and began coding in fifth grade. I value my relationships more than anything else in the world, and try to learn something new every single day.',
  paragraph2:
    "I am an excellent communicator, always ready to share my thoughts and ideas with others. I am also a great problem solver, always looking for the most simple and efficient solutions to problems. With this comes being a leader and listener, always ready to understand and respond to thoughts and ideas, as well as provide my own.",
  imageUrl: "/CrossArmImage.png",
};

const DEFAULT_BACKGROUND = {
  title: "My Journey",
  subtitle: "Pursuing Growth and Knowledge",
  paragraph1:
    'My journey into the world of technology began with a fascination for how things work and a relentless curiosity to dig deeper. Starting with the idea of creating Minecraft mods in third grade, I started with game development with <span class="text-orange-500 font-semibold">Scratch</span> and then slowly learned new technologies, languages, and frameworks. Entering high school, I began entering technology classes and doing various projects. This resulted in entering the <span class="text-orange-500 font-semibold">SkillsUSA game development competition</span>, winning states two years in a row and placing top 10 nationally twice.',
  paragraph2:
    'Aside from Game Development, I also explored full-stack web development through college courses and online courses like <span class="text-orange-500 font-semibold">CS50x</span>. I presented one of my earliest web projects at the University of Rhode Island\'s Computer Science Summit. I also was the captain of my school\'s math team throughout high school, competing there as well, learning advanced math topics as well as leadership and teamwork skills.',
  imageUrl: "/SkillsUSAImage.jpeg",
};

const DEFAULT_CONTACT_CONTENT = {
  availableFor: [
    "Internships and full-time opportunities",
    "Game development projects",
    "Web development collaborations",
    "Research opportunities",
    "Open-source contributions",
  ],
  links: [
    ["https://www.linkedin.com/in/haydenkaras/", "LinkedIn"],
    ["https://github.com/DTYoda", "GitHub"],
    ["/resume.pdf", "Resume"],
  ],
  email: "hkaras1121@gmail.com",
};

export function mapWhoAmI(map) {
  return {
    title: pickContent(map, "about-whoami-title", DEFAULT_WHOAMI.title),
    subtitle: pickContent(map, "about-whoami-subtitle", DEFAULT_WHOAMI.subtitle),
    paragraph1: pickContent(
      map,
      "about-whoami-paragraph1",
      DEFAULT_WHOAMI.paragraph1
    ),
    paragraph2: pickContent(
      map,
      "about-whoami-paragraph2",
      DEFAULT_WHOAMI.paragraph2
    ),
    imageUrl: pickContent(map, "about-whoami-image", DEFAULT_WHOAMI.imageUrl),
  };
}

export function mapBackground(map) {
  return {
    title: pickContent(map, "about-background-title", DEFAULT_BACKGROUND.title),
    subtitle: pickContent(
      map,
      "about-background-subtitle",
      DEFAULT_BACKGROUND.subtitle
    ),
    paragraph1: pickContent(
      map,
      "about-background-paragraph1",
      DEFAULT_BACKGROUND.paragraph1
    ),
    paragraph2: pickContent(
      map,
      "about-background-paragraph2",
      DEFAULT_BACKGROUND.paragraph2
    ),
    imageUrl: pickContent(
      map,
      "about-background-image",
      DEFAULT_BACKGROUND.imageUrl
    ),
  };
}

export function mapContactContent(map) {
  return {
    availableFor: parseJsonField(
      pickContent(
        map,
        "contact-content-availableFor",
        JSON.stringify(DEFAULT_CONTACT_CONTENT.availableFor)
      ),
      DEFAULT_CONTACT_CONTENT.availableFor
    ),
    links: parseJsonField(
      pickContent(
        map,
        "contact-content-links",
        JSON.stringify(DEFAULT_CONTACT_CONTENT.links)
      ),
      DEFAULT_CONTACT_CONTENT.links
    ),
    email: pickContent(
      map,
      "contact-content-email",
      DEFAULT_CONTACT_CONTENT.email
    ),
  };
}

const DEFAULT_SKILL_CATEGORIES = [
  "programming-language",
  "frontend",
  "backend",
  "game-dev",
  "tools",
  "soft-skills",
  "mathematics",
  "computer-science",
  "other",
];

export function mapTopSkillsSettings(map) {
  let count = parseInt(pickContent(map, "top-skills-count", "8"), 10) || 8;
  let categories = DEFAULT_SKILL_CATEGORIES;
  const rawCategories = pickContent(map, "top-skills-categories");
  if (rawCategories) {
    const parsed = parseJsonField(rawCategories, null);
    if (Array.isArray(parsed) && parsed.length > 0) {
      categories = parsed.map((value) => String(value || "").trim()).filter(Boolean);
    }
  }
  return { count, categories };
}

export function rankTopSkills(skills, settings) {
  const allowed = settings?.categories || DEFAULT_SKILL_CATEGORIES;
  const count = settings?.count || 8;
  return [...(skills || [])]
    .sort((a, b) => {
      const yearsDiff = (b.years_experience || 0) - (a.years_experience || 0);
      if (yearsDiff !== 0) return yearsDiff;
      return String(a.name || "").localeCompare(String(b.name || ""));
    })
    .filter((skill) => {
      const meta = getTagMeta(skill.name, skill.category);
      return allowed.includes(meta.category || "other");
    })
    .slice(0, count);
}

export async function getHomePageData() {
  const supabase = createServerClient();

  const [
    projectsResult,
    statsResult,
    introRows,
    topSkillSettingRows,
    skillsResult,
    aboutWhoamiRows,
    aboutBackgroundRows,
    contactRows,
  ] = await Promise.all([
    supabase.from("projects").select("*"),
    supabase.from("quick_stats").select("*").order("order", { ascending: true }),
    getPageContentRows("home", "intro"),
    getPageContentRows("home", "top-skills"),
    supabase.from("skills").select("*"),
    getPageContentRows("about", "whoami"),
    getPageContentRows("about", "background"),
    getPageContentRows("contact", "content"),
  ]);

  const projects = (projectsResult.data || []).map(mapProject).filter(Boolean);
  const topSkillsSettings = mapTopSkillsSettings(
    contentMapFromRows(topSkillSettingRows)
  );

  return {
    projects,
    latestProjects: getLatestProjects(projects, 3),
    quickStats: statsResult.data || [],
    homeIntro: mapHomeIntro(contentMapFromRows(introRows)),
    topSkillsSettings,
    topSkills: rankTopSkills(skillsResult.data || [], topSkillsSettings),
    aboutWhoami: mapWhoAmI(contentMapFromRows(aboutWhoamiRows)),
    aboutBackground: mapBackground(contentMapFromRows(aboutBackgroundRows)),
    contactContent: mapContactContent(contentMapFromRows(contactRows)),
  };
}
