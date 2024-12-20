"use client";

import { useState } from "react";
export default function ProjectImages() {

    let [currentImage, changeCurrentImage] = useState("images", 0);

    return <div className="w-[100vw] md:w-1/2 h-full border-orange-500 border-4 flex items-center justify-between p-8 text-4xl rounded-lg">
        <button className="hover:underline decoration-orange-500" onClick={() => {
        changeCurrentImage(currentImage - 1);
    }}>{"<"}</button>
        <button className="hover:underline decoration-orange-500" onClick={() => {
        changeCurrentImage(currentImage - 1);
    }}>{">"}</button>
    </div>
};