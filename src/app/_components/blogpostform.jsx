"use client";

import { useEffect, useMemo, useState } from "react";
import BlogEditor from "./blogeditor";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function getInitialEditorContent(post) {
  if (post?.content_json && post?.content_html) {
    return {
      json: post.content_json,
      html: post.content_html,
    };
  }

  return {
    json: {
      type: "doc",
      content: [{ type: "paragraph" }],
    },
    html: "<p></p>",
  };
}

export default function BlogPostForm({
  post,
  onSave,
  onCancel,
  onUploadCover,
  isSaving,
}) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [status, setStatus] = useState(post?.status || "draft");
  const [tags, setTags] = useState(Array.isArray(post?.tags) ? post.tags.join(", ") : "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url || "");
  const [editorContent, setEditorContent] = useState(getInitialEditorContent(post));
  const [manualSlug, setManualSlug] = useState(Boolean(post?.slug));
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState("");
  const previewDate = status === "published" ? new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }) : "Draft preview";

  useEffect(() => {
    setTitle(post?.title || "");
    setSlug(post?.slug || "");
    setExcerpt(post?.excerpt || "");
    setStatus(post?.status || "draft");
    setTags(Array.isArray(post?.tags) ? post.tags.join(", ") : "");
    setCoverImageUrl(post?.cover_image_url || "");
    setEditorContent(getInitialEditorContent(post));
    setManualSlug(Boolean(post?.slug));
    setError("");
  }, [post]);

  useEffect(() => {
    if (manualSlug) {
      return;
    }
    setSlug(slugify(title));
  }, [title, manualSlug]);

  const canSave = useMemo(() => {
    return title.trim() && slug.trim() && editorContent?.html?.trim();
  }, [title, slug, editorContent]);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !onUploadCover) {
      return;
    }

    setUploadingCover(true);
    setError("");
    try {
      const url = await onUploadCover(file);
      if (url) {
        setCoverImageUrl(url);
      }
    } catch (uploadError) {
      setError(uploadError?.message || "Failed to upload cover image");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }

    if (!editorContent?.json || !editorContent?.html?.trim()) {
      setError("Post content is required.");
      return;
    }

    onSave({
      id: post?.id,
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      status,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      coverImageUrl: coverImageUrl.trim(),
      contentJson: editorContent.json,
      contentHtml: editorContent.html,
      publishedAt: status === "published" ? post?.published_at || new Date().toISOString() : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 border border-orange-500/20 space-y-5">
      <h2 className="text-2xl font-bold gradient-text">
        {post?.id ? "Edit Post" : "Create New Post"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            spellCheck
            className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
            placeholder="Post title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(event) => {
              setManualSlug(true);
              setSlug(slugify(event.target.value));
            }}
            spellCheck={false}
            className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
            placeholder="my-post-slug"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          rows={3}
          spellCheck
          className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
          placeholder="Short summary shown in blog list."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            spellCheck={false}
            className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
            placeholder="javascript, nextjs, supabase"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">Cover Image URL</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={coverImageUrl}
            onChange={(event) => setCoverImageUrl(event.target.value)}
            className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
            placeholder="https://..."
          />
          <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-orange-500/40 text-orange-400 hover:bg-orange-500/10 cursor-pointer whitespace-nowrap">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploadingCover}
            />
            {uploadingCover ? "Uploading..." : "Upload Image"}
          </label>
        </div>
        {coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImageUrl}
            alt="Cover preview"
            className="mt-3 h-40 w-full object-cover rounded-lg border border-orange-500/20"
          />
        )}
      </div>

      <div className="glass rounded-2xl border border-orange-500/20 p-5 sm:p-6">
        <label className="block text-sm font-semibold text-gray-300 mb-4">Post Content (WYSIWYG)</label>
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">{previewDate}</p>
          <h3 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">
            {title.trim() || "Your post title"}
          </h3>
          {excerpt.trim() && <p className="text-lg text-gray-300 mb-3">{excerpt.trim()}</p>}
          {tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
                .map((tag) => (
                  <span
                    key={`preview-${tag}`}
                    className="text-xs px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-300"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          )}
        </div>
        <BlogEditor value={editorContent} onChange={setEditorContent} />
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/40 rounded-lg px-4 py-2 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={!canSave || isSaving}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : post?.id ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-orange-500/30 text-gray-200 hover:bg-orange-500/10"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
