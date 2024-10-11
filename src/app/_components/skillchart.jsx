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
    <div className="w-full flex justify-normal flex-col p-0 m-0 h-full">
      <div className="flex sm:flex-row flex-col flex-nowrap justify-between">
        <div className="shrink-0 sm:w-[40vw] w-[80vw] sm:h-[40vw] h-[80vw] flex mx-auto overflow-hidden mt-8">
          <CircleChart
            skills={skills
              .filter((element) => element.category == activeCategory)
              .map((element) => element.name)}
            handleClick={handleSectorClick}
            sectorValue={sectorValue}
            currentCategory={activeCategory}
          />
        </div>
        <div className="w-full sm:w-1/2 shrink grow">
          <h3 className="p-4 sm:text-[3.5vw] text-[6vw] font-bold">
            {activeSector}
          </h3>
          <p className="sm:text-[2vw] text-[4vw] w-full p-4 leading-loose">
            {skills.find((element) => element.name == activeSector).description}
          </p>
        </div>
      </div>
    </div>
  );
}
