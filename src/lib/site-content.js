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

export function mapWhoAmI(map) {
  return {
    title: pickContent(map, "about-whoami-title"),
    subtitle: pickContent(map, "about-whoami-subtitle"),
    paragraph1: pickContent(map, "about-whoami-paragraph1"),
    paragraph2: pickContent(map, "about-whoami-paragraph2"),
  };
}

export function mapBackground(map) {
  return {
    title: pickContent(map, "about-background-title"),
    subtitle: pickContent(map, "about-background-subtitle"),
    paragraph1: pickContent(map, "about-background-paragraph1"),
    paragraph2: pickContent(map, "about-background-paragraph2"),
  };
}

export function mapContactContent(map) {
  return {
    availableFor: parseJsonField(
      pickContent(map, "contact-content-availableFor", "[]"),
      []
    ),
    links: parseJsonField(pickContent(map, "contact-content-links", "[]"), []),
    email: pickContent(map, "contact-content-email"),
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
