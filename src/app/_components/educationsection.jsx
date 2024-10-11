"use client";
import { useState } from "react";
import DropDown from "./educationdropdown";

export default function EducationSection({ education }) {
  let [currentCategory, setCategory] = useState("coursework");
  let categories = ["coursework", "certifications", "courses", "awards"];

  let [currentIndex, setIndex] = useState("");

  return (
    <div className="h-screen w-screen flex flex-col">
      <h1 className="sm:text-[4vw] text-[10vw] p-8 text-center text-7xl uppercase">
        EDUCATION
      </h1>
      <div className="flex justify-center flex-wrap shrink-0 gap-8 sm:text-3xl text-xl h-14">
        {categories.map((category, i) => (
          <button
            key={i}
            className={
              "hover:underline " +
              (currentCategory == category ? "underline" : "")
            }
            onClick={() => {
              setCategory(category);
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center grow">
        {education
          .filter((e) => e.category == currentCategory)
          .map((index, i) => {
            return (
              <div className="py-4" key={i}>
                <DropDown
                  title={index["name"]}
                  desc={index["description"]}
                  onClick={setIndex}
                  currentActive={currentIndex}
                  to={index["link"]}
                  linkName={index["linkText"]}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
