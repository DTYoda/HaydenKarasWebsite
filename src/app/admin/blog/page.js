"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "@/app/_components/navigation";
import { useAuth } from "@/app/_components/authprovider";
import BlogPostManager from "@/app/_components/blogpostmanager";

export default function AdminBlogPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen">
        <Navigation />
        <div className="pt-24 px-6 max-w-7xl mx-auto">
          <p className="text-gray-400">Checking admin session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen">
        <Navigation />
        <div className="pt-24 px-6 max-w-7xl mx-auto">
          <div className="glass rounded-2xl p-6 border border-orange-500/20">
            <h1 className="text-2xl font-bold gradient-text">Admin Access Required</h1>
            <p className="text-gray-300 mt-2">
              Please log in from the admin page to manage blog posts.
            </p>
            <Link
              href="/admin"
              className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              Go to Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navigation />
      <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto space-y-6">
        <div className="glass rounded-2xl p-6 border border-orange-500/20">
          <h1 className="text-4xl font-bold gradient-text mb-2">Blog Admin</h1>
          <p className="text-gray-300">
            Create, edit, publish, and delete blog posts using the rich text editor.
          </p>
        </div>
        <BlogPostManager />
      </div>
    </div>
  );
}
