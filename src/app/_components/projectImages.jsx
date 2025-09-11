"use client";

import { useState } from "react";
import Image from "next/image";
export default function ProjectImages({ images }) {
  let [currentImage, changeCurrentImage] = useState(0);
  return (
    <div className="w-[100vw] md:w-[80%] h-full text-4xl flex justify-center flex-col">
      <div className="flex justify-center items-center h-[75vw] md:h-[50vw] xl:h-[40vw]">
        <Image
          width={500}
          height={500}
          src={images[Math.abs(currentImage) % images.length]}
          sizes="100vw"
          style={{ width: "auto", height: "100%" }}
          className="shadow-xl shadow-gray-600 hover:scale-[1.02] transition-all rounded-xl border-[1px] border-gray-600"
        />
      </div>
      <div className="flex relative justify-evenly px-8">
        <button
          className="hover:underline hover:scale-[1.2] animate-all decoration-orange-500 shadow-lg flex justify-center items-center border-gray-600 border bg-[rgba(25,25,25,0.5)] rounded-[50%] h-10 w-10 md:h-20 md:w-20"
          onClick={() => {
            changeCurrentImage(currentImage - 1);
          }}
        >
          {"<"}
        </button>
        <button
          className="relative hover:underline hover:scale-[1.2] animate-all decoration-orange-500 flex justify-center items-center border-gray-600 border bg-[rgba(25,25,25,0.5)] rounded-[50%] h-10 w-10 md:h-20 md:w-20"
          onClick={() => {
            changeCurrentImage(currentImage + 1);
          }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
