"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const fallbackTopSkills = [
  { name: "JavaScript", proficiency: 95, category: "languages" },
  { name: "C#", proficiency: 95, category: "languages" },
  { name: "Unity", proficiency: 95, category: "frameworks" },
  { name: "Git/GitHub", proficiency: 95, category: "tools" },
  { name: "Python", proficiency: 90, category: "languages" },
  { name: "React", proficiency: 90, category: "frameworks" },
  { name: "REST APIs", proficiency: 90, category: "apis" },
  { name: "Tailwind CSS", proficiency: 92, category: "frameworks" },
];

export default function TopSkills() {
  const [topSkills, setTopSkills] = useState(fallbackTopSkills);
  const [animatedWidths, setAnimatedWidths] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSkills();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timers = topSkills.map((skill, index) => {
        return setTimeout(
          () => {
            setAnimatedWidths((prev) => ({
              ...prev,
              [skill.name]: skill.proficiency,
            }));
          },
          index * 50 + 100,
        );
      });

      return () => timers.forEach((timer) => clearTimeout(timer));
    }
  }, [topSkills, loading]);

  const fetchTopSkills = async () => {
    try {
      const response = await fetch("/api/topskills");
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setTopSkills(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching top skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTechImage = (name) => {
    const nameMap = {
      "C#": "CSharp",
      "Next.js": "nextjs",
      "Node.js": "NodeJS",
      "Tailwind CSS": "tailwind",
    };
    const imageName = nameMap[name] || name.replace(/[^a-zA-Z0-9]/g, "");
    return `/technologyimages/${imageName}.png`;
  };

  return (
    <section className="w-full mb-20 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            <span className="gradient-text">Top Skills</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Technologies I'm most proficient in
          </p>
        </div>
        <Link
          href="/experience#skills"
          className="px-6 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift whitespace-nowrap"
        >
          View All Skills →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topSkills.map((skill, index) => {
          const width = animatedWidths[skill.name] || 0;
          const hasTechImage = [
            "C#",
            "Next.js",
            "Node.js",
            "Tailwind CSS",
            "Unity",
          ].includes(skill.name);

          return (
            <div
              key={index}
              className="glass rounded-lg p-4 border border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300"
              style={{
                animation: `floatIn 0.6s ease-out ${index * 0.05}s both`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                {hasTechImage && (
                  <div className="w-10 h-10 flex-shrink-0 relative">
                    <Image
                      src={getTechImage(skill.name)}
                      width={40}
                      height={40}
                      alt={skill.name}
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-200">
                      {skill.name}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="w-full h-3 bg-gray-800/80 border border-orange-500/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-700 ease-in-out relative"
                  style={{ width: `${width}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-orange-300 rounded-full shadow-orange-300/80 shadow-[0_0_4px_2px_rgba(252,165,165,0.5)]"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
