"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditModal from "./editmodal";
import EditButton from "./editbutton";
import DeleteButton from "./deletebutton";
import AddButton from "./addbutton";
import Navigation from "./navigation";
import QuickStats from "./quickstats";
import LatestProjects from "./latestprojects";
import TopSkills from "./topskills";
import AboutPreview from "./aboutpreview";
import ContactPreview from "./contactpreview";
import ExperienceContent from "./experiencecontent";
import WhoAmI from "./whoami";
import Background from "./background";
import PortfolioSectionClient from "./portfoliosectionclient";

export default function AdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [quickStats, setQuickStats] = useState([]);
  const [staticContent, setStaticContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    type: null,
    data: null,
    fields: [],
  });
  const [migrating, setMigrating] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [
        projectsRes,
        skillsRes,
        educationRes,
        topSkillsRes,
        quickStatsRes,
        staticContentRes,
      ] = await Promise.all([
        fetch("/api/projectshandler").catch(() => ({ ok: false })),
        fetch("/api/skillshandler").catch(() => ({ ok: false })),
        fetch("/api/educationhandler").catch(() => ({ ok: false })),
        fetch("/api/topskills").catch(() => ({ ok: false })),
        fetch("/api/quickstats").catch(() => ({ ok: false })),
        fetch("/api/staticcontent").catch(() => ({ ok: false })),
      ]);

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.data || []);
      }
      if (skillsRes.ok) {
        const data = await skillsRes.json();
        setSkills(data.data || []);
      }
      if (educationRes.ok) {
        const data = await educationRes.json();
        setEducation(data.data || []);
      }
      if (topSkillsRes.ok) {
        const data = await topSkillsRes.json();
        setTopSkills(data.data || []);
      }
      if (quickStatsRes.ok) {
        const data = await quickStatsRes.json();
        setQuickStats(data.data || []);
      }
      if (staticContentRes.ok) {
        const data = await staticContentRes.json();
        setStaticContent(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      let endpoint = "";
      let payload = { ...data };

      switch (editModal.type) {
        case "project":
          endpoint = "/api/projectshandler";
          payload.type = editModal.data ? "edit" : "new";
          if (payload.type === "edit") payload.id = editModal.data.id;
          break;
        case "skill":
          endpoint = "/api/skillshandler";
          payload.type = editModal.data ? "edit" : "new";
          if (payload.type === "edit") {
            payload.oldName = editModal.data.name;
            payload.id = editModal.data.id;
          }
          break;
        case "education":
          endpoint = "/api/educationhandler";
          payload.type = editModal.data ? "edit" : "new";
          if (payload.type === "edit") {
            payload.oldName = editModal.data.name;
            payload.id = editModal.data.id;
          }
          break;
        case "topskill":
          endpoint = "/api/topskills";
          payload.type = editModal.data ? "edit" : "new";
          if (payload.type === "edit") payload.id = editModal.data.id;
          break;
        case "quickstat":
          endpoint = "/api/quickstats";
          payload.type = editModal.data ? "edit" : "new";
          if (payload.type === "edit") payload.id = editModal.data.id;
          break;
        case "static":
          endpoint = "/api/staticcontent";
          payload.type = editModal.data ? "edit" : "new";
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setEditModal({ isOpen: false, type: null, data: null, fields: [] });
        await fetchAllData();
        router.refresh();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to save"}`);
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving data");
    }
  };

  const handleDelete = async (type, id, name) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      let endpoint = "";
      let payload = { type: "delete" };

      switch (type) {
        case "project":
          endpoint = "/api/projectshandler";
          payload.id = id;
          break;
        case "skill":
          endpoint = "/api/skillshandler";
          payload.name = name;
          break;
        case "education":
          endpoint = "/api/educationhandler";
          payload.name = name;
          break;
        case "topskill":
          endpoint = "/api/topskills";
          payload.id = id;
          break;
        case "quickstat":
          endpoint = "/api/quickstats";
          payload.id = id;
          break;
        case "static":
          endpoint = "/api/staticcontent";
          payload.key = id;
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchAllData();
        router.refresh();
      } else {
        alert("Error deleting data");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting data");
    }
  };

  const handleMigrateImages = async () => {
    if (
      !confirm(
        "This will migrate all project images from the public folder to Supabase Storage. Continue?"
      )
    ) {
      return;
    }

    setMigrating(true);
    setMigrationStatus(null);

    try {
      const response = await fetch("/api/migrate-images", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMigrationStatus({
          success: true,
          message: data.message,
          results: data.results,
        });
        // Refresh projects to show updated images
        await fetchAllData();
        router.refresh();
      } else {
        setMigrationStatus({
          success: false,
          message: data.message || "Migration failed",
        });
      }
    } catch (error) {
      console.error("Migration error:", error);
      setMigrationStatus({
        success: false,
        message: error.message || "Error during migration",
      });
    } finally {
      setMigrating(false);
    }
  };

  const checkMigrationStatus = async () => {
    try {
      const response = await fetch("/api/migrate-images");
      const data = await response.json();

      if (response.ok) {
        setMigrationStatus({
          success: true,
          needsMigration: data.needsMigration,
          alreadyMigrated: data.alreadyMigrated,
          projects: data.projects,
        });
      }
    } catch (error) {
      console.error("Error checking migration status:", error);
    }
  };

  useEffect(() => {
    checkMigrationStatus();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold gradient-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="animated-gradient min-h-screen">
      <Navigation />
      <div className="w-full max-w-7xl mx-auto px-6 py-20">
        {/* Migration Tool */}
        <div className="mb-12 glass rounded-2xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-orange-500 mb-2">
                Image Migration Tool
              </h2>
              <p className="text-gray-400 text-sm">
                Migrate project images from the public folder to Supabase
                Storage
              </p>
            </div>
            <button
              onClick={handleMigrateImages}
              disabled={migrating}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              {migrating ? "Migrating..." : "Migrate Images"}
            </button>
          </div>

          {migrationStatus && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                migrationStatus.success &&
                (!migrationStatus.results ||
                  !migrationStatus.results.projects?.errors?.length)
                  ? "bg-green-500/20 border border-green-500/50"
                  : "bg-yellow-500/20 border border-yellow-500/50"
              }`}
            >
              {migrationStatus.needsMigration !== undefined ? (
                <div>
                  <p className="text-gray-200 font-semibold mb-2">
                    Migration Status:
                  </p>
                  <p className="text-gray-300 text-sm">
                    Projects needing migration:{" "}
                    <span className="font-bold">
                      {migrationStatus.needsMigration}
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm">
                    Projects already migrated:{" "}
                    <span className="font-bold">
                      {migrationStatus.alreadyMigrated}
                    </span>
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-200 font-semibold mb-2">
                    {migrationStatus.message}
                  </p>
                  {migrationStatus.results && (
                    <div className="text-sm text-gray-300 mt-2">
                      <p>
                        Projects processed:{" "}
                        {migrationStatus.results.projects.processed}
                      </p>
                      <p>
                        Projects updated:{" "}
                        {migrationStatus.results.projects.updated}
                      </p>
                      {migrationStatus.results.projects.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-yellow-400 font-semibold">
                            Errors:
                          </p>
                          <ul className="list-disc list-inside text-yellow-300">
                            {migrationStatus.results.projects.errors
                              .slice(0, 5)
                              .map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                          </ul>
                          {migrationStatus.results.projects.errors.length >
                            5 && (
                            <p className="text-yellow-300">
                              ... and{" "}
                              {migrationStatus.results.projects.errors.length -
                                5}{" "}
                              more
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Migration Tool */}
        <div className="mb-12 glass rounded-2xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-orange-500 mb-2">
                Image Migration Tool
              </h2>
              <p className="text-gray-400 text-sm">
                Migrate project images from the public folder to Supabase
                Storage
              </p>
            </div>
            <button
              onClick={handleMigrateImages}
              disabled={migrating}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              {migrating ? "Migrating..." : "Migrate Images"}
            </button>
          </div>

          {migrationStatus && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                migrationStatus.success &&
                !migrationStatus.results?.projects?.errors?.length
                  ? "bg-green-500/20 border border-green-500/50"
                  : "bg-yellow-500/20 border border-yellow-500/50"
              }`}
            >
              {migrationStatus.needsMigration !== undefined ? (
                <div>
                  <p className="text-gray-200 font-semibold mb-2">
                    Migration Status:
                  </p>
                  <p className="text-gray-300 text-sm">
                    Projects needing migration:{" "}
                    <span className="font-bold">
                      {migrationStatus.needsMigration}
                    </span>
                  </p>
                  <p className="text-gray-300 text-sm">
                    Projects already migrated:{" "}
                    <span className="font-bold">
                      {migrationStatus.alreadyMigrated}
                    </span>
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-200 font-semibold mb-2">
                    {migrationStatus.message}
                  </p>
                  {migrationStatus.results && (
                    <div className="text-sm text-gray-300 mt-2">
                      <p>
                        Projects processed:{" "}
                        {migrationStatus.results.projects.processed}
                      </p>
                      <p>
                        Projects updated:{" "}
                        {migrationStatus.results.projects.updated}
                      </p>
                      {migrationStatus.results.projects.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-yellow-400 font-semibold">
                            Errors:
                          </p>
                          <ul className="list-disc list-inside text-yellow-300">
                            {migrationStatus.results.projects.errors
                              .slice(0, 5)
                              .map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                          </ul>
                          {migrationStatus.results.projects.errors.length >
                            5 && (
                            <p className="text-yellow-300">
                              ... and{" "}
                              {migrationStatus.results.projects.errors.length -
                                5}{" "}
                              more
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 uppercase tracking-wider">
            <span className="gradient-text">Admin Dashboard</span>
          </h1>
          <p className="text-xl text-gray-400">
            Edit all content on your website
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
        </div>

        {/* Home Page Preview */}
        <section className="mb-20 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text">Home Page</h2>
          </div>

          {/* Quick Stats Section */}
          <div className="mb-12 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-gray-300">
                Quick Stats
              </h3>
              <AddButton
                onClick={() =>
                  setEditModal({
                    isOpen: true,
                    type: "quickstat",
                    data: null,
                    fields: [
                      {
                        name: "value",
                        label: "Value",
                        type: "text",
                        required: true,
                      },
                      {
                        name: "label",
                        label: "Label",
                        type: "text",
                        required: true,
                      },
                      {
                        name: "sublabel",
                        label: "Sublabel",
                        type: "text",
                        required: true,
                      },
                      {
                        name: "order",
                        label: "Order",
                        type: "number",
                        required: false,
                      },
                    ],
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat) => (
                <div
                  key={stat.id}
                  className="glass rounded-xl p-6 text-center hover-lift relative"
                >
                  <DeleteButton
                    onClick={() => handleDelete("quickstat", stat.id)}
                  />
                  <EditButton
                    onClick={() =>
                      setEditModal({
                        isOpen: true,
                        type: "quickstat",
                        data: stat,
                        fields: [
                          {
                            name: "value",
                            label: "Value",
                            type: "text",
                            required: true,
                          },
                          {
                            name: "label",
                            label: "Label",
                            type: "text",
                            required: true,
                          },
                          {
                            name: "sublabel",
                            label: "Sublabel",
                            type: "text",
                            required: true,
                          },
                          {
                            name: "order",
                            label: "Order",
                            type: "number",
                            required: false,
                          },
                        ],
                      })
                    }
                  />
                  <div className="text-3xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-300">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stat.sublabel}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Projects Section */}
          <div className="mb-12 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-gray-300">
                Latest Projects
              </h3>
              <AddButton
                onClick={() =>
                  setEditModal({
                    isOpen: true,
                    type: "project",
                    data: null,
                    fields: [
                      {
                        name: "urlTitle",
                        label: "URL Title",
                        type: "text",
                        required: true,
                      },
                      {
                        name: "title",
                        label: "Title",
                        type: "text",
                        required: true,
                      },
                      {
                        name: "descriptions",
                        label: "Description",
                        type: "textarea",
                        required: true,
                      },
                      {
                        name: "images",
                        label: "Images (JSON array)",
                        type: "textarea",
                        required: true,
                      },
                      {
                        name: "links",
                        label: "Links (JSON array)",
                        type: "textarea",
                        required: false,
                      },
                      {
                        name: "technologies",
                        label: "Technologies (JSON array)",
                        type: "textarea",
                        required: false,
                      },
                      {
                        name: "projectType",
                        label: "Type",
                        type: "text",
                        required: false,
                      },
                      {
                        name: "date",
                        label: "Date",
                        type: "text",
                        required: false,
                      },
                    ],
                  })
                }
              />
            </div>
            {projects.length > 0 && <LatestProjects projects={projects} />}
            <div className="mt-4 space-y-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="glass rounded-lg p-4 flex items-center justify-between relative"
                >
                  <DeleteButton
                    onClick={() => handleDelete("project", project.id)}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-200">{project.title}</h4>
                    <p className="text-sm text-gray-400">
                      {project.type} - {project.date}
                    </p>
                  </div>
                  <EditButton
                    onClick={() =>
                      setEditModal({
                        isOpen: true,
                        type: "project",
                        data: project,
                        fields: [
                          {
                            name: "urlTitle",
                            label: "URL Title",
                            type: "text",
                            required: true,
                          },
                          {
                            name: "title",
                            label: "Title",
                            type: "text",
                            required: true,
                          },
                          {
                            name: "descriptions",
                            label: "Description",
                            type: "textarea",
                            required: true,
                          },
                          {
                            name: "images",
                            label: "Images (JSON array)",
                            type: "textarea",
                            required: true,
                          },
                          {
                            name: "links",
                            label: "Links (JSON array)",
                            type: "textarea",
                            required: false,
                          },
                          {
                            name: "technologies",
                            label: "Technologies (JSON array)",
                            type: "textarea",
                            required: false,
                          },
                          {
                            name: "projectType",
                            label: "Type",
                            type: "text",
                            required: false,
                          },
                          {
                            name: "date",
                            label: "Date",
                            type: "text",
                            required: false,
                          },
                        ],
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Top Skills Section */}
          <div className="mb-12 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-gray-300">
                Top Skills
              </h3>
              <AddButton
                onClick={() =>
                  setEditModal({
                    isOpen: true,
                    type: "topskill",
                    data: null,
                    fields: [
                      {
                        name: "name",
                        label: "Name",
                        type: "text",
                        required: true,
                      },
                      {
                        name: "proficiency",
                        label: "Proficiency (%)",
                        type: "number",
                        required: true,
                        min: 0,
                        max: 100,
                      },
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
                      {
                        name: "order",
                        label: "Order",
                        type: "number",
                        required: false,
                      },
                    ],
                  })
                }
              />
            </div>
            <TopSkills />
            <div className="mt-4 space-y-2">
              {topSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="glass rounded-lg p-4 flex items-center justify-between relative"
                >
                  <DeleteButton
                    onClick={() => handleDelete("topskill", skill.id)}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-200">{skill.name}</h4>
                    <p className="text-sm text-gray-400">
                      {skill.proficiency}% - {skill.category}
                    </p>
                  </div>
                  <EditButton
                    onClick={() =>
                      setEditModal({
                        isOpen: true,
                        type: "topskill",
                        data: skill,
                        fields: [
                          {
                            name: "name",
                            label: "Name",
                            type: "text",
                            required: true,
                          },
                          {
                            name: "proficiency",
                            label: "Proficiency (%)",
                            type: "number",
                            required: true,
                            min: 0,
                            max: 100,
                          },
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
                          {
                            name: "order",
                            label: "Order",
                            type: "number",
                            required: false,
                          },
                        ],
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* About Preview */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              About Preview
            </h3>
            <AboutPreview />
          </div>

          {/* Contact Preview */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              Contact Preview
            </h3>
            <ContactPreview />
          </div>
        </section>

        {/* Experience Page */}
        <section className="mb-20 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text">
              Experience Page
            </h2>
            <div className="flex gap-2">
              <AddButton
                label="Add Skill"
                onClick={() =>
                  setEditModal({
                    isOpen: true,
                    type: "skill",
                    data: null,
                    fields: [
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
                      {
                        name: "name",
                        label: "Name",
                        type: "text",
                        required: true,
                      },
                      {
                        name: "description",
                        label: "Description",
                        type: "textarea",
                        required: true,
                      },
                    ],
                  })
                }
              />
              <AddButton
                label="Add Education"
                onClick={() =>
                  setEditModal({
                    isOpen: true,
                    type: "education",
                    data: null,
                    fields: [
                      {
                        name: "category",
                        label: "Category",
                        type: "select",
                        required: true,
                        options: [
                          { value: "coursework", label: "Coursework" },
                          { value: "certifications", label: "Certifications" },
                          { value: "courses", label: "Courses" },
                          { value: "awards", label: "Awards" },
                        ],
                      },
                      {
                        name: "name",
                        label: "Name",
                        type: "text",
                        required: true,
                      },
                      {
                        name: "description",
                        label: "Description",
                        type: "textarea",
                        required: true,
                      },
                      {
                        name: "link",
                        label: "Link",
                        type: "text",
                        required: false,
                      },
                      {
                        name: "linkText",
                        label: "Link Text",
                        type: "text",
                        required: false,
                      },
                    ],
                  })
                }
              />
            </div>
          </div>
          <ExperienceContent />
          <div className="mt-8 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Skills List
              </h3>
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="glass rounded-lg p-4 flex items-center justify-between relative mb-2"
                >
                  <DeleteButton
                    onClick={() => handleDelete("skill", skill.id, skill.name)}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-200">{skill.name}</h4>
                    <p className="text-sm text-gray-400">
                      {skill.category} - {skill.description}
                    </p>
                  </div>
                  <EditButton
                    onClick={() =>
                      setEditModal({
                        isOpen: true,
                        type: "skill",
                        data: skill,
                        fields: [
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
                          {
                            name: "name",
                            label: "Name",
                            type: "text",
                            required: true,
                          },
                          {
                            name: "description",
                            label: "Description",
                            type: "textarea",
                            required: true,
                          },
                        ],
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Education List
              </h3>
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="glass rounded-lg p-4 flex items-center justify-between relative mb-2"
                >
                  <DeleteButton
                    onClick={() => handleDelete("education", edu.id, edu.name)}
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-200">{edu.name}</h4>
                    <p className="text-sm text-gray-400">
                      {edu.category} - {edu.description}
                    </p>
                  </div>
                  <EditButton
                    onClick={() =>
                      setEditModal({
                        isOpen: true,
                        type: "education",
                        data: edu,
                        fields: [
                          {
                            name: "category",
                            label: "Category",
                            type: "select",
                            required: true,
                            options: [
                              { value: "coursework", label: "Coursework" },
                              {
                                value: "certifications",
                                label: "Certifications",
                              },
                              { value: "courses", label: "Courses" },
                              { value: "awards", label: "Awards" },
                            ],
                          },
                          {
                            name: "name",
                            label: "Name",
                            type: "text",
                            required: true,
                          },
                          {
                            name: "description",
                            label: "Description",
                            type: "textarea",
                            required: true,
                          },
                          {
                            name: "link",
                            label: "Link",
                            type: "text",
                            required: false,
                          },
                          {
                            name: "linkText",
                            label: "Link Text",
                            type: "text",
                            required: false,
                          },
                        ],
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Page */}
        <section className="mb-20 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text">About Page</h2>
          </div>
          <WhoAmI />
          <Background />
        </section>

        {/* Portfolio Page */}
        <section className="mb-20 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold gradient-text">Portfolio Page</h2>
          </div>
          <PortfolioSectionClient />
        </section>
      </div>

      {/* Edit Modal */}
      {editModal.isOpen && (
        <EditModal
          isOpen={editModal.isOpen}
          onClose={() =>
            setEditModal({ isOpen: false, type: null, data: null, fields: [] })
          }
          onSave={handleSave}
          title={`${editModal.data ? "Edit" : "Add"} ${editModal.type}`}
          fields={editModal.fields || []}
          initialData={editModal.data || {}}
        />
      )}
    </div>
  );
}
