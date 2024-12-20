"use client";

import SkillsChart from "./skillchart";
import { useState } from "react";

export default function SkillsSection({ skills }) {
  let [activeCategory, setActiveCategory] = useState("languages");

  return (
    <div className="min-h-screen w-screen items-center flex flex-col">
      <h1 className="sm:text-[4vw] text-[10vw] p-8 text-center text-7xl uppercase">
        Abilities
      </h1>
      <div className="flex justify-center shrink-0 gap-8 sm:text-3xl text-xl h-14 decoration-orange-500">
        <button
          className={
            "hover:underline decoration-orange-500 " +
            (activeCategory == "languages" ? "underline" : "")
          }
          onClick={() => {
            setActiveCategory("languages");
          }}
        >
          Languages
        </button>
        <button
          className={
            "hover:underline decoration-orange-500 " +
            (activeCategory == "frameworks" ? "underline" : "")
          }
          onClick={() => {
            setActiveCategory("frameworks");
          }}
        >
          Frameworks
        </button>
        <button
          className={
            "hover:underline decoration-orange-500 " +
            (activeCategory == "skills" ? "underline" : "")
          }
          onClick={() => {
            setActiveCategory("skills");
          }}
        >
          Skills
        </button>
      </div>
      <div className="w-[80vw]">
        <SkillsChart activeCategory={activeCategory} skills={skills} />
      </div>
    </div>
  );
}
