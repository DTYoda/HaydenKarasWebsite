'use client'

import SkillsChart from "./skillchart"
import { useState } from "react"

export default function SkillsSection() {

    let [activeCategory, setActiveCategory] = useState("languages");

    return (<div className="min-h-screen w-screen items-center flex flex-col">
        <div className="flex justify-center shrink-0 gap-8 sm:text-3xl text-xl h-14">
          <button  className={"hover:underline " + (activeCategory == "languages" ? "underline" : "")} onClick={() => {setActiveCategory("languages")}}>Languages</button>
          <button className={"hover:underline " + (activeCategory == "frameworks" ? "underline" : "")}  onClick={() => {setActiveCategory("frameworks")}}>Frameworks</button>
          <button className={"hover:underline " + (activeCategory == "skills" ? "underline" : "")}  onClick={() => {setActiveCategory("skills")}}>Skills</button>
        </div>
        <div className="w-[80vw]">
            <SkillsChart activeCategory={activeCategory}/>
        </div>
      </div>)
}