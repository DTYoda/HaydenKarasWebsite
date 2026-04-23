import Link from "next/link";

function EyeIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 12C3.8 7.8 7.5 5 12 5C16.5 5 20.2 7.8 22 12C20.2 16.2 16.5 19 12 19C7.5 19 3.8 16.2 2 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function HeartIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 21C11.7 21 11.3 20.9 11.1 20.7C8.4 18.7 2 14.1 2 8.9C2 6 4.3 3.8 7.1 3.8C9 3.8 10.8 4.8 12 6.3C13.2 4.8 15 3.8 16.9 3.8C19.7 3.8 22 6 22 8.9C22 14.1 15.6 18.7 12.9 20.7C12.7 20.9 12.3 21 12 21Z" />
    </svg>
  );
}

function formatDate(value) {
  if (!value) {
    return "Draft";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Draft";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogList({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="glass rounded-2xl border border-orange-500/20 p-8 text-center text-gray-400">
        No blog posts published yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className="group block glass rounded-2xl border border-orange-500/20 p-6 hover:border-orange-500/50 hover:-translate-y-1 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        >
          {post.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-52 object-cover rounded-lg mb-4 border border-orange-500/20 transition-transform duration-500 group-hover:scale-[1.02]"
            />
          )}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <span>{formatDate(post.published_at || post.created_at)}</span>
            <span>-</span>
            <span>{post.status === "published" ? "Published" : "Draft"}</span>
          </div>
          <h2 className="text-2xl font-bold text-orange-400 mb-2 transition-colors duration-300 group-hover:text-orange-300">{post.title}</h2>
          <p className="text-gray-300 mb-4">{post.excerpt || "No excerpt provided."}</p>
          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={`${post.id}-${tag}`}
                  className="text-xs px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs mt-1">
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/25 bg-orange-500/10 px-2.5 py-1 text-orange-200">
              <EyeIcon />
              {(post.views_count || 0).toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-pink-500/25 bg-pink-500/10 px-2.5 py-1 text-pink-200">
              <HeartIcon />
              {(post.likes_count || 0).toLocaleString()}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
