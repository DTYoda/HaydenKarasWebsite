"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navigation from "./navigation";
import { useAuth } from "./authprovider";
import Image from "next/image";
import Link from "next/link";
import EditButton from "./editbutton";
import DeleteButton from "./deletebutton";
import ProjectEditModal from "./projecteditmodal";

export default function NewProjectPage({ projectData: initialProjectData }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [projectData, setProjectData] = useState(initialProjectData);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedTechCategory, setSelectedTechCategory] = useState("all");
  const [animatedProficiencies, setAnimatedProficiencies] = useState({});
  const [editModal, setEditModal] = useState({ isOpen: false, section: null });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setProjectData(initialProjectData);
  }, [initialProjectData]);

  // Helper functions (defined before use)
  const categorizeTechnology = (techName) => {
    const name = techName.toLowerCase();

    // Programming languages category
    if (
      name === "python" ||
      name === "javascript" ||
      name === "typescript" ||
      name === "java" ||
      name === "c++" ||
      name === "c#" ||
      name === "c" ||
      name === "go" ||
      name === "rust" ||
      name === "swift" ||
      name === "kotlin" ||
      name === "ruby" ||
      name === "php" ||
      name === "r" ||
      name === "scala" ||
      name === "dart" ||
      name === "lua" ||
      name === "perl" ||
      name === "haskell" ||
      name === "clojure" ||
      name === "elixir" ||
      name === "erlang" ||
      name === "f#" ||
      name === "vb.net" ||
      name === "vb" ||
      name === "objective-c" ||
      name === "objectivec" ||
      name === "assembly" ||
      name === "sql" ||
      name.match(
        /^(python|javascript|typescript|java|c\+\+|c#|c|go|rust|swift|kotlin|ruby|php|r|scala|dart|lua|perl|haskell|clojure|elixir|erlang|f#|vb\.net|vb|objective-c|objectivec|assembly|sql)$/i
      )
    ) {
      return "programming-language";
    }

    if (
      name.includes("react") ||
      name.includes("next") ||
      name.includes("vue") ||
      name.includes("angular") ||
      name.includes("html") ||
      name.includes("css") ||
      name.includes("tailwind") ||
      name.includes("svelte") ||
      name.includes("ember")
    ) {
      return "frontend";
    }
    if (
      name.includes("node") ||
      name.includes("express") ||
      name.includes("django") ||
      name.includes("flask") ||
      name.includes("api") ||
      name.includes("supabase") ||
      name.includes("database") ||
      name.includes("postgres") ||
      name.includes("mysql") ||
      name.includes("mongodb")
    ) {
      return "backend";
    }
    if (
      name.includes("unity") ||
      name.includes("unreal") ||
      name.includes("game") ||
      name.includes("godot")
    ) {
      return "game-dev";
    }
    if (
      name.includes("git") ||
      name.includes("docker") ||
      name.includes("aws") ||
      name.includes("vercel") ||
      name.includes("deploy") ||
      name.includes("ci/cd") ||
      name.includes("kubernetes") ||
      name.includes("jenkins")
    ) {
      return "tools";
    }
    return "other";
  };

  const getDefaultProficiency = (techName) => {
    const name = techName.toLowerCase();
    if (
      name.includes("next") ||
      name.includes("react") ||
      name.includes("node")
    )
      return 85;
    if (name.includes("python") || name.includes("javascript")) return 80;
    if (name.includes("unity") || name.includes("c#")) return 75;
    return 70;
  };

  // Get color gradient based on category
  const getTechColor = (category) => {
    switch (category) {
      case "frontend":
        return "from-blue-500 to-cyan-500";
      case "backend":
        return "from-green-500 to-emerald-500";
      case "game-dev":
        return "from-purple-500 to-pink-500";
      case "tools":
        return "from-yellow-500 to-orange-500";
      case "programming-language":
        return "from-indigo-500 to-purple-500";
      case "other":
      default:
        return "from-orange-500 to-red-500";
    }
  };

  // Convert Tailwind gradient classes to CSS gradient
  const getGradientColors = (gradientString) => {
    // Map Tailwind color names to hex values
    const colorMap = {
      "blue-500": "#3b82f6",
      "cyan-500": "#06b6d4",
      "green-500": "#22c55e",
      "emerald-500": "#10b981",
      "yellow-500": "#eab308",
      "orange-500": "#f97316",
      "purple-500": "#a855f7",
      "pink-500": "#ec4899",
      "red-500": "#ef4444",
      "teal-500": "#14b8a6",
      "indigo-500": "#6366f1",
    };

    if (
      gradientString &&
      gradientString.includes("from-") &&
      gradientString.includes("to-")
    ) {
      const fromMatch = gradientString.match(/from-(\w+-\d+)/);
      const toMatch = gradientString.match(/to-(\w+-\d+)/);

      if (fromMatch && toMatch) {
        const fromColor = colorMap[fromMatch[1]] || "#f97316";
        const toColor = colorMap[toMatch[1]] || "#ea580c";
        return `linear-gradient(to right, ${fromColor}, ${toColor})`;
      }
    }

    // Fallback to orange gradient
    return "linear-gradient(to right, #f97316, #ea580c)";
  };

  const getTechIcon = (techName) => {
    const name = techName.toLowerCase();
    if (name.includes("react")) return "⚛️";
    if (name.includes("next")) return "▲";
    if (name.includes("node")) return "🟢";
    if (name.includes("python")) return "🐍";
    if (name.includes("javascript")) return "🟨";
    if (name.includes("unity")) return "🎮";
    if (name.includes("tailwind")) return "💨";
    if (name.includes("supabase")) return "🗄️";
    if (name.includes("git")) return "📦";
    return "⚙️";
  };

  // Parse project data
  const rawImages = projectData ? JSON.parse(projectData.images || "[]") : [];

  // Helper to get image URL (handles both local and Supabase URLs)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `/${projectData.url_title}/${imagePath}`;
  };

  const images = rawImages.map(getImageUrl).filter(Boolean);
  const links = projectData ? JSON.parse(projectData.links || "[]") : [];
  const rawTechnologies = projectData
    ? JSON.parse(projectData.technologies || "[]")
    : [];
  const highlights =
    projectData && projectData.highlights
      ? (() => {
          try {
            return JSON.parse(projectData.highlights);
          } catch (e) {
            console.error("Error parsing highlights:", e);
            return [];
          }
        })()
      : [];

  // Enhance technologies with visual data (using example data if not in DB)
  const technologies = useMemo(() => {
    return rawTechnologies.map((tech) => {
      const category = tech.category || categorizeTechnology(tech.title);
      return {
        ...tech,
        category: category,
        proficiency: tech.proficiency || getDefaultProficiency(tech.title),
        color: tech.color || getTechColor(category),
        icon: tech.icon || getTechIcon(tech.title),
      };
    });
  }, [rawTechnologies]);

  // Animate proficiency bars on mount
  useEffect(() => {
    const timers = technologies.map((tech, index) => {
      return setTimeout(() => {
        setAnimatedProficiencies((prev) => ({
          ...prev,
          [tech.title]: tech.proficiency,
        }));
      }, index * 50 + 100);
    });
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [technologies]);

  // Parse descriptions - support both old and new formats
  let descriptions = [];
  if (projectData) {
    try {
      const parsed = JSON.parse(projectData.descriptions || "[]");
      if (Array.isArray(parsed)) {
        if (
          parsed.length > 0 &&
          typeof parsed[0] === "object" &&
          parsed[0].title !== undefined
        ) {
          descriptions = parsed;
        } else {
          descriptions = parsed.map((item, index) => ({
            title: `Section ${index + 1}`,
            content: item || "",
          }));
        }
      } else if (typeof parsed === "object") {
        descriptions = Object.entries(parsed).map(([title, content]) => ({
          title,
          content,
        }));
      }
    } catch (e) {
      descriptions = [{ title: "Description", content: "" }];
    }
  }

  // Get project type badge color
  const getTypeColor = (type) => {
    const typeLower = (type || "website").toLowerCase();
    if (typeLower.includes("game"))
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    if (typeLower.includes("app") || typeLower.includes("application"))
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (typeLower.includes("class") || typeLower.includes("school"))
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (typeLower.includes("website") || typeLower.includes("web"))
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  // Format date - handle various formats
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "undefined" || dateStr === "null") return null;

    try {
      let date;

      // Check for YYYY-MM or YYYY-MM-DD format FIRST to avoid timezone issues
      const dateMatch = dateStr.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/);
      if (dateMatch) {
        const year = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]) - 1; // Month is 0-indexed in JS Date
        const day = dateMatch[3] ? parseInt(dateMatch[3]) : 1;
        date = new Date(year, month, day);
      } else {
        // Try parsing as ISO date string or other formats
        date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          return dateStr; // Return as-is if can't parse
        }
      }

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return dateStr;
    }
  };

  // Get category label
  const getCategoryLabel = (category) => {
    const labels = {
      frontend: "Frontend",
      backend: "Backend",
      "game-dev": "Game Development",
      tools: "Tools & DevOps",
      "programming-language": "Programming Language",
      other: "Other",
    };
    return labels[category] || "Other";
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      frontend: "🎨",
      backend: "⚙️",
      "game-dev": "🎮",
      tools: "🛠️",
      "programming-language": "💻",
      other: "📦",
    };
    return icons[category] || "📦";
  };

  // Filter technologies by category
  const filteredTechnologies =
    selectedTechCategory === "all"
      ? technologies
      : technologies.filter((tech) => tech.category === selectedTechCategory);

  // Get unique categories
  const categories = [
    "all",
    ...new Set(technologies.map((tech) => tech.category)),
  ];

  // Get usage label based on percentage used in project
  const getProficiencyLabel = (proficiency) => {
    if (proficiency >= 80) return "Extensively Used";
    if (proficiency >= 60) return "Heavily Used";
    if (proficiency >= 40) return "Moderately Used";
    if (proficiency >= 20) return "Lightly Used";
    return "Minimally Used";
  };

  // Update project function
  const updateProject = async (updates) => {
    try {
      const newUrlTitle = updates.urlTitle || projectData.url_title;
      const urlTitleChanged = newUrlTitle !== projectData.url_title;

      const payload = {
        type: "edit",
        id: projectData.id,
        urlTitle: newUrlTitle,
        title: updates.title || projectData.title,
        descriptions:
          typeof updates.descriptions === "string"
            ? updates.descriptions
            : updates.descriptions || projectData.descriptions,
        images:
          typeof updates.images === "string"
            ? updates.images
            : updates.images || projectData.images,
        links:
          typeof updates.links === "string"
            ? updates.links
            : updates.links || projectData.links,
        technologies:
          typeof updates.technologies === "string"
            ? updates.technologies
            : updates.technologies || projectData.technologies,
        ...(updates.highlights !== undefined && {
          highlights:
            typeof updates.highlights === "string"
              ? updates.highlights
              : updates.highlights || projectData.highlights || "[]",
        }),
        projectType: updates.projectType || projectData.type,
        date: updates.date || projectData.date,
      };

      const response = await fetch("/api/projectshandler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (!responseData.data) {
          console.error("No data in response:", responseData);
          alert("Error: No data returned from update");
          return;
        }

        const updatedProject = responseData.data;

        if (urlTitleChanged) {
          router.push(`/portfolio/${updatedProject.url_title}`);
        } else {
          setEditModal({ isOpen: false, section: null });
          router.refresh();
        }
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        console.error("Update error:", errorData);
        alert(
          `Error updating project: ${
            errorData.message || "Please check console for details"
          }`
        );
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Error updating project");
    }
  };

  const handleDeleteProject = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${projectData.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/projectshandler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "delete",
          id: projectData.id,
        }),
      });

      if (response.ok) {
        router.push("/portfolio");
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        console.error("Delete error:", errorData);
        alert(
          `Error deleting project: ${
            errorData.message || "Please check console for details"
          }`
        );
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project");
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectData.id);
      formData.append("fileName", file.name);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newImages = [...images, data.url];
        await updateProject({ images: JSON.stringify(newImages) });
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        console.error("Upload error:", errorData);
        alert(
          `Error uploading image: ${
            errorData.message || "Please check console for details"
          }`
        );
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  if (!projectData) {
    return <div>Project not found</div>;
  }

  return (
    <div className="animated-gradient min-h-screen">
      <Navigation />
      <div className="w-full flex flex-col items-center pt-24 pb-20 px-4 sm:px-6">
        {/* Hero Section */}
        <div className="w-full max-w-7xl mb-12 fade-in relative">
          {isAuthenticated && (
            <div className="absolute top-0 right-0 sm:static sm:mb-4 sm:flex sm:justify-end flex gap-2 z-10">
              <EditButton
                onClick={() =>
                  setEditModal({ isOpen: true, section: "project" })
                }
              />
              <DeleteButton onClick={handleDeleteProject} />
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                <span className="gradient-text">{projectData.title}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {projectData.type && (
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getTypeColor(
                      projectData.type
                    )}`}
                  >
                    {projectData.type}
                  </span>
                )}
                {formatDate(projectData.date) && (
                  <span className="text-gray-400 text-sm mono">
                    {formatDate(projectData.date)}
                  </span>
                )}
              </div>
            </div>
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {links.map((link, id) => (
                  <Link
                    key={id}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/50 border border-orange-500/20 transition-all duration-300 hover-lift"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="w-full max-w-7xl mb-12 fade-in relative">
          {isAuthenticated && (
            <div className="absolute top-4 right-4 z-10">
              <label className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleImageUpload(e.target.files[0]);
                    }
                  }}
                  disabled={uploading}
                />
                {uploading ? "Uploading..." : "Add Image"}
              </label>
            </div>
          )}
          {images.length > 0 ? (
            <div className="glass rounded-2xl p-4 sm:p-6 overflow-hidden">
              {/* Main Image */}
              <div className="relative mb-4 group">
                <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] max-h-[800px] rounded-lg overflow-hidden">
                  <Image
                    src={images[selectedImageIndex] || images[0]}
                    alt={`${projectData.title} - Screenshot ${
                      selectedImageIndex + 1
                    }`}
                    fill
                    className="object-contain transition-all duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  />
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          (selectedImageIndex - 1 + images.length) %
                            images.length
                        )
                      }
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 glass hover:bg-orange-500/20 hover:border-orange-500/50 border border-orange-500/20 rounded-full h-10 w-10 sm:h-12 sm:w-12 flex justify-center items-center text-orange-500 text-xl sm:text-2xl font-bold transition-all duration-300 hover-lift hover:scale-110"
                      aria-label="Previous image"
                    >
                      {"<"}
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          (selectedImageIndex + 1) % images.length
                        )
                      }
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 glass hover:bg-orange-500/20 hover:border-orange-500/50 border border-orange-500/20 rounded-full h-10 w-10 sm:h-12 sm:w-12 flex justify-center items-center text-orange-500 text-xl sm:text-2xl font-bold transition-all duration-300 hover-lift hover:scale-110"
                      aria-label="Next image"
                    >
                      {">"}
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-lg mono text-sm text-gray-400">
                      {`${selectedImageIndex + 1} / ${images.length}`}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && images.length <= 8 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === selectedImageIndex
                          ? "border-orange-500 scale-105"
                          : "border-orange-500/30 opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                      style={{ width: "100px", height: "75px" }}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12 glass rounded-2xl">
              {isAuthenticated
                ? "No images yet. Add your first image!"
                : "No images available."}
            </div>
          )}
        </div>

        {/* Skills & Technologies - Visual Section */}
        {technologies.length > 0 && (
          <div className="w-full max-w-7xl mb-12 fade-in">
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-orange-500">
                  Technology Stack
                </h2>
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedTechCategory(category)}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 ${
                        selectedTechCategory === category
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                          : "glass text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 border border-orange-500/20"
                      }`}
                    >
                      {category === "all"
                        ? "All"
                        : `${getCategoryIcon(category)} ${getCategoryLabel(
                            category
                          )}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technology Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTechnologies.map((tech, id) => (
                  <a
                    key={id}
                    href={tech.link || "#"}
                    target={tech.link ? "_blank" : undefined}
                    rel={tech.link ? "noopener noreferrer" : undefined}
                    className="group relative"
                  >
                    <div className="glass rounded-xl p-5 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 hover-lift h-full">
                      {/* Tech Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`text-3xl bg-gradient-to-br ${tech.color} bg-clip-text text-transparent flex-shrink-0`}
                        >
                          {tech.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-200 truncate group-hover:text-orange-400 transition-colors">
                            {tech.title}
                          </h3>
                          <p className="text-xs text-gray-500 capitalize">
                            {getCategoryLabel(tech.category)}
                          </p>
                        </div>
                      </div>

                      {/* Proficiency Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Usage Level</span>
                          <span className="font-semibold text-orange-400">
                            {tech.proficiency}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-800/80 rounded-full overflow-hidden border border-orange-500/20">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${
                                animatedProficiencies[tech.title] || 0
                              }%`,
                              background: getGradientColors(tech.color),
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {getProficiencyLabel(tech.proficiency)}
                        </p>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Key Achievements / Highlights */}
        {highlights.length > 0 && (
          <div className="w-full max-w-7xl mb-12 fade-in relative">
            {isAuthenticated && (
              <EditButton
                onClick={() =>
                  setEditModal({ isOpen: true, section: "project" })
                }
                className="absolute top-0 right-0 sm:static sm:mb-4 sm:flex sm:justify-end z-10"
              />
            )}
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-orange-500">
              Key Highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="glass rounded-xl p-5 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 hover-lift text-center"
                >
                  <div className="text-3xl mb-2">{highlight.icon || "⭐"}</div>
                  <div className="text-lg font-bold text-orange-400 mb-1">
                    {highlight.title || "Highlight"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {highlight.description || "Description"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Overview / Descriptions */}
        {descriptions.length > 0 && (
          <div className="w-full max-w-7xl mb-12 fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-orange-500">
              Project Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {descriptions.map((desc, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl p-6 hover-lift border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl group-hover:from-orange-500/20 transition-all duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                      <h3 className="text-xl font-bold text-orange-400">
                        {desc.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {desc.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editModal.isOpen && (
          <ProjectEditModal
            isOpen={editModal.isOpen}
            onClose={() => setEditModal({ isOpen: false, section: null })}
            onSave={async (data) => {
              await updateProject(data);
              setEditModal({ isOpen: false, section: null });
            }}
            projectData={{
              url_title: projectData.url_title,
              title: projectData.title,
              descriptions: projectData.descriptions,
              links: projectData.links,
              technologies: projectData.technologies,
              images: projectData.images,
              highlights: projectData.highlights,
              type: projectData.type,
              date: projectData.date,
            }}
          />
        )}
      </div>
    </div>
  );
}
