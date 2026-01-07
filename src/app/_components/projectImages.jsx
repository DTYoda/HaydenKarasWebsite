"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProjectImages({ images }) {
  const [currentImage, changeCurrentImage] = useState(0);
  const currentIndex = Math.abs(currentImage) % images.length;

  const goToPrevious = () => {
    changeCurrentImage(currentImage - 1);
  };

  const goToNext = () => {
    changeCurrentImage(currentImage + 1);
  };

  return (
    <div className="w-full flex justify-center flex-col">
      {/* Main Image Display */}
      <div className="relative flex justify-center items-center mb-6 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-300"></div>
        <div className="relative glass rounded-2xl p-2 sm:p-4 overflow-hidden w-full">
          <div className="flex justify-center items-center h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] max-h-[800px]">
            <Image
              width={1200}
              height={800}
              src={images[currentIndex]}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              alt={`Project screenshot ${currentIndex + 1}`}
              className="object-contain rounded-lg transition-all duration-500 hover:scale-[1.02] w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center items-center gap-8">
        <button
          className="glass hover:bg-orange-500/20 hover:border-orange-500/50 border border-orange-500/20 rounded-full h-12 w-12 md:h-16 md:w-16 flex justify-center items-center text-orange-500 text-2xl md:text-3xl font-bold transition-all duration-300 hover-lift hover:scale-110"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          {"<"}
        </button>
        
        {/* Image Counter */}
        <div className="mono text-gray-400 text-sm md:text-base">
          {currentIndex + 1} / {images.length}
        </div>

        <button
          className="glass hover:bg-orange-500/20 hover:border-orange-500/50 border border-orange-500/20 rounded-full h-12 w-12 md:h-16 md:w-16 flex justify-center items-center text-orange-500 text-2xl md:text-3xl font-bold transition-all duration-300 hover-lift hover:scale-110"
          onClick={goToNext}
          aria-label="Next image"
        >
          {">"}
        </button>
      </div>

      {/* Thumbnail Navigation (optional, for many images) */}
      {images.length > 1 && images.length <= 8 && (
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => changeCurrentImage(index)}
              className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${
                index === currentIndex
                  ? "border-orange-500 scale-110"
                  : "border-orange-500/30 opacity-60 hover:opacity-100"
              }`}
              style={{ width: "80px", height: "60px" }}
            >
              <Image
                src={img}
                width={80}
                height={60}
                alt={`Thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
