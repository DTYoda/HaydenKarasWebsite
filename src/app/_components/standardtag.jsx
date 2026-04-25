"use client";

import { getTagMeta } from "@/lib/tags";

export default function StandardTag({
  label,
  meta,
  href,
  title,
  onClick,
  className = "",
  category,
  showEmoji = true,
  showDot = false,
}) {
  if (!label) return null;
  const tagMeta = getTagMeta(label, category);
  const categoryStyles = {
    frontend: {
      border: "#67e8f9",
      start: "rgba(59,130,246,0.45)",
      end: "rgba(34,211,238,0.45)",
      meta: "text-cyan-200",
    },
    backend: {
      border: "#6ee7b7",
      start: "rgba(34,197,94,0.45)",
      end: "rgba(16,185,129,0.45)",
      meta: "text-emerald-200",
    },
    "game-dev": {
      border: "#d8b4fe",
      start: "rgba(168,85,247,0.45)",
      end: "rgba(236,72,153,0.45)",
      meta: "text-purple-200",
    },
    tools: {
      border: "#fde047",
      start: "rgba(234,179,8,0.45)",
      end: "rgba(249,115,22,0.45)",
      meta: "text-yellow-200",
    },
    "soft-skills": {
      border: "#fda4af",
      start: "rgba(244,63,94,0.45)",
      end: "rgba(251,113,133,0.45)",
      meta: "text-rose-200",
    },
    mathematics: {
      border: "#f0abfc",
      start: "rgba(192,38,211,0.45)",
      end: "rgba(217,70,239,0.45)",
      meta: "text-fuchsia-200",
    },
    "computer-science": {
      border: "#7dd3fc",
      start: "rgba(14,165,233,0.45)",
      end: "rgba(56,189,248,0.45)",
      meta: "text-sky-200",
    },
    "programming-language": {
      border: "#a5b4fc",
      start: "rgba(99,102,241,0.45)",
      end: "rgba(167,139,250,0.45)",
      meta: "text-indigo-200",
    },
    other: {
      border: "#fdba74",
      start: "rgba(249,115,22,0.45)",
      end: "rgba(248,113,113,0.45)",
      meta: "text-orange-200",
    },
  };
  const metaStyles = {
    frontend: "text-cyan-200",
    backend: "text-emerald-200",
    "game-dev": "text-purple-200",
    tools: "text-yellow-200",
    "soft-skills": "text-rose-200",
    mathematics: "text-fuchsia-200",
    "computer-science": "text-sky-200",
    "programming-language": "text-indigo-200",
    other: "text-orange-200",
  };
  const selectedStyles = categoryStyles[tagMeta.category] || categoryStyles.other;

  const content = (
    <>
      {showDot ? (
        <span className={`h-2.5 w-2.5 rounded-full ${tagMeta.dotClass}`} aria-hidden="true" />
      ) : null}
      {showEmoji ? <span className="font-medium leading-none">{tagMeta.emoji}</span> : null}
      <span className="font-medium">{tagMeta.label}</span>
      {meta ? (
        <span className={`text-xs ${metaStyles[tagMeta.category] || metaStyles.other}`}>
          {meta}
        </span>
      ) : null}
    </>
  );

  const baseClassName =
    "inline-flex w-fit max-w-max items-center justify-center whitespace-nowrap gap-1 px-2.5 py-1 rounded-full text-sm text-white font-medium leading-none text-center border transform-gpu transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:brightness-110 hover:shadow-[0_0_14px_var(--tag-glow)]";
  const combinedClassName = `${baseClassName} ${className}`.trim();
  const visualStyle = {
    borderColor: selectedStyles.border,
    backgroundImage: `linear-gradient(to right, ${selectedStyles.start}, ${selectedStyles.end})`,
    "--tag-glow": `${selectedStyles.border}80`,
  };

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={combinedClassName}
        style={visualStyle}
      >
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={title}
        className={combinedClassName}
        style={visualStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <span title={title} className={combinedClassName} style={visualStyle}>
      {content}
    </span>
  );
}
