"use client";

import CircleChart from "./circlechart";
import { useState, useEffect } from "react";

export default function SkillsChart({ activeCategory, skills }) {
  let first = skills.find((element) => element.category == activeCategory).name;

  let [activeSector, setActiveSector] = useState(first);

  let [sectorValue, setValue] = useState(0);

  // Callback function to update the active sector
  const handleSectorClick = (sector) => {
    setActiveSector(sector);
    setValue(
      skills
        .filter((element) => element.category == activeCategory)
        .map((element) => element.name)
        .indexOf(sector)
    );
  };

  useEffect(() => {
    setActiveSector(
      skills
        .filter((element) => element.category == activeCategory)
        .map((element) => element.name)[0]
    );
    setValue(0);
  }, [activeCategory]);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
      {/* Circle Chart */}
      <div className="w-full max-w-[500px] sm:max-w-[600px] aspect-square flex-shrink-0 fade-in mx-auto">
        <CircleChart
          skills={skills
            .filter((element) => element.category == activeCategory)
            .map((element) => element.name)}
          handleClick={handleSectorClick}
          sectorValue={sectorValue}
          currentCategory={activeCategory}
        />
      </div>
      
      {/* Description Panel */}
      <div className="w-full lg:w-1/2 flex flex-col glass rounded-2xl p-6 sm:p-8 hover-lift min-h-[300px]">
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 gradient-text">
          {activeSector}
        </h3>
        <div className="w-16 h-1 bg-orange-500 mb-6"></div>
        <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300">
          {skills.find((element) => element.name == activeSector)?.description || "No description available."}
        </p>
      </div>
    </div>
  );
}
