"use client";

import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import AddButton from "./addbutton";
import EditButton from "./editbutton";
import DeleteButton from "./deletebutton";

function formatDateRange(startDate, endDate, isCurrent) {
  if (!startDate && !endDate) return "Dates unavailable";

  const formatOne = (value) =>
    new Date(value).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

  const start = startDate ? formatOne(startDate) : "Start";
  const end = isCurrent ? "Present" : endDate ? formatOne(endDate) : "Present";
  return `${start} - ${end}`;
}

function WorkResearchCard({ item, isAuthenticated, onEdit, onDelete }) {
  return (
    <article className="glass rounded-xl p-5 sm:p-6 hover-lift relative">
      {isAuthenticated && (
        <>
          <EditButton onClick={() => onEdit(item)} className="top-2 right-2" />
          <DeleteButton
            onClick={() => onDelete(item.id, item.title)}
            className="top-2 left-2"
          />
        </>
      )}
      <p className="text-xs uppercase tracking-wider text-orange-400 font-semibold mb-2">
        {formatDateRange(item.start_date, item.end_date, item.is_current)}
      </p>
      <h4 className="text-lg sm:text-xl font-bold pr-10 pl-10 sm:pl-12">{item.title}</h4>
      <p className="text-sm text-gray-300 mt-1">{item.organization}</p>
      {item.summary && <p className="text-sm text-gray-300 mt-4">{item.summary}</p>}
      {Array.isArray(item.highlights) && item.highlights.length > 0 && (
        <ul className="mt-4 space-y-2">
          {item.highlights.slice(0, 4).map((highlight, index) => (
            <li key={`${item.id}-${index}`} className="text-sm text-gray-200">
              - {highlight}
            </li>
          ))}
        </ul>
      )}
      {item.link && item.link_text && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex mt-4 text-sm font-semibold text-orange-400 hover:text-orange-300"
        >
          {item.link_text} {"->"}
        </a>
      )}
    </article>
  );
}

export default function WorkResearchExperience({
  experiences = [],
  loading,
  onMutate,
}) {
  const normalizedExperiences = experiences.map((item) => ({
    ...item,
    type: String(item.type || "work").toLowerCase(),
  }));

  const { isAuthenticated } = useAuth();
  const {
    openEditModal: openWorkResearchEdit,
    handleDelete: handleWorkResearchDelete,
    EditModalComponent: WorkResearchEditModal,
  } = useEditable("workresearch", onMutate);

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
    { name: "start_date", label: "Start Date", type: "date", required: false },
    { name: "end_date", label: "End Date", type: "date", required: false },
    {
      name: "is_current",
      label: "Current Role (true/false)",
      type: "select",
      required: false,
      options: [
        { value: "false", label: "No" },
        { value: "true", label: "Yes" },
      ],
    },
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
    { name: "link", label: "Link", type: "text", required: false },
    { name: "link_text", label: "Link Text", type: "text", required: false },
    { name: "display_order", label: "Display Order", type: "number", required: false },
  ];

  const openEditor = (item) => {
    if (!item) {
      openWorkResearchEdit(null, workResearchFields);
      return;
    }

    openWorkResearchEdit(
      {
        ...item,
        experience_type: item.type || "work",
        is_current: item.is_current ? "true" : "false",
        highlights: Array.isArray(item.highlights)
          ? item.highlights.join("\n")
          : item.highlights || "",
      },
      workResearchFields
    );
  };

  const work = normalizedExperiences.filter((item) => item.type === "work");
  const research = normalizedExperiences.filter((item) => item.type === "research");

  if (loading) {
    return <p className="text-center text-gray-400">Loading work and research...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {WorkResearchEditModal}
      {isAuthenticated && (
        <div className="flex justify-end">
          <AddButton onClick={() => openEditor(null)} label="Add Work/Research" />
        </div>
      )}
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-5">Work Experience</h3>
        {work.length === 0 ? (
          <p className="text-gray-400">No work experience entries yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {work.map((item) => (
              <WorkResearchCard
                key={item.id}
                item={item}
                isAuthenticated={isAuthenticated}
                onEdit={openEditor}
                onDelete={handleWorkResearchDelete}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-2xl sm:text-3xl font-bold mb-5">Research Experience</h3>
        {research.length === 0 ? (
          <p className="text-gray-400">No research experience entries yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {research.map((item) => (
              <WorkResearchCard
                key={item.id}
                item={item}
                isAuthenticated={isAuthenticated}
                onEdit={openEditor}
                onDelete={handleWorkResearchDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
