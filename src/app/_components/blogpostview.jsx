import { BLOG_CONTENT_CLASS } from "./blogcontentstyles";
import BlogEngagement from "./blogengagement";

function formatDate(value) {
  if (!value) {
    return "Unpublished";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unpublished";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPostView({ post }) {
  return (
    <article className="glass rounded-2xl border border-orange-500/20 p-6 sm:p-8">
      <header className="mb-8">
        <p className="text-sm text-gray-400 mb-2">
          {formatDate(post.published_at || post.created_at)}
          {post.status === "draft" ? " - Draft preview" : ""}
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-4">{post.title}</h1>
        {post.excerpt && <p className="text-lg text-gray-300">{post.excerpt}</p>}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
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
        <BlogEngagement
          slug={post.slug}
          initialViews={post.views_count || 0}
          initialLikes={post.likes_count || 0}
        />
      </header>

      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full max-h-[420px] object-cover rounded-xl mb-8 border border-orange-500/20"
        />
      )}

      <div
        className={`text-gray-200 ${BLOG_CONTENT_CLASS}`}
        dangerouslySetInnerHTML={{ __html: post.content_html || "<p></p>" }}
      />
    </article>
  );
}
