"use client";

import { useEffect, useMemo, useState } from "react";
import BlogEditor from "./blogeditor";
import StandardTag from "./standardtag";

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

function normalizeTagIdArray(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value
    .map((tag) => String(tag || "").trim())
    .filter((tag) => {
      if (!tag) return false;
      if (seen.has(tag)) return false;
      seen.add(tag);
      return true;
    });
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
  const [selectedTagIds, setSelectedTagIds] = useState(normalizeTagIdArray(post?.tag_ids));
  const [availableTags, setAvailableTags] = useState([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
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
    setSelectedTagIds(normalizeTagIdArray(post?.tag_ids));
    setIsTagDropdownOpen(false);
    setCoverImageUrl(post?.cover_image_url || "");
    setEditorContent(getInitialEditorContent(post));
    setManualSlug(Boolean(post?.slug));
    setError("");
  }, [post]);

  useEffect(() => {
    const fetchTagOptions = async () => {
      try {
        const response = await fetch("/api/skillshandler", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        const options = (data.data || [])
          .map((skill) => ({
            id: String(skill.id || "").trim(),
            label: String(skill.name || "").trim(),
            category: String(skill.category || "other"),
          }))
          .filter((entry) => entry.id && entry.label);
        const byKey = new Map();
        options.forEach((option) => {
          byKey.set(option.id, option);
        });
        setAvailableTags(
          Array.from(byKey.values()).sort((a, b) => a.label.localeCompare(b.label))
        );
      } catch (fetchError) {
        console.error("Error loading blog tag options:", fetchError);
      }
    };

    fetchTagOptions();
  }, []);

  const tagOptions = useMemo(() => {
    const optionsByKey = new Map(availableTags.map((entry) => [entry.id, entry]));
    selectedTagIds.forEach((tagId) => {
      if (!optionsByKey.has(tagId)) {
        optionsByKey.set(tagId, { id: tagId, label: tagId, category: "other" });
      }
    });
    return Array.from(optionsByKey.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [availableTags, selectedTagIds]);

  const toggleTag = (tagId) => {
    setSelectedTagIds((prev) => {
      const normalizedId = String(tagId || "").trim();
      const exists = prev.includes(normalizedId);
      if (exists) {
        return prev.filter((tag) => tag !== normalizedId);
      }
      return [...prev, normalizedId];
    });
  };

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
      tags: selectedTagIds,
      coverImageUrl: coverImageUrl.trim(),
      contentJson: editorContent.json,
      contentHtml: editorContent.html,
      publishedAt: status === "published" ? post?.published_at || new Date().toISOString() : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-6 border border-orange-500/20 bg-[#0b0b0b]/95 space-y-5">
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
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTagDropdownOpen((prev) => !prev)}
              className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-left text-white focus:border-orange-500 focus:outline-none"
            >
              {selectedTagIds.length > 0
                ? `${selectedTagIds.length} tag${selectedTagIds.length === 1 ? "" : "s"} selected`
                : "Select tags"}
            </button>
            {isTagDropdownOpen && (
              <div className="absolute z-30 mt-2 w-full rounded-lg border border-orange-500/30 bg-[#0f0f0f] p-3 shadow-xl">
                <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                  {tagOptions.length > 0 ? (
                    tagOptions.map((tagOption) => {
                      const checked = selectedTagIds.some(
                        (tagId) => tagId === tagOption.id
                      );
                      return (
                        <label
                          key={`tag-option-${tagOption.label}`}
                          className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleTag(tagOption.id)}
                            className="accent-orange-500"
                          />
                          <span>{tagOption.label}</span>
                        </label>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-400">No skills available yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
          {selectedTagIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTagIds.map((tagId) => {
                const option = tagOptions.find((candidate) => candidate.id === tagId);
                return (
                  <StandardTag
                    key={`selected-${tagId}`}
                    label={option?.label || tagId}
                    category={option?.category || "other"}
                    onClick={() => toggleTag(tagId)}
                    title="Click to remove"
                  />
                );
              })}
            </div>
          )}
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

      <div className="rounded-2xl border border-orange-500/20 bg-[#0d0d0d]/95 p-5 sm:p-6">
        <label className="block text-sm font-semibold text-gray-300 mb-4">Post Content (WYSIWYG)</label>
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">{previewDate}</p>
          <h3 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">
            {title.trim() || "Your post title"}
          </h3>
          {excerpt.trim() && <p className="text-lg text-gray-300 mb-3">{excerpt.trim()}</p>}
          {selectedTagIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedTagIds.map((tagId) => {
                const option = tagOptions.find((candidate) => candidate.id === tagId);
                return (
                  <StandardTag
                    key={`preview-${tagId}`}
                    label={option?.label || tagId}
                    category={option?.category || "other"}
                  />
                );
              })}
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
