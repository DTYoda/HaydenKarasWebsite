"use client";

import { useState } from "react";
import Image from "next/image";

export default function AnimatedSkillBadge({ skill, index, category }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getTechImage = (name) => {
    const nameMap = {
      "C#": "CSharp",
      "Next.js": "nextjs",
      "Node.js": "NodeJS",
      "Tailwind CSS": "tailwind",
    };
    const imageName = nameMap[name] || name.replace(/[^a-zA-Z0-9]/g, "");
    return `/technologyimages/${imageName}.png`;
  };

  const hasImage = ["C#", "Next.js", "Node.js", "Tailwind CSS", "Unity"].includes(skill.name);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `floatIn 0.6s ease-out ${index * 0.05}s both`,
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`glass rounded-xl p-4 cursor-pointer transition-all duration-300 flex items-center gap-3 w-full text-left ${
          isHovered || isExpanded
            ? "bg-orange-500/20 border-2 border-orange-500 scale-105 shadow-lg shadow-orange-500/20"
            : "border border-gray-700/50 hover:border-orange-500/50 hover:bg-orange-500/10"
        }`}
      >
        {hasImage && (
          <div className="w-10 h-10 flex-shrink-0 relative">
            <Image
              src={getTechImage(skill.name)}
              width={40}
              height={40}
              alt={skill.name}
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        )}
        <div className="flex-1">
          <span className="font-bold text-gray-200 text-base sm:text-lg block">
            {skill.name}
          </span>
          {isExpanded && (
            <p className="text-xs text-gray-400 mt-2 leading-relaxed animate-fadeIn">
              {skill.description}
            </p>
          )}
        </div>
        <div className="text-orange-500 text-xl transition-transform duration-300">
          {isExpanded ? "−" : "+"}
        </div>
      </button>
    </div>
  );
}

