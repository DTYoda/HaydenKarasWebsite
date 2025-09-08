"use client";
import { useState } from "react";
export default function ProjectDescription({ description }) {
  let categories = Object.keys(description);

  let [category, setCategory] = useState(categories[0]);

  return (
    <div className="w-[100vw] md:w-1/2 h-full rounded-lg flex flex-col">
      <div className="flex justify-evenly gap-4 pt-4">
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
      <div className="p-4 text-[3vw] md:text-[1.5vw]">
        {description[category]}
      </div>
    </div>
  );
}
