"use client";

import { useMemo, useState } from "react";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import AddButton from "./addbutton";
import EditButton from "./editbutton";
import DeleteButton from "./deletebutton";
import StandardTag from "./standardtag";
import { normalizeTagList } from "@/lib/tags";
import { useTagUsage } from "./usetagusage";
import TagUsageModal from "./tagusagemodal";

function formatEducationDate(item) {
  return item.term_label || "Academic term";
}

function normalizedBulletList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => String(entry).trim()).filter(Boolean).slice(0, 4);
}

function formatCenterLabel(item) {
  // All date context is handled at the shared term marker level.
  return "";
}

function getPreviewSummary(item) {
  const preferred = String(item.masteredSummary || item.summary || "").trim();
  if (!preferred) return "Click to expand for full details.";
  const firstSentence = preferred.match(/.*?[.!?](\s|$)/);
  return (firstSentence ? firstSentence[0] : preferred).trim();
}

export default function MasterTimeline({
  workResearch = [],
  timelineCourses = [],
  tagOptions = [],
  tagCategoryByKey = {},
  loading = false,
  onMutate,
}) {
  const TERM_SEASON_RANK = {
    spring: 1,
    summer: 2,
    fall: 3,
  };

  const getTermSortValue = (label) => {
    const normalized = String(label || "").trim().toLowerCase();
    const match = normalized.match(/^(spring|summer|fall)\s+(\d{4})$/);
    if (!match) return 0;
    const season = match[1];
    const year = Number(match[2]);
    if (!Number.isFinite(year)) return 0;
    return year * 10 + (TERM_SEASON_RANK[season] || 0);
  };

  const { isAuthenticated } = useAuth();
  const [selectedTagUsage, setSelectedTagUsage] = useState(null);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [expandedItemIds, setExpandedItemIds] = useState(() => new Set());
  const [collapsedItemIds, setCollapsedItemIds] = useState(() => new Set());
  const { getUsage, loadTagUsage } = useTagUsage();
  const {
    openEditModal: openWorkResearchEdit,
    handleDelete: handleWorkResearchDelete,
    EditModalComponent: WorkResearchEditModal,
  } = useEditable("workresearch", onMutate);
  const {
    openEditModal: openTimelineEdit,
    handleDelete: handleTimelineDelete,
    EditModalComponent: TimelineEditModal,
  } = useEditable("educationtimeline", onMutate);

  const workResearchFields = [
    { name: "title", label: "Role / Position Title", type: "text", required: true },
    { name: "organization", label: "Organization", type: "text", required: true },
    {
      name: "experience_type",
      label: "Experience Type",
      type: "select",
      required: true,
      options: [
        { value: "work", label: "Work" },
        { value: "research", label: "Research" },
      ],
    },
    { name: "term_label", label: "Term Label (e.g. Fall 2025)", type: "text", required: true },
    {
      name: "summary",
      label: "Summary",
      type: "textarea",
      required: false,
      rows: 4,
    },
    {
      name: "highlights",
      label: "Highlights (one per line)",
      type: "textarea",
      required: false,
      rows: 4,
    },
    {
      name: "tags",
      label: "Tags",
      type: "multiselect",
      required: false,
      options: tagOptions,
    },
    { name: "link", label: "Link", type: "text", required: false },
    { name: "link_text", label: "Link Text", type: "text", required: false },
    { name: "display_order", label: "Display Order", type: "number", required: false },
  ];

  const educationTimelineFields = [
    { name: "term_label", label: "Term Label", type: "text", required: true },
    { name: "course_name", label: "Course Name", type: "text", required: true },
    { name: "subtitle", label: "School / Program", type: "text", required: false },
    {
      name: "mastered_summary",
      label: "Mastered Project/Theory (one line)",
      type: "text",
      required: false,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      rows: 4,
    },
    {
      name: "topics",
      label: "Topics (one per line)",
      type: "textarea",
      required: false,
      rows: 4,
    },
    {
      name: "outcomes",
      label: "Outcomes (one per line)",
      type: "textarea",
      required: false,
      rows: 4,
    },
    {
      name: "tags",
      label: "Tags",
      type: "multiselect",
      required: false,
      options: tagOptions,
    },
    { name: "more_info_link", label: "More Info Link", type: "text", required: false },
    {
      name: "more_info_link_text",
      label: "More Info Link Text",
      type: "text",
      required: false,
    },
    { name: "display_order", label: "Display Order", type: "number", required: false },
  ];

  const timelineItems = useMemo(() => {
    const workItems = workResearch.map((item) => ({
      ...(() => {
        const termLabel = String(item.term_label || "").trim() || "Undated";
        return {
          termLabel,
          termSortDate: getTermSortValue(termLabel),
        };
      })(),
      id: `work-${item.id}`,
      rawId: item.id,
      type: item.type === "research" ? "Research" : "Work",
      sortDate: (() => {
        const termLabel = String(item.term_label || "").trim() || "Undated";
        return getTermSortValue(termLabel);
      })(),
      displayOrder: Number.isFinite(Number(item.display_order)) ? Number(item.display_order) : 100,
      dateLabel: "",
      title: item.title,
      subtitle: item.organization,
      summary: item.summary || "",
      bullets: normalizedBulletList(item.highlights),
      tags: normalizeTagList(item.tags),
      link: item.link || "",
      linkText: item.link_text || "",
      editType: "workresearch",
      source: item,
    }));

    const educationItems = timelineCourses.map((item) => ({
      ...(() => {
        const termLabel = String(item.term_label || "").trim() || "Academic term";
        return {
          termLabel,
          termSortDate: getTermSortValue(termLabel),
        };
      })(),
      id: `edu-${item.id}`,
      rawId: item.id,
      type: "Education",
      sortDate: getTermSortValue(item.term_label),
      displayOrder: Number.isFinite(Number(item.display_order)) ? Number(item.display_order) : 100,
      dateLabel: formatEducationDate(item),
      title: item.course_name,
      subtitle: item.subtitle || "Coursework",
      masteredSummary: item.mastered_summary || "",
      summary: item.description || "",
      bullets: normalizedBulletList(item.outcomes),
      tags: normalizeTagList(item.tags),
      link: item.more_info_link || "",
      linkText: item.more_info_link_text || "",
      editType: "educationtimeline",
      source: item,
    }));

    const sortedItems = [...workItems, ...educationItems].sort((a, b) => {
      // Always keep newest items first, regardless of type.
      const dateDelta = (b.sortDate || 0) - (a.sortDate || 0);
      if (dateDelta !== 0) return dateDelta;

      // If dates are equal/missing, use explicit display order.
      const orderDelta = (a.displayOrder || 100) - (b.displayOrder || 100);
      if (orderDelta !== 0) return orderDelta;

      // Final stable tie-breaker for deterministic rendering.
      return String(a.title || "").localeCompare(String(b.title || ""));
    });

    let previousTerm = "";
    return sortedItems.map((item) => {
      const currentTerm = item.termLabel || "Academic term";
      const showTermMarker = currentTerm !== previousTerm;
      if (showTermMarker) previousTerm = currentTerm;

      return {
        ...item,
        showTermMarker,
        termMarkerText: currentTerm,
      };
    });
  }, [workResearch, timelineCourses]);

  const timelineSections = useMemo(() => {
    const sections = [];
    timelineItems.forEach((item) => {
      const termLabel = item.termMarkerText || item.termLabel || "Academic term";
      const lastSection = sections[sections.length - 1];
      if (!lastSection || lastSection.termLabel !== termLabel) {
        sections.push({
          termLabel,
          items: [item],
        });
        return;
      }
      lastSection.items.push(item);
    });
    return sections;
  }, [timelineItems]);

  const openWorkEditor = (item) => {
    if (!item) {
      openWorkResearchEdit(null, workResearchFields);
      return;
    }
    openWorkResearchEdit(
      {
        ...item,
        experience_type: item.type || "work",
        highlights: Array.isArray(item.highlights) ? item.highlights.join("\n") : "",
        tags: Array.isArray(item.tag_ids)
          ? item.tag_ids
          : Array.isArray(item.tags)
          ? item.tags
          : [],
      },
      workResearchFields
    );
  };

  const openEducationEditor = (item) => {
    if (!item) {
      openTimelineEdit(null, educationTimelineFields);
      return;
    }
    openTimelineEdit(
      {
        ...item,
        topics: Array.isArray(item.topics) ? item.topics.join("\n") : "",
        outcomes: Array.isArray(item.outcomes) ? item.outcomes.join("\n") : "",
        tags: Array.isArray(item.tag_ids)
          ? item.tag_ids
          : Array.isArray(item.tags)
          ? item.tags
          : [],
      },
      educationTimelineFields
    );
  };

  if (loading) {
    return <p className="text-center text-gray-400">Loading timeline...</p>;
  }

  const toggleItemExpansion = (itemId) => {
    if (isAllExpanded) {
      setCollapsedItemIds((prev) => {
        const next = new Set(prev);
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        return next;
      });
      return;
    }

    setExpandedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const toggleExpandAll = () => {
    setIsAllExpanded((prev) => !prev);
    setExpandedItemIds(new Set());
    setCollapsedItemIds(new Set());
  };

  return (
    <>
      {selectedTagUsage && (
        <TagUsageModal tagUsage={selectedTagUsage} onClose={() => setSelectedTagUsage(null)} />
      )}
      {WorkResearchEditModal}
      {TimelineEditModal}

      <div className="flex flex-wrap justify-end gap-3 mb-6">
        <button
          type="button"
          onClick={toggleExpandAll}
          className="rounded-lg border border-orange-500/45 bg-orange-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-orange-200 transition-all duration-200 hover:bg-orange-500/20"
        >
          {isAllExpanded ? "Collapse All" : "Expand All"}
        </button>
        {isAuthenticated && (
          <>
          <AddButton onClick={() => openWorkEditor(null)} label="Add Work/Research" />
          <AddButton onClick={() => openEducationEditor(null)} label="Add Education" />
          </>
        )}
      </div>

      {timelineItems.length === 0 ? (
        <p className="text-center text-gray-400">
          No timeline entries yet. {isAuthenticated && "Add your first entry."}
        </p>
      ) : (
        <div className="relative max-w-6xl mx-auto">
          <div className="absolute left-1/2 top-2 bottom-2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-orange-400/80 via-orange-500/30 to-transparent" />
          <div className="space-y-10">
            {timelineSections.map((section) => (
              <section key={section.termLabel} className="relative">
                <div className="sticky top-24 z-20 flex justify-center mb-4">
                  <span className="rounded-full border border-orange-500/70 bg-black/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-200 shadow-[0_0_0_1px_rgba(249,115,22,0.2)]">
                    {section.termLabel}
                  </span>
                </div>
                <div className="space-y-8">
                  {section.items.map((item) => {
              const onEdit = () =>
                item.editType === "workresearch"
                  ? openWorkEditor(item.source)
                  : openEducationEditor(item.source);
              const onDelete = () =>
                item.editType === "workresearch"
                  ? handleWorkResearchDelete(item.rawId, item.title)
                  : handleTimelineDelete(item.rawId, item.title);
              const isExpanded = isAllExpanded
                ? !collapsedItemIds.has(item.id)
                : expandedItemIds.has(item.id);
              const previewSummary = getPreviewSummary(item);

              return (
                <div key={item.id} className="relative">
                  <article
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleItemExpansion(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleItemExpansion(item.id);
                      }
                    }}
                    className="relative grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] gap-4 items-start cursor-pointer"
                  >
                    <div
                      className={`glass rounded-xl border-2 p-4 sm:p-5 md:text-right ${
                        item.type === "Education"
                          ? "border-orange-400/75 shadow-[0_0_0_1px_rgba(251,146,60,0.15)]"
                          : item.type === "Research"
                          ? "border-cyan-300/75 shadow-[0_0_0_1px_rgba(103,232,249,0.16)]"
                          : "border-blue-300/75 shadow-[0_0_0_1px_rgba(147,197,253,0.16)]"
                      }`}
                    >
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider mb-3 ${
                          item.type === "Education"
                            ? "border-orange-500/50 bg-orange-500/10 text-orange-200"
                            : item.type === "Research"
                            ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-200"
                            : "border-blue-400/60 bg-blue-500/15 text-blue-200"
                        }`}
                      >
                        {item.type}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-100">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-300 mt-1">{item.subtitle}</p>
                      {isExpanded && item.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 md:justify-end">
                          {item.tags.map((tag, index) => (
                            <StandardTag
                              key={`${item.id}-tag-${index}`}
                              label={tag}
                              category={tagCategoryByKey[String(tag || "").trim().toLowerCase()] || "other"}
                              title={`${item.title} tag`}
                              onClick={async (event) => {
                                event.stopPropagation();
                                const usage = (await loadTagUsage(tag)) || getUsage(tag);
                                if (usage) setSelectedTagUsage(usage);
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative hidden md:flex justify-center">
                      <div className="h-4 w-4 rounded-full bg-orange-500 ring-4 ring-orange-500/20 mt-5" />
                      {formatCenterLabel(item) && (
                        <div className="absolute top-11 left-1/2 -translate-x-1/2">
                          <span className="rounded-full border border-orange-500/60 bg-black/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-orange-200 whitespace-nowrap">
                            {formatCenterLabel(item)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className={`glass rounded-xl border-2 bg-black/35 p-5 sm:p-6 relative ${
                        item.type === "Education"
                          ? "border-orange-400/75 shadow-[0_0_0_1px_rgba(251,146,60,0.15)]"
                          : item.type === "Research"
                          ? "border-cyan-300/75 shadow-[0_0_0_1px_rgba(103,232,249,0.16)]"
                          : "border-blue-300/75 shadow-[0_0_0_1px_rgba(147,197,253,0.16)]"
                      }`}
                    >
                      {isAuthenticated && (
                        <>
                          <EditButton
                            onClick={(event) => {
                              event.stopPropagation();
                              onEdit();
                            }}
                            className="top-2 right-2"
                          />
                          <DeleteButton
                            onClick={(event) => {
                              event.stopPropagation();
                              onDelete();
                            }}
                            className="top-2 left-2"
                          />
                        </>
                      )}
                      <div className="pr-8 pl-8 sm:pl-10">
                        {!isExpanded ? (
                          <p className="text-sm text-gray-300">{previewSummary}</p>
                        ) : (
                          <>
                            {item.masteredSummary && (
                              <p className="text-sm text-orange-200">{item.masteredSummary}</p>
                            )}
                            {item.summary && (
                              <p className="text-sm text-gray-300 mt-3">{item.summary}</p>
                            )}
                            {item.bullets.length > 0 && (
                              <ul className="mt-3 space-y-1 text-sm text-gray-200">
                                {item.bullets.map((bullet, index) => (
                                  <li key={`${item.id}-${index}`}>- {bullet}</li>
                                ))}
                              </ul>
                            )}
                            {item.link && (
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(event) => event.stopPropagation()}
                                className="inline-flex mt-3 text-sm font-semibold text-orange-400 hover:text-orange-300"
                              >
                                {item.linkText || "Learn more"} {"->"}
                              </a>
                            )}
                          </>
                        )}
                        <p className="mt-3 text-[11px] uppercase tracking-wider text-gray-500">
                          {isExpanded ? "Click to collapse" : "Click to expand"}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
