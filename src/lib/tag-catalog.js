const SKILL_CATEGORY_ALIASES = {
  languages: "programming-language",
  language: "programming-language",
  frameworks: "frontend",
  framework: "frontend",
  apis: "backend",
};

export function normalizeTagKey(value) {
  return String(value || "").trim().toLowerCase();
}

export function normalizeSkillCategory(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (!raw) return "other";
  return SKILL_CATEGORY_ALIASES[raw] || raw;
}

export async function getSkillCatalog(supabase) {
  const { data, error } = await supabase
    .from("skills")
    .select("name,category,description")
    .order("name", { ascending: true });

  if (error) throw error;

  const byKey = new Map();
  (data || []).forEach((skill) => {
    const key = normalizeTagKey(skill.name);
    if (!key) return;
    byKey.set(key, {
      name: String(skill.name || "").trim(),
      category: normalizeSkillCategory(skill.category),
      description: String(skill.description || "").trim(),
    });
  });

  return {
    byKey,
    options: Array.from(byKey.values()).map((skill) => ({
      value: skill.name,
      label: skill.name,
      category: skill.category || "other",
    })),
  };
}

export function normalizeSelectedTags(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (item === null || item === undefined ? "" : String(item).trim()))
      .filter((item) => item && item.toLowerCase() !== "null" && item.toLowerCase() !== "undefined");
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function sanitizeTagSelection(value, catalogByKey) {
  const selected = normalizeSelectedTags(value);
  const unknown = [];
  const resolved = [];
  const seen = new Set();

  selected.forEach((tag) => {
    const key = normalizeTagKey(tag);
    if (!key) return;
    const skill = catalogByKey.get(key);
    if (!skill) {
      unknown.push(tag);
      return;
    }
    if (seen.has(skill.name.toLowerCase())) return;
    seen.add(skill.name.toLowerCase());
    resolved.push(skill.name);
  });

  return {
    tags: resolved,
    unknown,
  };
}

export function parseProjectTechnologies(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function sanitizeProjectTechnologies(value, catalogByKey) {
  const technologies = parseProjectTechnologies(value);
  const unknown = [];

  const next = technologies
    .map((tech) => {
      if (!tech || typeof tech !== "object") return null;
      const rawName = String(tech.title || tech.name || "").trim();
      const key = normalizeTagKey(rawName);
      if (!key) return null;
      const skill = catalogByKey.get(key);
      if (!skill) {
        unknown.push(rawName);
        return null;
      }

      const normalized = {
        title: skill.name,
        category: skill.category || "other",
      };

      if (tech.link) normalized.link = String(tech.link).trim();
      if (Number.isFinite(Number(tech.proficiency))) {
        normalized.proficiency = Number(tech.proficiency);
      }
      if (tech.color) normalized.color = String(tech.color).trim();

      return normalized;
    })
    .filter(Boolean);

  const deduped = [];
  const seen = new Set();
  next.forEach((tech) => {
    const key = normalizeTagKey(tech.title);
    if (seen.has(key)) return;
    seen.add(key);
    deduped.push(tech);
  });

  return {
    technologies: deduped,
    unknown,
  };
}
