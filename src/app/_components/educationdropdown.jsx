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
    <div className="transition-all rounded-md">
      <button
        className={
          "max-w-5xl w-screen h-16 bg-gray-800 flex justify-between px-8 items-center " +
          (isActive ? "rounded-t-lg" : "rounded-lg")
        }
        onClick={() => {
          isActive ? onClick("") : onClick(title);
        }}
      >
        <p className="text-left">{title}</p>
        <p>^</p>
      </button>
      <div
        className={
          "rounded-b-lg transition-all max-w-5xl w-screen bg-gray-900 " +
          (isActive ? "h-56 p-8" : "h-0")
        }
      >
        <p className={isActive ? "" : "hidden"}>{desc}</p>
        <Link
          href={to}
          className={"text-white underline " + (isActive ? "" : "hidden")}
          rel="noopener noreferrer" target="_blank"
        >
          {linkName}
        </Link>
      </div>
    </div>
  );
}
