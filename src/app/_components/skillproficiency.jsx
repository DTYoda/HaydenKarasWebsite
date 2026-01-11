"use client";

import { useState, useEffect } from "react";

export default function SkillProficiency({ skill, index, category }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedWidth, setAnimatedWidth] = useState(0);

  // Use proficiency from database if available, otherwise default to 80
  const proficiency = skill.proficiency || 80;
  const proficiencyLabel =
    proficiency >= 90
      ? "Expert"
      : proficiency >= 75
      ? "Advanced"
      : proficiency >= 60
      ? "Intermediate"
      : "Beginner";

  useEffect(() => {
    // Animate the progress bar on mount - more subtle animation
    const timer = setTimeout(() => {
      setAnimatedWidth(proficiency);
    }, index * 30 + 100);
    return () => clearTimeout(timer);
  }, [proficiency, index]);

  return (
    <div
      className="relative group h-fit"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `floatIn 0.6s ease-out ${index * 0.05}s both`,
      }}
    >
      <div
        className={`glass rounded-lg p-4 cursor-pointer transition-all duration-300 w-full ${
          isHovered || isExpanded
            ? "bg-orange-500/20 border-2 border-orange-500 scale-105 shadow-lg shadow-orange-500/20"
            : "border border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/10"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Compact Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-base text-gray-200 truncate">
                {skill.name}
              </h3>
              <div className="text-lg font-bold gradient-text flex-shrink-0">
                {proficiency}%
              </div>
            </div>
            <p className="text-xs text-orange-400/80 mt-0.5">
              {proficiencyLabel}
            </p>
          </div>
        </div>

        {/* Orange Proficiency Bar - Clear and Visible */}
        <div className="mb-3">
          <div className="w-full h-4 bg-gray-800/90 border-2 border-orange-500/50 rounded-full overflow-hidden shadow-lg shadow-orange-500/20 relative">
            {/* Progress fill - solid orange */}
            <div
              className="h-full bg-orange-500 transition-all duration-700 ease-in-out relative"
              style={{ width: `${animatedWidth}%` }}
            >
              {/* Bright end indicator with glow */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-orange-300 rounded-full shadow-orange-300/80 shadow-[0_0_8px_4px_rgba(252,165,165,0.5)]"></div>
            </div>
          </div>
        </div>

        {/* Expandable Description */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-orange-500/30 animate-fadeIn">
            <p className="text-sm text-gray-400 leading-relaxed">
              {skill.description}
            </p>
          </div>
        )}

        {/* Compact expand indicator */}
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
