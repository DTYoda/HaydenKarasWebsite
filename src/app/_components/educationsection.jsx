"use client";
import { useState } from "react";
import DropDown from "./educationdropdown";

export default function EducationSection({ education }) {
  let [currentCategory, setCategory] = useState("coursework");
  let categories = ["coursework", "certifications", "courses", "awards"];

  let [currentIndex, setIndex] = useState("");

  return (
    <section className="min-h-screen w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
      <div className="text-center mb-16 fade-in">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 uppercase tracking-wider">
          <span className="gradient-text">Education</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-400 font-light">
          Learning & Achievements
        </p>
        <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
      </div>
      <div className="flex justify-center flex-wrap shrink-0 gap-2 sm:gap-4 md:gap-8 mb-8 sm:mb-12">
        {categories.map((category, i) => {
          const isActive = currentCategory === category;
          return (
            <button
              key={i}
              className={`relative group px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg md:text-xl lg:text-2xl transition-all duration-300 capitalize ${
                isActive
                  ? "text-orange-500 bg-orange-500/10"
                  : "text-gray-400 hover:text-orange-500 hover:bg-orange-500/5"
              }`}
              onClick={() => setCategory(category)}
            >
              <span className="relative z-10">{category}</span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 transition-all duration-500 rounded ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col items-center w-full max-w-4xl gap-4">
        {education
          .filter((e) => e.category == currentCategory)
          .map((index, i) => {
            return (
              <div
                className="w-full fade-in"
                key={i}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
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
    </section>
  );
}
