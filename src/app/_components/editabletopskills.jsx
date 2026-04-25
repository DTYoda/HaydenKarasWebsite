"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./authprovider";
import EditButton from "./editbutton";
import StandardTag from "./standardtag";
import { useTagUsage } from "./usetagusage";
import TagUsageModal from "./tagusagemodal";
import { buildTagStatChips, getTagMeta, PROJECT_CATEGORY_LABELS } from "@/lib/tags";

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

export default function EditableTopSkills({ initialData }) {
  const { isAuthenticated } = useAuth();
  const [topSkills, setTopSkills] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [skillCount, setSkillCount] = useState(8);
  const [allowedCategories, setAllowedCategories] = useState(categoryOrder);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [draftCount, setDraftCount] = useState(8);
  const [draftCategories, setDraftCategories] = useState(categoryOrder);
  const [selectedTagUsage, setSelectedTagUsage] = useState(null);
  const { getUsage, loadTagUsage } = useTagUsage();

  useEffect(() => {
    const initialize = async () => {
      await fetchSkillSettings();
      if (initialData) setLoading(false);
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  useEffect(() => {
    if (!settingsLoaded) return;
    if (skillCount > 0 && allowedCategories.length > 0) {
      fetchTopSkills(skillCount, allowedCategories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillCount, allowedCategories.join(","), settingsLoaded]);

  const parseCategoriesSetting = (rawValue) => {
    if (!rawValue) return categoryOrder;
    try {
      const parsed = JSON.parse(rawValue);
      if (Array.isArray(parsed)) {
        const normalized = parsed
          .map((value) => String(value || "").trim())
          .filter((value) => categoryOrder.includes(value));
        return normalized.length > 0 ? normalized : categoryOrder;
      }
    } catch {
      // noop
    }

    const split = String(rawValue)
      .split(/[\n,]/)
      .map((value) => value.trim())
      .filter((value) => categoryOrder.includes(value));
    return split.length > 0 ? split : categoryOrder;
  };

  const fetchSkillSettings = async () => {
    try {
      const response = await fetch(
        "/api/pagecontent?page=home&section=top-skills"
      );
      if (response.ok) {
        const data = await response.json();
        const countSetting = data.data?.find(
          (item) => item.key === "top-skills-count"
        );
        const categoriesSetting = data.data?.find(
          (item) => item.key === "top-skills-categories"
        );
        const nextCount = countSetting ? parseInt(countSetting.content) || 8 : 8;
        const nextCategories = parseCategoriesSetting(categoriesSetting?.content);
        if (countSetting) {
          setSkillCount(nextCount);
        }
        setAllowedCategories(nextCategories);
        setDraftCount(nextCount);
        setDraftCategories(nextCategories);
      }
      setSettingsLoaded(true);
    } catch (error) {
      console.error("Error fetching top skill settings:", error);
      setSettingsLoaded(true);
    }
  };

  const fetchTopSkills = async (count = skillCount, categories = allowedCategories) => {
    setLoading(true);
    try {
      const response = await fetch("/api/skillshandler");
      if (response.ok) {
        const data = await response.json();
        // Sort by years experience descending, then name for stable fallback.
        const allSkills = (data.data || []).sort((a, b) => {
          const yearsDiff = (b.years_experience || 0) - (a.years_experience || 0);
          if (yearsDiff !== 0) return yearsDiff;
          return String(a.name || "").localeCompare(String(b.name || ""));
        });
        const filtered = allSkills.filter((skill) => {
          const tagMeta = getTagMeta(skill.name, skill.category);
          return categories.includes(tagMeta.category || "other");
        });
        setTopSkills(filtered.slice(0, count));
      }
    } catch (error) {
      console.error("Error fetching top skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDraftCategory = (category) => {
    setDraftCategories((prev) => {
      if (prev.includes(category)) {
        const next = prev.filter((item) => item !== category);
        return next.length > 0 ? next : prev;
      }
      return [...prev, category];
    });
  };

  const saveSettings = async () => {
    const safeCount = Math.max(1, Math.min(20, Number(draftCount) || 8));
    const safeCategories = draftCategories.length > 0 ? draftCategories : categoryOrder;
    try {
      const payloads = [
        {
          type: "edit",
          key: "top-skills-count",
          page: "home",
          section: "top-skills",
          content: String(safeCount),
          contentType: "number",
        },
        {
          type: "edit",
          key: "top-skills-categories",
          page: "home",
          section: "top-skills",
          content: JSON.stringify(safeCategories),
          contentType: "json",
        },
      ];

      for (const payload of payloads) {
        const response = await fetch("/api/pagecontent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || "Failed to save top skill settings");
        }
      }

      setSkillCount(safeCount);
      setAllowedCategories(safeCategories);
      setIsSettingsOpen(false);
    } catch (error) {
      console.error("Error saving top skill settings:", error);
      alert("Failed to save top skill settings");
    }
  };

  const groupedSkills = topSkills.reduce((acc, skill) => {
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

  return (
    <>
      <section className="w-full mb-20 fade-in relative">
        {selectedTagUsage && (
          <TagUsageModal
            tagUsage={selectedTagUsage}
            onClose={() => setSelectedTagUsage(null)}
          />
        )}
        {isAuthenticated && (
          <div className="absolute top-0 right-0 z-10">
            <EditButton
              onClick={() => {
                setDraftCount(skillCount);
                setDraftCategories(allowedCategories);
                setIsSettingsOpen(true);
              }}
              label="Edit Display Rules"
            />
          </div>
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-700 rounded mb-3"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : topSkills.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            No skills available.{" "}
            {isAuthenticated && "Add skills in the experience section!"}
          </div>
        ) : (
          <div className="space-y-5">
            {categoryOrder
              .filter((category) => (groupedSkills[category] || []).length > 0)
              .map((category) => (
              <div
                key={category}
                className="glass rounded-lg p-4 border border-orange-500/20"
              >
                <h3 className="text-sm uppercase tracking-wider text-orange-300 font-semibold mb-3">
                  {PROJECT_CATEGORY_LABELS[category] || category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(groupedSkills[category] || []).map((skill) => (
                    <div key={skill.id || skill.name} className="flex flex-col gap-1">
                      <StandardTag
                        label={skill.canonicalLabel}
                        category={skill.canonicalCategory}
                        title={skill.top_project_label || skill.description}
                        onClick={async () => {
                          const usage =
                            (await loadTagUsage(skill.canonicalLabel)) ||
                            getUsage(skill.canonicalLabel);
                          if (usage) setSelectedTagUsage(usage);
                        }}
                      />
                      {buildTagStatChips({
                        yearsExperience: skill.years_experience,
                        counts: getUsage(skill.canonicalLabel)?.counts,
                      }).length > 0 ? (
                        <div className="flex flex-wrap gap-1 px-0.5 pt-0.5">
                          {buildTagStatChips({
                            yearsExperience: skill.years_experience,
                            counts: getUsage(skill.canonicalLabel)?.counts,
                          }).map((chip) => (
                            <span
                              key={`${skill.id || skill.name}-${chip}`}
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
        )}
      </section>
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl border border-orange-500/40 p-6 max-w-xl w-full">
            <h3 className="text-2xl font-bold gradient-text mb-4">Top Skills Display Rules</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Number of skills to show</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={draftCount}
                  onChange={(e) => setDraftCount(e.target.value)}
                  className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-2">Allowed categories</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categoryOrder.map((category) => (
                    <label
                      key={category}
                      className="flex items-center gap-2 text-sm text-gray-200 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={draftCategories.includes(category)}
                        onChange={() => toggleDraftCategory(category)}
                        className="accent-orange-500"
                      />
                      <span>{PROJECT_CATEGORY_LABELS[category] || category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={saveSettings}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
