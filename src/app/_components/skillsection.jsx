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
          className={" group"}
          onClick={() => {
            setActiveCategory("languages");
          }}
        >
          Languages
          <span
            class={
              "block group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500 " +
              (activeCategory == "languages" ? "max-w-full" : "max-w-0")
            }
          ></span>
        </button>
        <button
          className={"group"}
          onClick={() => {
            setActiveCategory("frameworks");
          }}
        >
          Frameworks
          <span
            class={
              "block group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500 " +
              (activeCategory == "frameworks" ? "max-w-full" : "max-w-0")
            }
          ></span>
        </button>
        <button
          className={" group"}
          onClick={() => {
            setActiveCategory("skills");
          }}
        >
          Skills
          <span
            class={
              "block group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500 " +
              (activeCategory == "skills" ? "max-w-full" : "max-w-0")
            }
          ></span>
        </button>
      </div>
      <div className="w-[80vw]">
        <SkillsChart activeCategory={activeCategory} skills={skills} />
      </div>
    </div>
  );
}
