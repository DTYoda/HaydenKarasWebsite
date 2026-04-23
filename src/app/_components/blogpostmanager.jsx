"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogPostForm from "./blogpostform";

function formatDate(value) {
  if (!value) {
    return "Unpublished";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unpublished";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPostManager() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/bloghandler?includeDrafts=true", {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch posts");
      }
      setPosts(data.data || []);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSave = async (payload) => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/bloghandler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: payload.id ? "edit" : "new",
          ...payload,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save post");
      }

      setMessage(payload.id ? "Post updated." : "Post created.");
      setSelectedPost(data.data || null);
      await fetchPosts();
      router.refresh();
    } catch (saveError) {
      setError(saveError.message || "Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId) => {
    const confirmed = window.confirm("Delete this post? This action cannot be undone.");
    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/bloghandler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "delete", id: postId }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete post");
      }

      if (selectedPost?.id === postId) {
        setSelectedPost(null);
      }
      setMessage("Post deleted.");
      await fetchPosts();
      router.refresh();
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete post");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCover = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || "Upload failed");
    }
    return data.url;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 glass rounded-2xl border border-orange-500/20 p-4 h-fit">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-orange-400">Posts</h2>
          <button
            type="button"
            onClick={() => setSelectedPost(null)}
            className="px-3 py-1.5 rounded-md text-sm bg-orange-500 text-white hover:bg-orange-600"
          >
            New
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-400 text-sm">No posts yet. Create your first blog post.</p>
        ) : (
          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {posts.map((post) => (
              <div
                key={post.id}
                className={`rounded-lg border p-3 cursor-pointer transition-colors ${
                  selectedPost?.id === post.id
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-orange-500/20 bg-gray-900/40 hover:border-orange-500/50"
                }`}
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-100">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-1">/{post.slug}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {post.status === "published" ? "Published" : "Draft"} - {formatDate(post.published_at)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(post.id);
                    }}
                    className="text-xs px-2 py-1 rounded border border-red-500/40 text-red-300 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-2">
        {message && (
          <div className="mb-4 bg-emerald-500/20 border border-emerald-500/40 rounded-lg px-4 py-2 text-emerald-300 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/40 rounded-lg px-4 py-2 text-red-300 text-sm">
            {error}
          </div>
        )}
        <BlogPostForm
          post={selectedPost}
          onSave={handleSave}
          onCancel={() => setSelectedPost(null)}
          onUploadCover={handleUploadCover}
          isSaving={saving}
        />
      </div>
    </div>
  );
}
