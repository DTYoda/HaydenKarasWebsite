"use client";

import { useEffect, useState } from "react";

function EyeIcon({ className = "w-4 h-4" }) {
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

function HeartIcon({ className = "w-4 h-4", filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 21C11.7 21 11.3 20.9 11.1 20.7C8.4 18.7 2 14.1 2 8.9C2 6 4.3 3.8 7.1 3.8C9 3.8 10.8 4.8 12 6.3C13.2 4.8 15 3.8 16.9 3.8C19.7 3.8 22 6 22 8.9C22 14.1 15.6 18.7 12.9 20.7C12.7 20.9 12.3 21 12 21Z"
        stroke="currentColor"
        strokeWidth={filled ? "0" : "1.8"}
      />
    </svg>
  );
}

export default function BlogEngagement({ slug, initialViews = 0, initialLikes = 0 }) {
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  useEffect(() => {
    let mounted = true;

    const trackView = async () => {
      try {
        const response = await fetch("/api/blogengagement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, action: "view" }),
        });
        const data = await response.json();
        if (!response.ok || !data.success || !mounted) {
          return;
        }
        setViews(data.viewsCount);
        setLikes(data.likesCount);
        setLiked(Boolean(data.likedByCurrentUser));
      } catch (error) {
        // Non-blocking if tracking fails.
      }
    };

    trackView();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleLike = async () => {
    if (loadingLike || liked) {
      return;
    }

    setLoadingLike(true);
    try {
      const response = await fetch("/api/blogengagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action: "like" }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        return;
      }
      setViews(data.viewsCount);
      setLikes(data.likesCount);
      setLiked(Boolean(data.likedByCurrentUser));
    } catch (error) {
      // Non-blocking if tracking fails.
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <div className="mt-5 flex items-center gap-3 flex-wrap">
      <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1.5 text-sm text-orange-200">
        <EyeIcon />
        <span>{views.toLocaleString()} views</span>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1.5 text-sm text-pink-200">
        <HeartIcon filled />
        <span>{likes.toLocaleString()} likes</span>
      </div>
      <button
        type="button"
        onClick={handleLike}
        disabled={liked || loadingLike}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-300 ${
          liked
            ? "border-pink-400/70 bg-gradient-to-r from-pink-500/30 to-orange-500/30 text-pink-100 cursor-not-allowed shadow-md shadow-pink-500/20"
            : "border-orange-500/40 text-gray-100 bg-gradient-to-r from-orange-500/10 to-pink-500/10 hover:from-orange-500/25 hover:to-pink-500/25 hover:border-orange-400/80 hover:shadow-md hover:shadow-orange-500/20 hover:-translate-y-0.5"
        } disabled:opacity-80`}
      >
        <HeartIcon filled={liked} />
        {loadingLike ? "Liking..." : liked ? "Liked" : "Like this post"}
      </button>
    </div>
  );
}
