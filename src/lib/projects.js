export function parseJsonField(value, fallback = []) {
  if (value == null || value === "") return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function stringifyJsonField(value, fallback = []) {
  if (value == null) return JSON.stringify(fallback);
  if (typeof value === "string") {
    try {
      JSON.parse(value);
      return value;
    } catch {
      return JSON.stringify(fallback);
    }
  }
  return JSON.stringify(value);
}

export function isMissingDate(dateStr) {
  if (dateStr == null) return true;
  const text = String(dateStr).trim();
  return text === "" || text === "undefined" || text === "null";
}

export function parseProjectDate(dateStr) {
  if (isMissingDate(dateStr)) return null;

  const yyyyMm = String(dateStr).match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/);
  if (yyyyMm) {
    const year = parseInt(yyyyMm[1], 10);
    const month = parseInt(yyyyMm[2], 10) - 1;
    const day = yyyyMm[3] ? parseInt(yyyyMm[3], 10) : 1;
    const date = new Date(year, month, day);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function compareProjectDatesDesc(a, b) {
  const dateA = parseProjectDate(a?.date);
  const dateB = parseProjectDate(b?.date);
  if (dateA && dateB) return dateB.getTime() - dateA.getTime();
  if (dateA && !dateB) return -1;
  if (!dateA && dateB) return 1;
  return 0;
}

export function formatDateDisplay(dateStr) {
  const date = parseProjectDate(dateStr);
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

export function mapProject(project) {
  if (!project) return null;
  return {
    id: project.id,
    urlTitle: project.url_title || project.urlTitle,
    title: project.title,
    descriptions: project.descriptions,
    images: project.images,
    links: project.links,
    technologies: project.technologies,
    highlights: project.highlights,
    type: project.type,
    date: isMissingDate(project.date) ? null : project.date,
  };
}

export function getProjectImages(project) {
  const images = parseJsonField(project?.images, []);
  return Array.isArray(images) ? images : [];
}

export function getProjectImageUrl(project, image) {
  if (!image || typeof image !== "string") return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const slug = project?.urlTitle || project?.url_title || "";
  return slug ? `/${slug}/${image}` : image;
}

export function getLatestProjects(projects, count = 3) {
  return [...(projects || [])].sort(compareProjectDatesDesc).slice(0, count);
}

export function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
