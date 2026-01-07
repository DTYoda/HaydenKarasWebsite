"use client";
import { useState } from "react";

export default function ProjectDescription({ description }) {
  const categories = Object.keys(description);
  const [category, setCategory] = useState(categories[0]);

  return (
    <div className="w-full glass rounded-2xl overflow-hidden hover-lift">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-4 border-b border-orange-500/20 bg-orange-500/5 flex-wrap">
        {categories.map((desc, i) => {
          const isActive = category === desc;
          return (
            <button
              key={i}
              className={`relative group px-6 py-3 rounded-lg font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 ${
                isActive
                  ? "text-orange-500 bg-orange-500/20"
                  : "text-gray-400 hover:text-orange-500 hover:bg-orange-500/10"
              }`}
              onClick={() => setCategory(desc)}
            >
              <span className="capitalize relative z-10">{desc}</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transition-all duration-500 rounded ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-8 min-h-[300px] sm:min-h-[400px]">
        <div className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300 prose prose-invert max-w-none">
          {description[category]}
        </div>
      </div>
    </div>
  );
}
