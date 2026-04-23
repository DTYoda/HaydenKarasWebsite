"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import EditButton from "./editbutton";

export default function EditableTopSkills({ initialData }) {
  const { isAuthenticated } = useAuth();
  const [topSkills, setTopSkills] = useState(initialData || []);
  const [animatedWidths, setAnimatedWidths] = useState({});
  const [loading, setLoading] = useState(!initialData);
  const [skillCount, setSkillCount] = useState(8); // Default to 8 skills
  const { openEditModal, EditModalComponent } = useEditable(
    "pagecontent",
    () => {
      fetchSkillCount();
      fetchTopSkills();
    }
  );

  useEffect(() => {
    // Only fetch if initialData wasn't provided
    if (!initialData) {
      const initialize = async () => {
        await fetchSkillCount();
        // fetchTopSkills will be called when skillCount is set
      };
      initialize();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch skills when skillCount is available (after initial load or when changed)
    if (skillCount > 0) {
      fetchTopSkills(skillCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillCount]);

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

  const fetchSkillCount = async () => {
    try {
      const response = await fetch(
        "/api/pagecontent?page=home&section=top-skills"
      );
      if (response.ok) {
        const data = await response.json();
        const countSetting = data.data?.find(
          (item) => item.key === "top-skills-count"
        );
        if (countSetting) {
          setSkillCount(parseInt(countSetting.content) || 8);
        }
      }
    } catch (error) {
      console.error("Error fetching skill count:", error);
    }
  };

  const fetchTopSkills = async (count = skillCount) => {
    setLoading(true);
    try {
      const response = await fetch("/api/skillshandler");
      if (response.ok) {
        const data = await response.json();
        // Sort by proficiency descending and take first N
        const allSkills = (data.data || []).sort(
          (a, b) => (b.proficiency || 0) - (a.proficiency || 0)
        );
        setTopSkills(allSkills.slice(0, count));
      }
    } catch (error) {
      console.error("Error fetching top skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCount = () => {
    const countFields = [
      {
        name: "content",
        label: "Number of Skills to Show",
        type: "number",
        required: true,
        min: 1,
        max: 20,
      },
    ];
    openEditModal(
      {
        key: "top-skills-count",
        page: "home",
        section: "top-skills",
        content: skillCount.toString(),
        type: "number",
      },
      countFields
    );
  };

  return (
    <>
      <section className="w-full mb-20 fade-in relative">
        {isAuthenticated && (
          <div className="absolute top-0 right-0 z-10">
            <EditButton onClick={handleEditCount} label="Edit Count" />
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
            No skills available.{" "}
            {isAuthenticated && "Add skills in the experience section!"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topSkills.map((skill, index) => {
              const width = animatedWidths[skill.name] || 0;

              return (
                <div
                  key={skill.id || index}
                  className="glass rounded-lg p-4 border border-orange-500/30 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 relative animate-float-in"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
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
        )}
      </section>
      {EditModalComponent}
    </>
  );
}
