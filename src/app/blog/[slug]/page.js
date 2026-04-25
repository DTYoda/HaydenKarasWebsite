import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navigation from "@/app/_components/navigation";
import BlogPostView from "@/app/_components/blogpostview";
import { createServerClient } from "@/lib/supabase";

export const revalidate = 0;
export const dynamic = "force-dynamic";

async function fetchPostBySlug(slug) {
  const supabase = createServerClient();
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "authenticated";

  let query = supabase.from("blog_posts").select("*").eq("slug", slug).limit(1);
  if (!isAdmin) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query;
  if (error || !data?.length) {
    return null;
  }

  const post = data[0];
  const { data: skillsData, error: skillsError } = await supabase.from("skills").select("id,name");
  if (skillsError) return post;
  const skillById = new Map(
    (skillsData || [])
      .map((skill) => [String(skill.id || "").trim(), String(skill.name || "").trim()])
      .filter(([id, name]) => id && name)
  );
  const skillByNameKey = new Map(
    (skillsData || [])
      .map((skill) => [
        String(skill.name || "").trim().toLowerCase(),
        String(skill.name || "").trim(),
      ])
      .filter(([key, name]) => key && name)
  );
  const tagIds = Array.isArray(post.tags) ? post.tags.map((tag) => String(tag || "").trim()) : [];
  return {
    ...post,
    tag_ids: tagIds,
    tags: tagIds
      .map((id) => skillById.get(id) || skillByNameKey.get(id.toLowerCase()))
      .filter(Boolean),
  };
}

export async function generateMetadata({ params }) {
  const post = await fetchPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Post Not Found | Hayden Karas",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | Hayden Karas`,
    description: post.excerpt || "Read this blog post by Hayden Karas.",
  };
}

export default async function BlogPostPage({ params }) {
  const post = await fetchPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen relative">
      <Navigation />
      <div className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 mb-5 text-orange-400 hover:text-orange-300 transition-colors"
        >
          <span aria-hidden="true">{"<"}</span>
          <span>Back to Blog</span>
        </Link>
        <BlogPostView post={post} />
      </div>
    </div>
  );
}
