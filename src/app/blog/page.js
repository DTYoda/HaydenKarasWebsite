import Navigation from "@/app/_components/navigation";
import BlogList from "@/app/_components/bloglist";
import { createServerClient } from "@/lib/supabase";

export const metadata = {
  title: "Blog | Hayden Karas",
  description: "Thoughts, build logs, and software engineering notes by Hayden Karas.",
};

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const supabase = createServerClient();

  let posts = [];
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (!error && data) {
      posts = data;
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen relative">
      <Navigation />
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text mb-3">Blog</h1>
          <p className="text-gray-300 max-w-3xl">
            A place where I share ideas, technical write-ups, and project updates.
          </p>
        </div>
        <BlogList posts={posts} />
      </div>
    </div>
  );
}
