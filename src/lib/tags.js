const CATEGORY_METADATA = {
  "programming-language": { emoji: "💻", dotClass: "bg-indigo-400" },
  frontend: { emoji: "🎨", dotClass: "bg-cyan-400" },
  backend: { emoji: "⚙️", dotClass: "bg-emerald-400" },
  "game-dev": { emoji: "🎮", dotClass: "bg-purple-400" },
  tools: { emoji: "🛠️", dotClass: "bg-yellow-400" },
  "soft-skills": { emoji: "🤝", dotClass: "bg-rose-400" },
  mathematics: { emoji: "∑", dotClass: "bg-fuchsia-400" },
  "computer-science": { emoji: "🧠", dotClass: "bg-sky-400" },
  other: { emoji: "🏷️", dotClass: "bg-orange-400" },
};

export const CORE_SKILL_CATEGORIES = ["soft-skills", "mathematics", "computer-science"];
export const TECHNICAL_SKILL_CATEGORIES = [
  "programming-language",
  "frontend",
  "backend",
  "game-dev",
  "tools",
];

export const PROJECT_CATEGORY_LABELS = {
  "programming-language": "Programming Language",
  frontend: "Frontend",
  backend: "Backend",
  "game-dev": "Game Development",
  tools: "Tools & DevOps",
  "soft-skills": "Soft Skills",
  mathematics: "Mathematics",
  "computer-science": "Computer Science",
  other: "Other",
};

const SKILL_CATEGORY_ALIASES = {
  languages: "programming-language",
  language: "programming-language",
  frameworks: "frontend",
  framework: "frontend",
  apis: "backend",
  "soft skills": "soft-skills",
  softskills: "soft-skills",
  "computer science": "computer-science",
  compsci: "computer-science",
};

function normalizeRaw(value) {
  return String(value || "").trim();
}

export function canonicalizeTagLabel(value) {
  const raw = normalizeRaw(value);
  if (!raw) return "";
  return raw;
}

export function normalizeTagList(value) {
  const items = Array.isArray(value)
    ? value
    : typeof value === "string" && value.trim()
    ? value.split("\n")
    : [];

  const canonical = items
    .map((item) => canonicalizeTagLabel(item))
    .filter(Boolean);

  const seen = new Set();
  return canonical.filter((item) => {
    const key = item.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function normalizeTagKey(value) {
  return canonicalizeTagLabel(value).toLowerCase();
}

export function getTagMeta(value, fallbackCategory = "other") {
  const label = canonicalizeTagLabel(value);
  const normalizedCategory =
    SKILL_CATEGORY_ALIASES[String(fallbackCategory || "").toLowerCase()] ||
    fallbackCategory ||
    "other";
  const categoryMeta = CATEGORY_METADATA[normalizedCategory] || CATEGORY_METADATA.other;

  return {
    label,
    category: normalizedCategory,
    emoji: categoryMeta.emoji,
    dotClass: categoryMeta.dotClass,
  };
}

export function getTotalAppearances(usage) {
  if (!usage || !usage.counts) return 0;
  return (
    Number(usage.counts.projects || 0) +
    Number(usage.counts.work || 0) +
    Number(usage.counts.research || 0) +
    Number(usage.counts.coursework || 0)
  );
}

export function buildTagSummary({ yearsExperience, counts }) {
  const parts = [];
  const years = Number(yearsExperience);
  if (Number.isFinite(years) && years > 0) parts.push(`${years}y exp`);

  const mapping = [
    ["projects", "proj"],
    ["work", "work"],
    ["research", "research"],
    ["coursework", "courses"],
  ];

  mapping.forEach(([key, label]) => {
    const value = Number(counts?.[key] || 0);
    if (value > 0) parts.push(`${value} ${label}`);
  });

  return parts.join(" • ");
}

export function buildTagStatChips({ yearsExperience, counts }) {
  const chips = [];
  const years = Number(yearsExperience);
  if (Number.isFinite(years) && years > 0) chips.push(`${years}y`);

  const mapping = [
    ["projects", "proj"],
    ["work", "work"],
    ["research", "research"],
    ["coursework", "courses"],
  ];

  mapping.forEach(([key, label]) => {
    const value = Number(counts?.[key] || 0);
    if (value > 0) chips.push(`${value} ${label}`);
  });

  return chips;
}
