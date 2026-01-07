"use client";

import { useState } from "react";

export default function AnimatedEducationCard({ item, index }) {
  const [isHovered, setIsHovered] = useState(false);

  const categoryIcons = {
    coursework: "📚",
    certifications: "🏆",
    courses: "💻",
    awards: "⭐",
  };

  return (
    <div
      className="glass rounded-xl p-6 hover-lift cursor-pointer transition-all duration-300 relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `slideUp 0.6s ease-out ${index * 0.08}s both`,
      }}
    >
      {/* Animated gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-orange-500/30 via-orange-500/10 to-transparent transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">{categoryIcons[item.category] || "📄"}</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold gradient-text mb-2 line-clamp-2">
              {item.name}
            </h3>
            <p
              className={`text-xs text-gray-400 leading-relaxed transition-all duration-500 ${
                isHovered ? "max-h-96 opacity-100" : "max-h-16 overflow-hidden opacity-70"
              }`}
            >
              {item.description}
            </p>
          </div>
        </div>
        {item.link && item.linkText && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-orange-500 text-xs font-semibold mt-3 inline-flex items-center gap-2 transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2"
            }`}
          >
            {item.linkText} →
          </a>
        )}
      </div>

      {/* Shine effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-1000 ${
          isHovered ? "translate-x-full" : ""
        }`}
        style={{ transform: isHovered ? "translateX(100%)" : "translateX(-100%)" }}
      />
    </div>
  );
}

