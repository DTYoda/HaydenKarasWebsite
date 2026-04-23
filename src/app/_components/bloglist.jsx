import Link from "next/link";

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
        </Link>
      ))}
    </div>
  );
}
