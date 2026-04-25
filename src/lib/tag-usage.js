import { canonicalizeTagLabel, getTagMeta, normalizeTagKey } from "./tags";

function ensureUsage(map, label, fallbackCategory = "other") {
  const canonicalLabel = canonicalizeTagLabel(label);
  const key = normalizeTagKey(canonicalLabel);
  if (!key) return null;
  const tagMeta = getTagMeta(canonicalLabel, fallbackCategory);

  if (!map[key]) {
    map[key] = {
      key,
      label: tagMeta.label,
      category: tagMeta.category,
      emoji: tagMeta.emoji,
      dotClass: tagMeta.dotClass,
      years_experience: null,
      description: "",
      projects: [],
      work: [],
      research: [],
      coursework: [],
      blog_posts: [],
      counts: {
        projects: 0,
        work: 0,
        research: 0,
        coursework: 0,
        blog_posts: 0,
      },
    };
  } else if (fallbackCategory && map[key].category === "other") {
    const nextMeta = getTagMeta(map[key].label, fallbackCategory);
    map[key].category = nextMeta.category;
    map[key].emoji = nextMeta.emoji;
    map[key].dotClass = nextMeta.dotClass;
  }
  return map[key];
}

function parseProjectTechnologies(rawTechnologies) {
  if (Array.isArray(rawTechnologies)) return rawTechnologies;
  if (typeof rawTechnologies === "string" && rawTechnologies.trim()) {
    try {
      const parsed = JSON.parse(rawTechnologies);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.id}-${item.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getTagUsageMap(supabase) {
  const [projectsRes, skillsRes, workRes, eduRes, blogRes] = await Promise.all([
    supabase.from("projects").select("id,title,url_title,technologies"),
    supabase.from("skills").select("id,name,category,description,years_experience"),
    supabase.from("work_research_experience").select("id,title,type,organization,tags"),
    supabase.from("education_timeline_courses").select("id,course_name,term_label,tags"),
    supabase.from("blog_posts").select("id,title,slug,tags,status"),
  ]);

  if (projectsRes.error) throw projectsRes.error;
  if (skillsRes.error) throw skillsRes.error;
  if (workRes.error) throw workRes.error;
  if (eduRes.error) throw eduRes.error;
  if (blogRes.error) throw blogRes.error;

  const usageByKey = {};
  const skillById = new Map();
  (skillsRes.data || []).forEach((skill) => {
    const id = String(skill.id || "").trim();
    if (!id) return;
    skillById.set(id, skill);
  });

  const resolveSkillFromReference = (reference) => {
    const raw = String(reference || "").trim();
    if (!raw) return null;
    return skillById.get(raw) || null;
  };

  (projectsRes.data || []).forEach((project) => {
    const technologies = parseProjectTechnologies(project.technologies);
    technologies.forEach((tech) => {
      const linkedSkill = resolveSkillFromReference(tech?.id || tech?.skill_id);
      const label = linkedSkill?.name || tech?.title || tech?.name;
      const usage = ensureUsage(
        usageByKey,
        label,
        linkedSkill?.category || tech?.category
      );
      if (!usage) return;
      usage.projects.push({
        id: project.id,
        title: project.title,
        url_title: project.url_title,
      });
    });
  });

  (skillsRes.data || []).forEach((skill) => {
    const usage = ensureUsage(usageByKey, skill.name, skill.category);
    if (!usage) return;
    // Skills table is the source of truth for editable tag names.
    usage.label = String(skill.name || usage.label).trim() || usage.label;
    const refreshedMeta = getTagMeta(usage.label, skill.category || usage.category);
    usage.category = refreshedMeta.category;
    usage.emoji = refreshedMeta.emoji;
    usage.dotClass = refreshedMeta.dotClass;
    usage.description = String(skill.description || "").trim();
    const years = Number(skill.years_experience);
    if (Number.isFinite(years) && years >= 0) {
      usage.years_experience = years;
    }
  });

  (workRes.data || []).forEach((entry) => {
    const tags = Array.isArray(entry.tags) ? entry.tags : [];
    tags.forEach((tag) => {
      const linkedSkill = resolveSkillFromReference(tag);
      const usage = ensureUsage(
        usageByKey,
        linkedSkill?.name || tag,
        linkedSkill?.category || (entry.type === "research" ? "backend" : "other")
      );
      if (!usage) return;
      const target = entry.type === "research" ? usage.research : usage.work;
      target.push({
        id: entry.id,
        title: entry.title,
        organization: entry.organization,
      });
    });
  });

  (eduRes.data || []).forEach((course) => {
    const tags = Array.isArray(course.tags) ? course.tags : [];
    tags.forEach((tag) => {
      const linkedSkill = resolveSkillFromReference(tag);
      const usage = ensureUsage(
        usageByKey,
        linkedSkill?.name || tag,
        linkedSkill?.category || "other"
      );
      if (!usage) return;
      usage.coursework.push({
        id: course.id,
        title: course.course_name,
        term_label: course.term_label,
      });
    });
  });

  (blogRes.data || [])
    .filter((post) => post.status === "published")
    .forEach((post) => {
      const tags = Array.isArray(post.tags) ? post.tags : [];
      tags.forEach((tag) => {
        const linkedSkill = resolveSkillFromReference(tag);
        const usage = ensureUsage(
          usageByKey,
          linkedSkill?.name || tag,
          linkedSkill?.category || "other"
        );
        if (!usage) return;
        usage.blog_posts.push({
          id: post.id,
          title: post.title,
          slug: post.slug,
        });
      });
    });

  Object.values(usageByKey).forEach((usage) => {
    usage.projects = uniqueById(usage.projects);
    usage.work = uniqueById(usage.work);
    usage.research = uniqueById(usage.research);
    usage.coursework = uniqueById(usage.coursework);
    usage.blog_posts = uniqueById(usage.blog_posts);
    usage.counts = {
      projects: usage.projects.length,
      work: usage.work.length,
      research: usage.research.length,
      coursework: usage.coursework.length,
      blog_posts: usage.blog_posts.length,
    };
  });

  return usageByKey;
}
