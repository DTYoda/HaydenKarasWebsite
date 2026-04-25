"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import AddButton from "./addbutton";
import EditButton from "./editbutton";
import DeleteButton from "./deletebutton";

function asArray(value) {
  if (Array.isArray(value)) return value;
  return [];
}

export default function EducationTimeline({ onMutate }) {
  const { isAuthenticated } = useAuth();
  const [timelineCourses, setTimelineCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchTimelineCourses = async () => {
    try {
      const response = await fetch("/api/educationtimelinehandler");
      if (!response.ok) return;
      const data = await response.json();
      setTimelineCourses(data.data || []);
    } catch (error) {
      console.error("Error loading timeline courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineCourses();
  }, []);

  const afterSave = () => {
    fetchTimelineCourses();
    if (onMutate) onMutate();
  };

  const {
    openEditModal: openTimelineEdit,
    handleDelete: handleTimelineDelete,
    EditModalComponent: TimelineEditModal,
  } = useEditable("educationtimeline", afterSave);

  const timelineFields = [
    { name: "term_label", label: "Term Label", type: "text", required: true },
    { name: "course_name", label: "Course Name", type: "text", required: true },
    { name: "subtitle", label: "Short Subtitle", type: "text", required: false },
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
    { name: "more_info_link", label: "More Info Link", type: "text", required: false },
    {
      name: "more_info_link_text",
      label: "More Info Link Text",
      type: "text",
      required: false,
    },
    { name: "display_order", label: "Display Order", type: "number", required: false },
  ];

  const groupedTimeline = useMemo(() => {
    const grouped = timelineCourses.reduce((acc, course) => {
      const key = course.term_label || "Unlabeled Term";
      if (!acc[key]) acc[key] = [];
      acc[key].push(course);
      return acc;
    }, {});

    return Object.entries(grouped).map(([termLabel, courses]) => {
      const sorted = [...courses].sort((a, b) => {
        const ad = Number(a.display_order || 100);
        const bd = Number(b.display_order || 100);
        if (ad !== bd) return ad - bd;
        return String(a.course_name || "").localeCompare(String(b.course_name || ""));
      });

      return {
        termLabel,
        courses: sorted,
      };
    });
  }, [timelineCourses]);

  if (loading) {
    return <p className="text-center text-gray-400">Loading education timeline...</p>;
  }

  return (
    <>
      {TimelineEditModal}
      <div className="max-w-6xl mx-auto relative">
        {isAuthenticated && (
          <div className="flex justify-end mb-6">
            <AddButton
              onClick={() => openTimelineEdit(null, timelineFields)}
              label="Add Course"
            />
          </div>
        )}

        {groupedTimeline.length === 0 ? (
          <p className="text-center text-gray-400">
            No timeline courses available yet. {isAuthenticated && "Add your first course."}
          </p>
        ) : (
          <div className="relative pl-7 sm:pl-12">
            <div className="absolute left-1 sm:left-3 top-2 bottom-2 w-[2px] bg-gradient-to-b from-orange-400/80 via-orange-500/40 to-transparent" />
            <div className="space-y-8">
              {groupedTimeline.map((termGroup) => (
                <article
                  key={termGroup.termLabel}
                  className="relative rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-500/10 via-black/30 to-black/20 p-5 sm:p-6"
                >
                  <div className="absolute -left-[30px] sm:-left-[38px] top-6 h-4 w-4 rounded-full bg-orange-500 ring-4 ring-orange-500/20 shadow-[0_0_0_6px_rgba(249,115,22,0.12)]" />
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-orange-300 font-semibold">
                      {termGroup.termLabel}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {termGroup.courses.map((course) => (
                      <button
                        key={course.id}
                        type="button"
                        onClick={() => setSelectedCourse(course)}
                        className="group text-left rounded-xl border border-orange-500/20 bg-black/40 p-4 hover:border-orange-400/50 hover:bg-black/60 transition-all duration-300 hover:-translate-y-1 relative"
                      >
                        {isAuthenticated && (
                          <>
                            <EditButton
                              onClick={(event) => {
                                event.stopPropagation();
                                openTimelineEdit(course, timelineFields);
                              }}
                              className="top-2 right-2"
                            />
                            <DeleteButton
                              onClick={(event) => {
                                event.stopPropagation();
                                handleTimelineDelete(course.id, course.course_name);
                              }}
                              className="top-2 left-2"
                            />
                          </>
                        )}
                        <div className="pr-10 pl-10 sm:pl-12">
                          <p className="text-base sm:text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                            {course.course_name}
                          </p>
                          {course.subtitle && (
                            <p className="text-sm text-orange-200/90 mt-1">{course.subtitle}</p>
                          )}
                          {course.mastered_summary && (
                            <p className="text-sm text-orange-300/90 mt-2">
                              {course.mastered_summary}
                            </p>
                          )}
                          <p className="mt-3 text-xs text-gray-400">
                            Click to view full course details
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {selectedCourse && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="glass rounded-2xl border border-orange-500/40 max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-300">
                    {selectedCourse.term_label}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-2">
                    {selectedCourse.course_name}
                  </h3>
                  {selectedCourse.subtitle && (
                    <p className="text-sm sm:text-base text-gray-300 mt-1">
                      {selectedCourse.subtitle}
                    </p>
                  )}
                  {selectedCourse.mastered_summary && (
                    <p className="text-sm text-orange-300 mt-2">
                      {selectedCourse.mastered_summary}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCourse(null)}
                  className="text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <p className="text-sm sm:text-base text-gray-200 mt-6">
                {selectedCourse.description || "No description provided yet."}
              </p>

              {asArray(selectedCourse.topics).length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm uppercase tracking-wider text-orange-300 font-semibold mb-2">
                    Core Topics
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-200">
                    {asArray(selectedCourse.topics).map((topic, index) => (
                      <li key={`${selectedCourse.id}-topic-${index}`}>- {topic}</li>
                    ))}
                  </ul>
                </div>
              )}

              {asArray(selectedCourse.outcomes).length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm uppercase tracking-wider text-orange-300 font-semibold mb-2">
                    Outcomes
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-200">
                    {asArray(selectedCourse.outcomes).map((outcome, index) => (
                      <li key={`${selectedCourse.id}-outcome-${index}`}>- {outcome}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedCourse.more_info_link && (
                <a
                  href={selectedCourse.more_info_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex mt-6 text-sm font-semibold text-orange-400 hover:text-orange-300"
                >
                  {selectedCourse.more_info_link_text || "Learn more"} {"->"}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
