"use client";
import { useState } from "react";
export default function ProjectDescription({ description }) {
  let categories = Object.keys(description);

  let [category, setCategory] = useState(categories[0]);

  return (
    <div className="w-[100vw] md:w-1/2 h-full border-orange-500 border-4 rounded-lg flex flex-col">
      <div className="flex justify-center gap-4 pt-4">
        {categories.map((desc, i) => {
          return (
            <button
              key={i}
              className={
                "hover:underline decoration-orange-500 text-[4vw] md:text-[2vw] " +
                (category == desc ? "underline" : null)
              }
              onClick={() => {
                setCategory(desc);
              }}
            >
              {desc}
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
