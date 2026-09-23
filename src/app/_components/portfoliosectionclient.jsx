"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import PortfolioResult from "./portfolioresult";
import { useAuth } from "./authprovider";
import AddButton from "./addbutton";
import {
  compareProjectDatesDesc,
  getProjectImages,
  mapProject,
} from "@/lib/projects";

export default function PortfolioSectionClient({ initialProjects = [] }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects || []);
  const [filteredProjects, setFilteredProjects] = useState(initialProjects || []);
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(!initialProjects?.length);

  useEffect(() => {
    if (initialProjects?.length) {
      setProjects(initialProjects);
      setFilteredProjects(initialProjects);
      setLoading(false);
    } else {
      fetchProjects();
    }
  }, [initialProjects]);

  // Calculate available project types and their counts
  const availableTypes = useMemo(() => {
    const typeCounts = {};
    projects.forEach((project) => {
      const projectType = (project.type || "website").toLowerCase();
      typeCounts[projectType] = (typeCounts[projectType] || 0) + 1;
    });
    return typeCounts;
  }, [projects]);

  // Map of type values to display labels
  const typeLabels = {
    website: "Websites",
    game: "Games",
    application: "Applications",
    "class project": "Class Projects",
  };

  useEffect(() => {
    // Filter projects by type
    if (selectedType === "all") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => {
          const projectType = (project.type || "website").toLowerCase();
          return projectType === selectedType.toLowerCase();
        })
      );
    }
  }, [selectedType, projects]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projectshandler", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        const converted = (data.data || []).map((p) => mapProject(p) || p);
        const sorted = converted.sort(compareProjectDatesDesc);
        setProjects(sorted);
        setFilteredProjects(sorted);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center py-20 px-6">
        <div className="text-center mb-16 fade-in">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 uppercase tracking-wider">
            <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 font-light">
            Showcasing My Work
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
        </div>
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const createNewProject = async () => {
    try {
      const response = await fetch("/api/projectshandler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          action: "new",
          urlTitle: `new-project-${Date.now()}`,
          title: "New Project",
          descriptions: JSON.stringify([
            { title: "Overview", content: "Add your project description here." },
          ]),
          images: JSON.stringify([]),
          links: JSON.stringify([]),
          technologies: JSON.stringify([]),
          projectType: "website",
          date: new Date().toISOString().slice(0, 7),
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to the new project page
        router.push(`/portfolio/${data.data.urlTitle || data.data.url_title}`);
      } else {
        alert("Error creating project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-6">
      <div className="text-center mb-16 fade-in relative w-full max-w-7xl">
        {isAuthenticated && (
          <div className="absolute top-0 right-0 sm:static sm:mb-4 sm:text-right">
            <AddButton
              onClick={createNewProject}
              label="Create New Project"
            />
          </div>
        )}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 uppercase tracking-wider">
          <span className="gradient-text">Portfolio</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-400 font-light">
          Showcasing My Work
        </p>
        <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
      </div>
      
      {/* Filter Section */}
      <div className="mb-12 flex flex-wrap justify-center gap-2 sm:gap-4 w-full max-w-7xl px-4">
        <button
          onClick={() => setSelectedType("all")}
          className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 ${
            selectedType === "all"
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
              : "glass text-orange-500 hover:bg-orange-500/10 border border-orange-500/20"
          }`}
        >
          All Projects
        </button>
        {Object.entries(availableTypes).map(([type, count]) => {
          // Only show if there's at least one project and we have a label for it
          if (count > 0 && typeLabels[type]) {
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 ${
                  selectedType === type
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                    : "glass text-orange-500 hover:bg-orange-500/10 border border-orange-500/20"
                }`}
              >
                {typeLabels[type]}
              </button>
            );
          }
          return null;
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl place-items-center">
        {filteredProjects.map((project, id) => {
          const images = getProjectImages(project);
          const image = images[0] || null;
          return (
            <div key={project.id || id} className="fade-in" style={{ animationDelay: `${id * 0.1}s` }}>
              <PortfolioResult
                link={project.urlTitle || project.url_title}
                title={project.title}
                type={project.type}
                date={project.date}
                image={image}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

