"use client";

import { useState, useEffect, useRef } from "react";

export default function ProjectEditModal({
  isOpen,
  onClose,
  onSave,
  projectData,
}) {
  const normalizeTagKey = (value) => String(value || "").trim().toLowerCase();
  const isCoreCategory = (category) =>
    ["soft-skills", "mathematics", "computer-science"].includes(
      String(category || "").trim().toLowerCase()
    );
  const [formData, setFormData] = useState({
    urlTitle: "",
    title: "",
    descriptions: [],
    links: [],
    technologies: [],
    images: [],
    projectType: "",
    date: "",
    highlights: [],
  });
  const initializedProjectRef = useRef(null);
  const [skillTags, setSkillTags] = useState([]);
  const [skillTagMap, setSkillTagMap] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    const loadSkillTags = async () => {
      try {
        const response = await fetch("/api/skillshandler");
        if (!response.ok) return;
        const payload = await response.json();
        const options = (payload.data || [])
          .map((skill) => ({
            name: String(skill.name || "").trim(),
            category: String(skill.category || "other").trim() || "other",
          }))
          .filter((skill) => skill.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        const nextMap = options.reduce((acc, skill) => {
          acc[normalizeTagKey(skill.name)] = skill;
          return acc;
        }, {});
        setSkillTags(options);
        setSkillTagMap(nextMap);
      } catch (error) {
        console.error("Error loading skill tags:", error);
      }
    };

    loadSkillTags();
  }, [isOpen]);

  useEffect(() => {
    if (projectData && isOpen) {
      // Only initialize if this is a different project
      if (initializedProjectRef.current === projectData.url_title) {
        return; // Don't reset if already initialized with this project
      }
      initializedProjectRef.current = projectData.url_title;
      // Parse JSON fields
      let descriptions = [];
      let links = [];
      let technologies = [];

      try {
        const parsed = JSON.parse(projectData.descriptions || "[]");
        if (Array.isArray(parsed)) {
          // New format: array of objects with title/content
          descriptions = parsed.map((desc, index) => {
            if (
              typeof desc === "object" &&
              desc !== null &&
              desc.content !== undefined
            ) {
              // Already an object with title/content
              return {
                title: desc.title || `Paragraph ${index + 1}`,
                content: desc.content || "",
              };
            } else {
              // String format - convert to object
              return {
                title: `Paragraph ${index + 1}`,
                content: desc || "",
              };
            }
          });
        } else if (typeof parsed === "object" && parsed !== null) {
          // Old format: object with keys like { "Description": "...", "Development": "..." }
          descriptions = Object.keys(parsed).map((key) => ({
            title: key,
            content: parsed[key] || "",
          }));
        } else {
          descriptions = [{ title: "Paragraph 1", content: "" }];
        }
        if (descriptions.length === 0)
          descriptions = [{ title: "Paragraph 1", content: "" }];
      } catch (e) {
        console.error("Error parsing descriptions:", e);
        descriptions = [{ title: "Paragraph 1", content: "" }];
      }

      try {
        links = JSON.parse(projectData.links || "[]");
        if (!Array.isArray(links)) links = [];
      } catch (e) {
        links = [];
      }

      try {
        technologies = JSON.parse(projectData.technologies || "[]");
        if (!Array.isArray(technologies)) technologies = [];
        // Ensure each technology has all fields
        technologies = technologies.map((tech) => ({
          title: tech.title || "",
          link: tech.link || "",
          category: tech.category || "",
          proficiency: tech.proficiency || "",
          color: tech.color || "",
          icon: tech.icon || "",
        }));
      } catch (e) {
        technologies = [];
      }

      let images = [];
      try {
        images = JSON.parse(projectData.images || "[]");
        if (!Array.isArray(images)) images = [];
      } catch (e) {
        images = [];
      }

      let highlights = [];
      try {
        highlights = JSON.parse(projectData.highlights || "[]");
        if (!Array.isArray(highlights)) highlights = [];
        // Ensure each highlight has all fields
        highlights = highlights.map((h) => ({
          icon: h.icon || "",
          title: h.title || "",
          description: h.description || "",
        }));
      } catch (e) {
        highlights = [];
      }

      // Default highlights if none exist
      if (highlights.length === 0) {
        highlights = [
          { icon: "🚀", title: "Full-Stack", description: "Complete Application" },
          { icon: "⚡", title: "Modern Stack", description: "Latest Technologies" },
          { icon: "🎯", title: "Production Ready", description: "Deployed & Live" },
          { icon: "💡", title: "Innovative", description: "Unique Solutions" },
        ];
      }

      setFormData({
        urlTitle: projectData.url_title || "",
        title: projectData.title || "",
        descriptions:
          descriptions.length > 0
            ? descriptions
            : [{ title: "Paragraph 1", content: "" }],
        links: links.length > 0 ? links : [{ title: "", link: "" }],
        technologies:
          technologies.length > 0
            ? technologies
            : [
                {
                  title: "",
                  link: "",
                  category: "",
                  proficiency: "",
                  color: "",
                  icon: "",
                },
              ],
        images: images,
        projectType: projectData.type || "website",
        date: projectData.date || "",
        highlights: highlights.length > 0 ? highlights : [
          { icon: "🚀", title: "", description: "" },
          { icon: "⚡", title: "", description: "" },
          { icon: "🎯", title: "", description: "" },
          { icon: "💡", title: "", description: "" },
        ],
      });
    }
  }, [projectData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert arrays to JSON strings
    // Store descriptions as array of objects with title and content
    const descriptionObjects = formData.descriptions
      .map((d) => {
        if (typeof d === "object" && d.content !== undefined) {
          return { title: d.title || "", content: d.content || "" };
        }
        // If it's a string, convert to object
        return { title: "", content: d || "" };
      })
      .filter((d) => d.content && d.content.trim() !== "");

    // Ensure at least one description
    if (descriptionObjects.length === 0) {
      descriptionObjects.push({ title: "", content: "" });
    }

    const submitData = {
      urlTitle: formData.urlTitle,
      title: formData.title,
      descriptions: JSON.stringify(descriptionObjects),
      links: JSON.stringify(
        formData.links.filter(
          (l) =>
            l.title && l.title.trim() !== "" && l.link && l.link.trim() !== ""
        )
      ),
      technologies: JSON.stringify(
        formData.technologies
          .filter((t) => t.title && t.title.trim() !== "")
          .map((t) => {
            const selectedSkill = skillTagMap[normalizeTagKey(t.title)];
            const tech = {
              title: selectedSkill?.name || t.title,
              category: selectedSkill?.category || t.category || "other",
            };
            if (t.link && t.link.trim() !== "") tech.link = t.link;
            const categoryForTech = selectedSkill?.category || t.category || "other";
            if (!isCoreCategory(categoryForTech) && t.proficiency !== "" && t.proficiency !== null) {
              tech.proficiency = parseInt(t.proficiency);
            }
            if (t.color && t.color.trim() !== "") tech.color = t.color;
            return tech;
          })
      ),
      images: JSON.stringify(formData.images),
      projectType: formData.projectType,
      date: formData.date,
      highlights: JSON.stringify(
        formData.highlights
          .filter((h) => h.title && h.title.trim() !== "")
          .map((h) => ({
            icon: h.icon || "",
            title: h.title || "",
            description: h.description || "",
          }))
      ),
    };

    console.log("Submitting project data:", submitData);
    onSave(submitData);
  };

  const addDescription = () => {
    setFormData((prev) => ({
      ...prev,
      descriptions: [
        ...prev.descriptions,
        { title: `Paragraph ${prev.descriptions.length + 1}`, content: "" },
      ],
    }));
  };

  const removeDescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      descriptions: prev.descriptions.filter((_, i) => i !== index),
    }));
  };

  const updateDescription = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      descriptions: prev.descriptions.map((d, i) =>
        i === index
          ? {
              ...(typeof d === "object"
                ? d
                : { title: `Paragraph ${i + 1}`, content: d }),
              [field]: value,
            }
          : d
      ),
    }));
  };

  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { title: "", link: "" }],
    }));
  };

  const removeLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const updateLink = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.map((l, i) =>
        i === index ? { ...l, [field]: value } : l
      ),
    }));
  };

  const addTechnology = () => {
    setFormData((prev) => ({
      ...prev,
      technologies: [
        ...prev.technologies,
        {
          title: "",
          link: "",
          category: "",
          proficiency: "",
          color: "",
          icon: "",
        },
      ],
    }));
  };

  const removeTechnology = (index) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const updateTechnology = (index, field, value) => {
    if (field === "title") {
      const selectedSkill = skillTagMap[normalizeTagKey(value)];
      setFormData((prev) => ({
        ...prev,
        technologies: prev.technologies.map((t, i) =>
          i === index
            ? {
                ...t,
                title: value,
                category: selectedSkill?.category || t.category || "other",
                      proficiency:
                        isCoreCategory(selectedSkill?.category || t.category)
                          ? ""
                          : t.proficiency,
              }
            : t
        ),
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      ),
    }));
  };

  const setDisplayImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      // Move selected image to first position (display image)
      const [selectedImage] = newImages.splice(index, 1);
      newImages.unshift(selectedImage);
      return { ...prev, images: newImages };
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const moveImage = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === formData.images.length - 1) return;

    setFormData((prev) => {
      const newImages = [...prev.images];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      [newImages[index], newImages[newIndex]] = [
        newImages[newIndex],
        newImages[index],
      ];
      return { ...prev, images: newImages };
    });
  };

  const moveDescription = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === formData.descriptions.length - 1)
      return;

    setFormData((prev) => {
      const newDescriptions = [...prev.descriptions];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      [newDescriptions[index], newDescriptions[newIndex]] = [
        newDescriptions[newIndex],
        newDescriptions[index],
      ];
      return { ...prev, descriptions: newDescriptions };
    });
  };

  const moveLink = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === formData.links.length - 1) return;

    setFormData((prev) => {
      const newLinks = [...prev.links];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      [newLinks[index], newLinks[newIndex]] = [
        newLinks[newIndex],
        newLinks[index],
      ];
      return { ...prev, links: newLinks };
    });
  };

  const moveTechnology = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === formData.technologies.length - 1)
      return;

    setFormData((prev) => {
      const newTechnologies = [...prev.technologies];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      [newTechnologies[index], newTechnologies[newIndex]] = [
        newTechnologies[newIndex],
        newTechnologies[index],
      ];
      return { ...prev, technologies: newTechnologies };
    });
  };

  const updateHighlight = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h, i) =>
        i === index ? { ...h, [field]: value } : h
      ),
    }));
  };

  const addHighlight = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [
        ...prev.highlights,
        { icon: "⭐", title: "", description: "" },
      ],
    }));
  };

  const removeHighlight = (index) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-4 sm:p-6 md:p-8 max-w-4xl w-full mx-4 sm:mx-6 max-h-[90vh] overflow-y-auto border border-orange-500/50">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Edit Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-orange-500">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                URL Title
              </label>
              <input
                type="text"
                value={formData.urlTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, urlTitle: e.target.value }))
                }
                className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Type
                </label>
                <input
                  type="text"
                  value={formData.projectType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      projectType: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="month"
                  value={(() => {
                    // Convert date to YYYY-MM format for month input
                    if (!formData.date || formData.date === "undefined") return "";
                    
                    // If already in YYYY-MM format, use it directly
                    const yyyyMmMatch = formData.date.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
                    if (yyyyMmMatch) {
                      const year = yyyyMmMatch[1];
                      const month = yyyyMmMatch[2].padStart(2, "0");
                      return `${year}-${month}`;
                    }
                    
                    // Try parsing as date string
                    try {
                      // Parse as YYYY-MM-DD or other date format
                      const date = new Date(formData.date + "T00:00:00"); // Add time to avoid timezone issues
                      if (!isNaN(date.getTime())) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, "0");
                        return `${year}-${month}`;
                      }
                    } catch {}
                    return "";
                  })()}
                  onChange={(e) => {
                    // Store as YYYY-MM format (month input returns this format)
                    setFormData((prev) => ({ ...prev, date: e.target.value || "" }));
                  }}
                  className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                  placeholder="YYYY-MM"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Format: YYYY-MM (e.g., 2024-11)
                </p>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-orange-500">
                Descriptions
              </h3>
              <button
                type="button"
                onClick={addDescription}
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-1 text-sm font-semibold transition-all"
              >
                + Add Paragraph
              </button>
            </div>

            {formData.descriptions.map((desc, index) => {
              const descObj =
                typeof desc === "object"
                  ? desc
                  : { title: `Paragraph ${index + 1}`, content: desc };
              return (
                <div key={index} className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveDescription(index, "up")}
                        disabled={index === 0}
                        className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded px-2 py-1 text-xs transition-all"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDescription(index, "down")}
                        disabled={index === formData.descriptions.length - 1}
                        className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded px-2 py-1 text-xs transition-all"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                    <input
                      type="text"
                      value={descObj.title}
                      onChange={(e) =>
                        updateDescription(index, "title", e.target.value)
                      }
                      className="flex-1 bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none text-sm"
                      placeholder="Paragraph title (e.g., Overview, Features, etc.)"
                    />
                    <button
                      type="button"
                      onClick={() => removeDescription(index)}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 font-semibold transition-all"
                      disabled={formData.descriptions.length === 1}
                    >
                      ×
                    </button>
                  </div>
                  <textarea
                    value={descObj.content}
                    onChange={(e) =>
                      updateDescription(index, "content", e.target.value)
                    }
                    className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                    rows={3}
                    placeholder="Enter description paragraph content..."
                  />
                </div>
              );
            })}
          </div>

          {/* Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-orange-500">Links</h3>
              <button
                type="button"
                onClick={addLink}
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-1 text-sm font-semibold transition-all"
              >
                + Add Link
              </button>
            </div>

            {formData.links.map((link, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveLink(index, "up")}
                    disabled={index === 0}
                    className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded px-2 py-1 text-xs transition-all"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveLink(index, "down")}
                    disabled={index === formData.links.length - 1}
                    className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded px-2 py-1 text-xs transition-all"
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => updateLink(index, "title", e.target.value)}
                  className="flex-1 bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                  placeholder="Link Title (e.g., GitHub)"
                />
                <input
                  type="text"
                  value={link.link}
                  onChange={(e) => updateLink(index, "link", e.target.value)}
                  className="flex-1 bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                  placeholder="URL (e.g., https://github.com/...)"
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 font-semibold transition-all"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-orange-500">Images</h3>
              <p className="text-sm text-gray-400">
                First image is the display/thumbnail image
              </p>
            </div>

            {formData.images.length > 0 ? (
              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex flex-col gap-1 pt-2">
                      <button
                        type="button"
                        onClick={() => moveImage(index, "up")}
                        disabled={index === 0}
                        className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded px-2 py-1 text-xs transition-all"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, "down")}
                        disabled={index === formData.images.length - 1}
                        className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded px-2 py-1 text-xs transition-all"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                    <div className="flex-1 relative group">
                      <div
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 ${
                          index === 0 ? "border-orange-500" : "border-gray-700"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/icon.png"; // Fallback image
                          }}
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Display
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex gap-2">
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => setDisplayImage(index)}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-1.5 rounded transition-all"
                          >
                            Set as Display
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all"
                          disabled={formData.images.length === 1}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                No images. Upload images from the project page.
              </p>
            )}
          </div>

          {/* Technologies */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-orange-500">
                Technologies
              </h3>
              <button
                type="button"
                onClick={addTechnology}
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-1 text-sm font-semibold transition-all"
              >
                + Add Technology
              </button>
            </div>
            {skillTags.length === 0 ? (
              <p className="text-xs text-yellow-300">
                No skills are available yet. Add tags in Skills first.
              </p>
            ) : null}

            {formData.technologies.map((tech, index) => (
              <div key={index} className="space-y-3 p-4 glass rounded-lg border border-orange-500/20">
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveTechnology(index, "up")}
                      disabled={index === 0}
                      className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded px-2 py-1 text-xs transition-all"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveTechnology(index, "down")}
                      disabled={index === formData.technologies.length - 1}
                      className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded px-2 py-1 text-xs transition-all"
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                  <select
                    value={tech.title || ""}
                    onChange={(e) =>
                      updateTechnology(index, "title", e.target.value)
                    }
                    className="flex-1 bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">-- Select existing tag --</option>
                    {skillTags.map((skill) => (
                      <option key={skill.name} value={skill.name}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={tech.link || ""}
                    onChange={(e) =>
                      updateTechnology(index, "link", e.target.value)
                    }
                    className="flex-1 bg-gray-900/50 border border-orange-500/30 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                    placeholder="Technology URL (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 font-semibold transition-all"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={skillTagMap[normalizeTagKey(tech.title)]?.category || tech.category || "other"}
                      className="w-full bg-gray-900/40 border border-orange-500/20 rounded-lg px-3 py-2 text-gray-300 text-sm focus:outline-none"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Proficiency (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={tech.proficiency || ""}
                      disabled={isCoreCategory(skillTagMap[normalizeTagKey(tech.title)]?.category || tech.category)}
                      onChange={(e) =>
                        updateTechnology(
                          index,
                          "proficiency",
                          e.target.value ? parseInt(e.target.value) : ""
                        )
                      }
                      className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none disabled:opacity-60"
                      placeholder={
                        isCoreCategory(skillTagMap[normalizeTagKey(tech.title)]?.category || tech.category)
                          ? "Not used for core skills"
                          : "Auto (0-100)"
                      }
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Color Gradient
                    </label>
                    <input
                      type="text"
                      value={tech.color || ""}
                      onChange={(e) =>
                        updateTechnology(index, "color", e.target.value)
                      }
                      className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none"
                      placeholder="e.g., from-blue-500 to-cyan-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Key Highlights */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-orange-500">
                Key Highlights
              </h3>
              <button
                type="button"
                onClick={addHighlight}
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-1 text-sm font-semibold transition-all"
              >
                + Add Highlight
              </button>
            </div>

            {formData.highlights.map((highlight, index) => (
              <div
                key={index}
                className="space-y-3 p-4 glass rounded-lg border border-orange-500/20"
              >
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Icon (Emoji)
                    </label>
                    <input
                      type="text"
                      value={highlight.icon || ""}
                      onChange={(e) =>
                        updateHighlight(index, "icon", e.target.value)
                      }
                      className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none"
                      placeholder="🚀"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={highlight.title || ""}
                      onChange={(e) =>
                        updateHighlight(index, "title", e.target.value)
                      }
                      className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none"
                      placeholder="e.g., Full-Stack"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 font-semibold transition-all"
                    >
                      × Remove
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={highlight.description || ""}
                    onChange={(e) =>
                      updateHighlight(index, "description", e.target.value)
                    }
                    className="w-full bg-gray-900/50 border border-orange-500/30 rounded-lg px-3 py-2 text-white text-sm focus:border-orange-500 focus:outline-none"
                    placeholder="e.g., Complete Application"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
