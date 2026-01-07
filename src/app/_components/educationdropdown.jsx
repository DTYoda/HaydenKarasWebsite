"use client";

import { useState } from "react";
import Link from "next/link";

export default function DropDown({
  title,
  desc,
  to,
  linkName,
  onClick,
  currentActive,
}) {
  let isActive = currentActive == title;

  return (
    <div className="transition-all rounded-lg overflow-hidden glass hover-lift">
      <button
        className={
          "w-full h-16 hover:bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 flex justify-between px-6 items-center transition-all duration-300 " +
          (isActive
            ? "bg-orange-500/10 border-orange-500/50"
            : "bg-transparent")
        }
        onClick={() => {
          isActive ? onClick("") : onClick(title);
        }}
      >
        <p className="text-left font-semibold text-lg text-gray-200">{title}</p>
        <p
          className={`text-orange-500 text-xl transition-transform duration-300 ${
            isActive ? "rotate-180" : ""
          }`}
        >
          ˅
        </p>
      </button>
      <div
        className={
          "transition-all duration-300 overflow-hidden " +
          (isActive ? "max-h-96 p-6" : "max-h-0 p-0")
        }
      >
        <p
          className={`text-gray-300 leading-relaxed mb-4 ${
            isActive ? "block" : "hidden"
          }`}
        >
          {desc}
        </p>
        {linkName && (
          <Link
            href={to}
            className={`text-orange-500 hover:text-orange-400 font-semibold underline transition-colors duration-300 ${
              isActive ? "block" : "hidden"
            }`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {linkName} →
          </Link>
        )}
      </div>
    </div>
  );
}
