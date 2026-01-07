"use client";

import SkillsChart from "./skillchart";
import { useState } from "react";

export default function SkillsSection({ skills }) {
  let [activeCategory, setActiveCategory] = useState("languages");

  return (
    <section className="min-h-screen w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
      <div className="text-center mb-16 fade-in">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 uppercase tracking-wider">
          <span className="gradient-text">Abilities</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-400 font-light">
          Skills & Technologies
        </p>
        <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
      </div>
      <div className="flex justify-center shrink-0 gap-2 sm:gap-4 md:gap-8 mb-8 sm:mb-12">
        {["languages", "frameworks", "skills"].map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              className={`relative group px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg md:text-xl lg:text-2xl transition-all duration-300 ${
                isActive
                  ? "text-orange-500 bg-orange-500/10"
                  : "text-gray-400 hover:text-orange-500 hover:bg-orange-500/5"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              <span className="capitalize relative z-10">{category}</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transition-all duration-500 rounded ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </button>
          );
        })}
      </div>
      <div className="w-full max-w-6xl fade-in">
        <SkillsChart activeCategory={activeCategory} skills={skills} />
      </div>
    </section>
  );
}
