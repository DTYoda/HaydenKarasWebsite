"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import EditButton from "./editbutton";
import DeleteButton from "./deletebutton";
import AddButton from "./addbutton";

export default function EditableTopSkills() {
  const { isAuthenticated } = useAuth();
  const [topSkills, setTopSkills] = useState([]);
  const [animatedWidths, setAnimatedWidths] = useState({});
  const [loading, setLoading] = useState(true);
  const { openEditModal, handleDelete, EditModalComponent } = useEditable("topskill", () => {
    fetchTopSkills();
  });

  useEffect(() => {
    fetchTopSkills();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timers = topSkills.map((skill, index) => {
        return setTimeout(() => {
          setAnimatedWidths((prev) => ({
            ...prev,
            [skill.name]: skill.proficiency,
          }));
        }, index * 50 + 100);
      });

      return () => timers.forEach((timer) => clearTimeout(timer));
    }
  }, [topSkills, loading]);

  const fetchTopSkills = async () => {
    try {
      const response = await fetch("/api/topskills");
      if (response.ok) {
        const data = await response.json();
        setTopSkills(data.data || []);
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

  const skillFields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "proficiency", label: "Proficiency (%)", type: "number", required: true, min: 0, max: 100 },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: [
        { value: "languages", label: "Languages" },
        { value: "frameworks", label: "Frameworks" },
        { value: "apis", label: "APIs" },
        { value: "tools", label: "Tools" },
      ],
    },
    { name: "order", label: "Order", type: "number", required: false },
  ];

  return (
    <>
      <section className="w-full mb-20 fade-in relative">
        {isAuthenticated && (
          <div className="absolute top-0 right-0 z-10">
            <AddButton
              onClick={() => openEditModal(null, skillFields)}
              label="Add Skill"
            />
          </div>
        )}
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-3"></div>
                <div className="h-2 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : topSkills.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No top skills available. {isAuthenticated && "Add your first skill!"}
          </div>
        ) : (
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
                  key={skill.id || index}
                  className="glass rounded-lg p-4 border border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 relative"
                  style={{
                    animation: `floatIn 0.6s ease-out ${index * 0.05}s both`,
                  }}
                >
                  {isAuthenticated && (
                    <>
                      <EditButton
                        onClick={() => openEditModal(skill, skillFields)}
                        className="absolute top-2 right-2 z-10"
                      />
                      <DeleteButton
                        onClick={() => handleDelete(skill.id)}
                        className="absolute top-2 left-2 z-10"
                      />
                    </>
                  )}
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
                        <span className="text-lg font-bold gradient-text">
                          {skill.proficiency}%
                        </span>
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
        )}
      </section>
      {EditModalComponent}
    </>
  );
}

