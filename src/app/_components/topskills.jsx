"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StandardTag from "./standardtag";
import { useTagUsage } from "./usetagusage";
import TagUsageModal from "./tagusagemodal";
import { buildTagSummary, getTagMeta, PROJECT_CATEGORY_LABELS } from "@/lib/tags";

const categoryOrder = [
  "programming-language",
  "frontend",
  "backend",
  "game-dev",
  "tools",
  "soft-skills",
  "mathematics",
  "computer-science",
  "other",
];

export default function TopSkills({ skills = [] }) {
  const [liveSkills, setLiveSkills] = useState(skills);
  const [selectedTagUsage, setSelectedTagUsage] = useState(null);
  const { getUsage, loadTagUsage } = useTagUsage();

  useEffect(() => {
    const fetchTopSkills = async () => {
      try {
        const response = await fetch("/api/topskills");
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          setLiveSkills(data.data);
        }
      } catch (error) {
        console.error("Error fetching top skills:", error);
      }
    };

    fetchTopSkills();
  }, []);

  const groupedSkills = useMemo(() => {
    return liveSkills.reduce((acc, skill) => {
      const tagMeta = getTagMeta(skill.name, skill.category);
      const key = tagMeta.category || "other";
      if (!acc[key]) acc[key] = [];
      acc[key].push({
        ...skill,
        canonicalLabel: tagMeta.label,
        canonicalCategory: key,
      });
      return acc;
    }, {});
  }, [liveSkills]);

  const sortedCategories = categoryOrder
    .filter((category) => (groupedSkills[category] || []).length > 0)
    .map((category) => [category, groupedSkills[category]]);

  if (sortedCategories.length === 0) {
    return null;
  };

  return (
    <section className="w-full mb-20 fade-in">
      {selectedTagUsage && (
        <TagUsageModal
          tagUsage={selectedTagUsage}
          onClose={() => setSelectedTagUsage(null)}
        />
      )}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            <span className="gradient-text">Top Skills</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Fast snapshot of my production stack
          </p>
        </div>
        <Link
          href="/experience#skills"
          className="px-6 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift whitespace-nowrap"
        >
          View All Skills →
        </Link>
      </div>

      <div className="space-y-5">
        {sortedCategories.map(([category, categorySkills]) => (
          <div
            key={category}
            className="glass rounded-lg p-4 border border-orange-500/20"
          >
            <h3 className="text-sm uppercase tracking-wider text-orange-300 font-semibold mb-3">
              {PROJECT_CATEGORY_LABELS[category] || category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <div key={skill.id || skill.name} className="flex flex-col gap-1">
                  <StandardTag
                    label={skill.canonicalLabel}
                    category={skill.canonicalCategory}
                    meta={
                      skill.years_experience !== null &&
                      skill.years_experience !== undefined
                        ? `${skill.years_experience}y`
                        : ""
                    }
                    title={skill.top_project_label || ""}
                    onClick={async () => {
                      const usage =
                        (await loadTagUsage(skill.canonicalLabel)) ||
                        getUsage(skill.canonicalLabel);
                      if (usage) setSelectedTagUsage(usage);
                    }}
                  />
                  {buildTagSummary({
                    yearsExperience: skill.years_experience,
                    counts: getUsage(skill.canonicalLabel)?.counts,
                  }) ? (
                    <span className="text-[11px] text-gray-500 px-1">
                      {buildTagSummary({
                        yearsExperience: skill.years_experience,
                        counts: getUsage(skill.canonicalLabel)?.counts,
                      })}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
