const WRITE_ACTIONS = new Set(["new", "edit", "delete", "get"]);

export function getWriteAction(body) {
  if (body?.action && WRITE_ACTIONS.has(body.action)) return body.action;
  if (body?.type && WRITE_ACTIONS.has(body.type)) return body.type;
  return null;
}

export function getProjectType(body, fallback = "website") {
  if (body?.projectType) return body.projectType;
  if (typeof body?.type === "string" && !WRITE_ACTIONS.has(body.type)) {
    return body.type;
  }
  return fallback;
}

export function normalizeDateValue(value) {
  if (value == null) return null;
  const text = String(value).trim();
  if (!text || text === "undefined" || text === "null") return null;
  return text;
}
