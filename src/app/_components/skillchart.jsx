"use client";

import CircleChart from "./circlechart";
import { useState, useEffect } from "react";

export default function SkillsChart({ activeCategory }) {
  let categories = {
    languages: {
      JavaScript:
        "I use JavaScript for both front end and back end web development. I learned JavaScript from my AP CSP course as well as two different full-stack web development courses on Udemy. I have completed over 100 leetcode problems using JavaSript and use frameworks such as React, Node, Express, and Next with JavaScipt.",
      Java: "Although I haven't created any full-scale projects with Java, I learned Java from my AP CSA course, creating numerous small projects to learn Java and recieved a 5 on the AP Exam, the highest possible score.",
      Python:
        "I have used Python for back end web development as well as data analytics. I learned Python through CS50x, an online course by Harvard University, but I also took a beginner college course on Python at my local University. I recieved over 95% in this course and created many small projects to demonstrate my abilities.",
      C: "I have used C for small projects when large amounts of data or calculations are needed. I learned C from CS50x, an online course by Harvard, and have built on my knowledge of C by expanding to other programming languages.",
      "C#": "I have used C# since the fifth grade to work within Unity3D, an industry use Game Engine. I have main numerous games in Unity using C#, winning two state competitions and placing 7th and 8th place nationally in a game development competition.",
      SQL: "",
      EJS: "",
      Jinja: "",
      HTML: "",
      CSS: "",
    },

    frameworks: {
      ReactJS: "",
      NextJS: "",
      NodeJS: "",
      ExpressJS: "",
      JQuery: "",
      Flask: "",
      Tailwind: "",
    },

    skills: {
      Calculus: "",
      "Lin. Algebra": "",
      Physics: "",
      "Comp. Sci.": "",
      Chemistry: "",
      "Web Dev": "",
      Statistics: "",
      "Data Science": "",
    },
  };

  let [activeSector, setActiveSector] = useState(
    Object.keys(categories[activeCategory])[0]
  );

  let [sectorValue, setValue] = useState(0);

  // Callback function to update the active sector
  const handleSectorClick = (sector) => {
    setActiveSector(sector);
    setValue(Object.keys(categories[activeCategory]).indexOf(sector));
  };

  useEffect(() => {
    setActiveSector(Object.keys(categories[activeCategory])[0]);
    setValue(0);
  }, [activeCategory]);

  return (
    <div className="w-full flex justify-normal flex-col p-0 m-0 h-full">
      <div className="flex sm:flex-row flex-col flex-nowrap justify-between">
        <div className="shrink-0 sm:w-[40vw] w-[80vw] sm:h-[40vw] h-[80vw] flex mx-auto overflow-hidden mt-8">
          <CircleChart
            skills={Object.keys(categories[activeCategory])}
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
            {categories[activeCategory][activeSector]}
          </p>
        </div>
      </div>
    </div>
  );
}
