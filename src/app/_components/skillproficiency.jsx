"use client";

import { useState } from "react";
import StandardTag from "./standardtag";
import { buildTagStatChips } from "@/lib/tags";

function getUsageChips(usage) {
  return buildTagStatChips({
    yearsExperience: null,
    counts: usage?.counts,
  });
}

export default function SkillProficiency({ skill, index, usage, onTagClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const hasProject = Boolean(skill.top_project_label);

  return (
    <div
      className="relative group h-fit animate-float-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 0.04}s`,
      }}
    >
      <div
        className={`glass rounded-lg p-4 cursor-pointer transition-all duration-300 w-full ${
          isHovered || isExpanded
            ? "bg-orange-500/15 border-orange-400/60 shadow-lg shadow-orange-500/20"
            : "border border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/10"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <StandardTag
              label={skill.name}
              meta={
                skill.years_experience !== null &&
                skill.years_experience !== undefined
                  ? `${skill.years_experience}y`
                  : ""
              }
              title={skill.description}
              onClick={(event) => {
                event.stopPropagation();
                if (onTagClick) onTagClick(skill.name);
              }}
            />
          </div>
          {hasProject ? (
            <StandardTag
              label={skill.top_project_label}
              href={skill.top_project_link || ""}
              title={skill.top_project_link || skill.top_project_label}
            />
          ) : null}
        </div>

        {getUsageChips(usage).length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1">
            {getUsageChips(usage).map((chip) => (
              <span
                key={`${skill.name}-${chip}`}
                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-300"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}

        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-orange-500/30 animate-fadeIn">
            <p className="text-sm text-gray-400 leading-relaxed">
              {skill.description}
            </p>
            {hasProject && skill.top_project_link && (
              <a
                href={skill.top_project_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs font-semibold text-orange-400 hover:text-orange-300"
              >
                View project {"->"}
              </a>
            )}
          </div>
        )}

        {!isExpanded && (
          <div className="flex justify-end mt-2">
            <span className="text-orange-500/70 text-xs">
              Click for details
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
