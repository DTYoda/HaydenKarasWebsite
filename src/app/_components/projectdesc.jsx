"use client";
import { useState } from "react";
export default function ProjectDescription({ description }) {
  let categories = Object.keys(description);

  let [category, setCategory] = useState(categories[0]);

  return (
    <div className="w-[100vw] md:w-[75vw] xl:w-[50vw] h-fill rounded-lg flex flex-col p-0">
      <div className="flex gap-4 p-4">
        {categories.map((desc, i) => {
          return (
            <button
              key={i}
              className={"group  text-[4vw] md:text-[2vw] "}
              onClick={() => {
                setCategory(desc);
              }}
            >
              {desc}
              <span
                class={
                  "block group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500 " +
                  (category == desc ? "max-w-full" : "max-w-0")
                }
              ></span>
            </button>
          );
        })}
      </div>
      <div className="p-0 text-[3vw] md:text-[1.5vw] h-[50vw] md:h-[30vw] xl:h-[25vw]">
        {description[category]}
      </div>
    </div>
  );
}
