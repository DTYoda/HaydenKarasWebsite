"use client";

import Link from "next/link";

function Section({ title, items, renderItem }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-5">
      <h4 className="text-sm uppercase tracking-wider text-orange-300 font-semibold mb-2">
        {title}
      </h4>
      <ul className="space-y-2 text-sm text-gray-200">{items.map(renderItem)}</ul>
    </div>
  );
}

export default function TagUsageModal({ tagUsage, onClose }) {
  if (!tagUsage) return null;

  const {
    label,
    description,
    years_experience,
    counts = {},
    projects = [],
    work = [],
    research = [],
    coursework = [],
    blog_posts: blogPosts = [],
  } = tagUsage;
  const countCards = [
    { key: "projects", label: "Projects", value: Number(counts.projects || 0) },
    { key: "work", label: "Work", value: Number(counts.work || 0) },
    { key: "research", label: "Research", value: Number(counts.research || 0) },
    { key: "coursework", label: "Coursework", value: Number(counts.coursework || 0) },
    { key: "blog_posts", label: "Blog Posts", value: Number(counts.blog_posts || 0) },
  ].filter((entry) => entry.value > 0);

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl border border-orange-500/40 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold gradient-text">{label}</h3>
            {description ? (
              <p className="text-sm text-gray-300 mt-2">{description}</p>
            ) : null}
            <p className="text-sm text-gray-300 mt-2">
              {Number.isFinite(Number(years_experience))
                ? `${years_experience} years experience`
                : "Years experience not set"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>

        {countCards.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
            {countCards.map((entry) => (
              <div
                key={`count-${entry.key}`}
                className="rounded-lg border border-orange-500/25 bg-black/30 p-3 text-center"
              >
                <p className="text-xs text-gray-400">{entry.label}</p>
                <p className="text-xl font-bold text-orange-300">{entry.value}</p>
              </div>
            ))}
          </div>
        )}

        <Section
          title="Projects"
          items={projects}
          renderItem={(item) => (
            <li key={`project-${item.id}`}>
              <Link
                href={`/portfolio/${item.url_title}`}
                className="text-orange-300 hover:text-orange-200 font-medium"
              >
                {item.title}
              </Link>
            </li>
          )}
        />

        <Section
          title="Work"
          items={work}
          renderItem={(item) => (
            <li key={`work-${item.id}`}>
              <span className="font-medium">{item.title}</span>
              {item.organization ? ` - ${item.organization}` : ""}
            </li>
          )}
        />

        <Section
          title="Research"
          items={research}
          renderItem={(item) => (
            <li key={`research-${item.id}`}>
              <span className="font-medium">{item.title}</span>
              {item.organization ? ` - ${item.organization}` : ""}
            </li>
          )}
        />

        <Section
          title="Coursework"
          items={coursework}
          renderItem={(item) => (
            <li key={`course-${item.id}`}>
              <span className="font-medium">{item.title}</span>
              {item.term_label ? ` - ${item.term_label}` : ""}
            </li>
          )}
        />

        <Section
          title="Blog Posts"
          items={blogPosts}
          renderItem={(item) => (
            <li key={`blog-${item.id}`}>
              <Link
                href={`/blog/${item.slug}`}
                className="text-orange-300 hover:text-orange-200 font-medium"
              >
                {item.title}
              </Link>
            </li>
          )}
        />
      </div>
    </div>
  );
}
