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
    .select("id,name,category,description,years_experience")
    .order("name", { ascending: true });

  if (error) throw error;

  const byKey = new Map();
  const byId = new Map();
  (data || []).forEach((skill) => {
    const id = String(skill.id || "").trim();
    const key = normalizeTagKey(skill.name);
    if (!id || !key) return;
    const normalized = {
      id,
      name: String(skill.name || "").trim(),
      category: normalizeSkillCategory(skill.category),
      description: String(skill.description || "").trim(),
      years_experience: skill.years_experience,
    };
    byKey.set(key, normalized);
    byId.set(id, normalized);
  });

  return {
    byKey,
    byId,
    options: Array.from(byKey.values()).map((skill) => ({
      value: skill.id,
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
  const resolvedIds = [];
  const seen = new Set();

  selected.forEach((tag) => {
    const raw = String(tag || "").trim();
    if (!raw) return;
    const skill =
      catalogByKey.byId?.get(raw) ||
      catalogByKey.byKey?.get(normalizeTagKey(raw)) ||
      null;
    if (!skill) {
      unknown.push(tag);
      return;
    }
    if (seen.has(skill.id)) return;
    seen.add(skill.id);
    resolvedIds.push(skill.id);
  });

  return {
    tagIds: resolvedIds,
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
      const rawSkillId = String(tech?.id || tech?.skill_id || tech || "").trim();
      const rawName = String(tech?.title || tech?.name || tech || "").trim();
      const skill =
        catalogByKey.byId?.get(rawSkillId) ||
        catalogByKey.byKey?.get(normalizeTagKey(rawName)) ||
        null;
      if (!skill) {
        unknown.push(rawName || rawSkillId);
        return null;
      }

      const normalized = {
        id: skill.id,
        title: skill.name,
        category: skill.category || "other",
      };

      if (tech?.link) normalized.link = String(tech.link).trim();
      if (Number.isFinite(Number(tech?.proficiency))) {
        normalized.proficiency = Number(tech.proficiency);
      }
      if (tech?.color) normalized.color = String(tech.color).trim();

      return normalized;
    })
    .filter(Boolean);

  const deduped = [];
  const seen = new Set();
  next.forEach((tech) => {
    const key = String(tech.id);
    if (seen.has(key)) return;
    seen.add(key);
    deduped.push(tech);
  });

  return {
    technologies: deduped,
    unknown,
  };
}

export function resolveTagLabels(tagIds, catalogById, catalogByKey = new Map()) {
  const labels = [];
  const ids = normalizeSelectedTags(tagIds);
  ids.forEach((id) => {
    const raw = String(id || "").trim();
    const skill = catalogById.get(raw) || catalogByKey.get(normalizeTagKey(raw));
    if (!skill) return;
    labels.push(skill.name);
  });
  return labels;
}
