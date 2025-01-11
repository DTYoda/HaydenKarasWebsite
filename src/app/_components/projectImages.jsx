"use client";

import { useState } from "react";
import Image from "next/image";
export default function ProjectImages({ images }) {
  let [currentImage, changeCurrentImage] = useState(0);
  return (
    <div className="w-[100vw] md:w-1/2 h-full text-4xl">
      <div className="relative w-full h-full flex justify-center items-center">
        <Image
          width={500}
          height={500}
          src={images[Math.abs(currentImage) % images.length]}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          className="border-orange-500 border-4 rounded-lg"
        />
      </div>
      <div className="flex relative justify-between top-[-55%] px-8">
        <button
          className="hover:underline decoration-orange-500 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-[50%] h-10 w-10"
          onClick={() => {
            changeCurrentImage(currentImage - 1);
          }}
        >
          {"<"}
        </button>
        <button
          className="relative hover:underline decoration-orange-500 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-[50%] h-10 w-10"
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
