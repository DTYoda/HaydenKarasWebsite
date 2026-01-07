// Utility functions to convert between Supabase snake_case and camelCase

export function projectToCamelCase(project) {
  if (!project) return null;
  return {
    id: project.id,
    urlTitle: project.url_title,
    title: project.title,
    descriptions: project.descriptions,
    images: project.images,
    links: project.links,
    technologies: project.technologies,
    type: project.type,
    date: project.date
  };
}

export function educationToCamelCase(edu) {
  if (!edu) return null;
  return {
    id: edu.id,
    category: edu.category,
    name: edu.name,
    description: edu.description,
    link: edu.link,
    linkText: edu.link_text
  };
}

export function projectsToCamelCase(projects) {
  return (projects || []).map(projectToCamelCase);
}

export function educationToCamelCaseArray(education) {
  return (education || []).map(educationToCamelCase);
}

