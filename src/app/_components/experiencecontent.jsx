"use client";

import { useState, useEffect, useMemo } from "react";
import MasterTimeline from "./mastertimeline";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import AddButton from "./addbutton";
import TagUsageModal from "./tagusagemodal";
import { useTagUsage } from "./usetagusage";
import StandardTag from "./standardtag";
import {
  getTagMeta,
  getTotalAppearances,
  PROJECT_CATEGORY_LABELS,
} from "@/lib/tags";

export default function ExperienceContent() {
  const { isAuthenticated } = useAuth();
  const [activeSkillType, setActiveSkillType] = useState("technical");
  const [skills, setSkills] = useState([]);
  const [workResearch, setWorkResearch] = useState([]);
  const [timelineCourses, setTimelineCourses] = useState([]);
  const [loadingSkillsEducation, setLoadingSkillsEducation] = useState(true);
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [selectedTagUsage, setSelectedTagUsage] = useState(null);
  const { getUsage, loadTagUsage } = useTagUsage();

  const buildExperienceStatChips = (yearsExperience, counts) => {
    const chips = [];
    const years = Number(yearsExperience);
    if (Number.isFinite(years) && years > 0) {
      chips.push(`${years}y`);
    }

    const projects = Number(counts?.projects || 0);
    if (projects > 0) {
      chips.push(`${projects} proj`);
    }

    const courses = Number(counts?.coursework || 0);
    if (courses > 0) {
      chips.push(`${courses} courses`);
    }

    return chips;
  };

  const fetchData = async () => {
    try {
      const [skillsRes, workResearchRes, timelineRes] = await Promise.all([
        fetch("/api/skillshandler"),
        fetch("/api/workresearchhandler"),
        fetch("/api/educationtimelinehandler"),
      ]);

      if (skillsRes.ok) {
        const data = await skillsRes.json();
        setSkills(data.data || []);
      }
      if (workResearchRes.ok) {
        const data = await workResearchRes.json();
        setWorkResearch(data.data || []);
      }
      if (timelineRes.ok) {
        const data = await timelineRes.json();
        setTimelineCourses(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingSkillsEducation(false);
      setLoadingTimeline(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    openEditModal: openSkillEdit,
    handleDelete: handleSkillDelete,
    EditModalComponent: SkillEditModal,
  } = useEditable("skill", fetchData);

  const technicalCategoryOrder = [
    "programming-language",
    "frontend",
    "backend",
    "game-dev",
    "tools",
    "other",
  ];
  const coreCategoryOrder = ["soft-skills", "mathematics", "computer-science", "other"];

  const skillFields = [
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: [
        { value: "programming-language", label: "Programming Language" },
        { value: "frontend", label: "Frontend" },
        { value: "backend", label: "Backend" },
        { value: "game-dev", label: "Game Development" },
        { value: "tools", label: "Tools & DevOps" },
        { value: "soft-skills", label: "Soft Skills" },
        { value: "mathematics", label: "Mathematics" },
        { value: "computer-science", label: "Computer Science" },
        { value: "other", label: "Other" },
      ],
    },
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: false,
    },
    {
      name: "years_experience",
      label: "Years of Experience",
      type: "number",
      required: false,
      min: 0,
      max: 50,
    },
    { name: "top_project_label", label: "Top Project Label", type: "text", required: false },
    { name: "top_project_link", label: "Top Project Link", type: "text", required: false },
  ];

  const skillsByCategory = useMemo(() => {
    const grouped = { technical: {}, core: {} };
    skills.forEach((skill) => {
      const tagMeta = getTagMeta(skill.name, skill.category);
      const usage = getUsage(tagMeta.label);
      const totalAppearances = getTotalAppearances(usage);
      const category = tagMeta.category || "other";
      const skillType = ["soft-skills", "mathematics", "computer-science"].includes(category)
        ? "core"
        : "technical";
      if (!grouped[skillType][category]) grouped[skillType][category] = [];
      grouped[skillType][category].push({
        skill,
        displayLabel: tagMeta.label,
        usage,
        totalAppearances,
        statChips: buildExperienceStatChips(skill.years_experience, usage?.counts),
        category,
      });
    });

    ["technical", "core"].forEach((type) => {
      Object.keys(grouped[type]).forEach((category) => {
        grouped[type][category].sort((a, b) => {
        if (b.totalAppearances !== a.totalAppearances) {
          return b.totalAppearances - a.totalAppearances;
        }
        return a.displayLabel.localeCompare(b.displayLabel);
      });
      });
    });

    return grouped;
  }, [skills, getUsage]);

  const tagOptions = useMemo(() => {
    return (skills || [])
      .map((skill) => ({
        value: String(skill.id || "").trim(),
        label: String(skill.name || "").trim(),
      }))
      .filter((option) => option.value && option.label)
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [skills]);

  const tagCategoryByKey = useMemo(() => {
    return (skills || []).reduce((acc, skill) => {
      const key = String(skill.name || "").trim().toLowerCase();
      if (!key) return acc;
      acc[key] = String(skill.category || "other");
      return acc;
    }, {});
  }, [skills]);

  if (loadingSkillsEducation) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {SkillEditModal}
      {selectedTagUsage && (
        <TagUsageModal
          tagUsage={selectedTagUsage}
          onClose={() => setSelectedTagUsage(null)}
        />
      )}
      {/* Skills Section */}
      <section
        id="skills"
        className="w-full max-w-7xl mx-auto px-6 py-16 sm:py-20 min-h-[1vh] relative scroll-mt-24"
      >
        {isAuthenticated && (
          <div className="absolute top-6 right-6 z-10">
            <AddButton
              onClick={() => openSkillEdit(null, skillFields)}
              label="Add Skill"
            />
          </div>
        )}
        <div className="text-center mb-10 sm:mb-12 fade-in">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 uppercase tracking-wider">
            <span className="gradient-text">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
        </div>

        <div className="max-w-6xl mx-auto mb-6 flex justify-center gap-3">
          {[
            { id: "technical", label: "Technical" },
            { id: "core", label: "Core" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveSkillType(option.id)}
              className={`px-5 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 ${
                activeSkillType === option.id
                  ? "bg-orange-500/90 text-white"
                  : "glass text-gray-400 hover:text-orange-500 hover:bg-orange-500/10"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="max-w-6xl mx-auto space-y-5">
          {(activeSkillType === "technical" ? technicalCategoryOrder : coreCategoryOrder)
            .filter((category) => (skillsByCategory[activeSkillType]?.[category] || []).length > 0)
            .map((category) => (
              <div
                key={category}
                className="glass rounded-lg p-4 border border-orange-500/20"
              >
                <h3 className="text-sm uppercase tracking-wider text-orange-300 font-semibold mb-3">
                  {PROJECT_CATEGORY_LABELS[category] || category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(skillsByCategory[activeSkillType]?.[category] || []).map((entry) => (
                    <div
                      key={entry.skill.id || entry.displayLabel}
                      className="relative rounded-md border border-white/5 bg-black/20 px-2 py-2"
                    >
                      {isAuthenticated && (
                        <div className="flex gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() => openSkillEdit(entry.skill, skillFields)}
                            className="text-[11px] px-2 py-1 rounded border border-orange-500/30 text-orange-300 hover:border-orange-400/70"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSkillDelete(entry.skill.id, entry.skill.name)}
                            className="text-[11px] px-2 py-1 rounded border border-red-500/30 text-red-300 hover:border-red-400/70"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                      <StandardTag
                        label={entry.displayLabel}
                        category={entry.category}
                        onClick={async () => {
                          const usage =
                            (await loadTagUsage(entry.displayLabel)) ||
                            getUsage(entry.displayLabel);
                          if (usage) setSelectedTagUsage(usage);
                        }}
                      />
                      {entry.statChips?.length ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {entry.statChips.map((chip) => (
                            <span
                              key={`${entry.skill.id || entry.displayLabel}-${chip}`}
                              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-300"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Unified Master Timeline Section */}
      <section
        id="master-timeline"
        className="w-full max-w-7xl mx-auto px-6 py-16 sm:py-20 relative scroll-mt-24"
      >
        <div className="text-center mb-10 sm:mb-12 fade-in">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 uppercase tracking-wider">
            <span className="gradient-text">Master Timeline</span>
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
        </div>
        <MasterTimeline
          workResearch={workResearch}
          timelineCourses={timelineCourses}
          tagOptions={tagOptions}
          tagCategoryByKey={tagCategoryByKey}
          loading={loadingTimeline}
          onMutate={fetchData}
        />
      </section>
    </>
  );
}
