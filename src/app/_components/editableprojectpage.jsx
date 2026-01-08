"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "./navigation";
import ProjectImages from "./projectImages";
import ProjectDescription from "./projectdesc";
import { useAuth } from "./authprovider";
import EditButton from "./editbutton";
import Image from "next/image";
import Link from "next/link";
import ProjectEditModal from "./projecteditmodal";

export default function EditableProjectPage({ projectData: initialProjectData }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [projectData, setProjectData] = useState(initialProjectData);
  const [editModal, setEditModal] = useState({ isOpen: false, section: null });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setProjectData(initialProjectData);
  }, [initialProjectData]);

  // Parse descriptions - support both old format (object) and new format (array of objects)
  let desc = {};
  if (projectData) {
    try {
      const parsed = JSON.parse(projectData.descriptions || '[]');
      if (Array.isArray(parsed)) {
        // New format: array of objects with title/content
        if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0].title !== undefined) {
          // Convert array of {title, content} to object {title: content}
          desc = parsed.reduce((acc, item) => {
            const title = item.title || `Paragraph ${Object.keys(acc).length + 1}`;
            acc[title] = item.content || "";
            return acc;
          }, {});
        } else {
          // Array of strings - convert to object
          desc = parsed.reduce((acc, item, index) => {
            acc[`Paragraph ${index + 1}`] = item || "";
            return acc;
          }, {});
        }
      } else if (typeof parsed === 'object') {
        // Old format: object with keys
        desc = parsed;
      }
    } catch (e) {
      desc = { "Description": "" };
    }
  }
  const images = projectData ? JSON.parse(projectData.images || '[]') : [];
  // First image is thumbnail, rest are display images
  // If images array has items, use all of them (first is thumbnail, rest are gallery)
  // If no images, show empty state
  const displayImages = images.length > 1 ? images.slice(1) : images.length === 1 ? images : [];
  const links = projectData ? JSON.parse(projectData.links || '[]') : [];
  const technologies = projectData ? JSON.parse(projectData.technologies || '[]') : [];

  // Helper to get image URL (handles both local and Supabase URLs)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL (Supabase), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it's a local path, construct the full path
    return `/${projectData.url_title}/${imagePath}`;
  };

  const handleImageUpload = async (file, index = null) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectData.id);
      formData.append('fileName', file.name);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const newImages = [...images];
        
        if (index === null) {
          // Add new image
          if (newImages.length === 0) {
            // First image becomes thumbnail
            newImages.push(data.url);
          } else {
            // Add to gallery
            newImages.push(data.url);
          }
        } else {
          // Replace existing image
          newImages[index + 1] = data.url; // +1 because first image is thumbnail
        }

        await updateProject({ images: JSON.stringify(newImages) });
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        console.error("Upload error:", errorData);
        alert(`Error uploading image: ${errorData.message || "Please check console for details"}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = async (index) => {
    if (!confirm("Delete this image?")) return;

    try {
      const imageUrl = displayImages[index];
      
      // Extract path from Supabase URL if it's a Supabase URL
      if (imageUrl && imageUrl.includes('supabase')) {
        try {
          const url = new URL(imageUrl);
          const pathMatch = url.pathname.match(/\/project-images\/(.+)$/);
          if (pathMatch) {
            const path = pathMatch[1];
            await fetch(`/api/upload-image?path=${encodeURIComponent(path)}`, {
              method: "DELETE",
            });
          }
        } catch (e) {
          console.log("Could not extract path from URL, continuing with deletion");
        }
      }

      const newImages = images.filter((_, i) => i !== index + 1);
      await updateProject({ images: JSON.stringify(newImages) });
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error deleting image");
    }
  };

  const updateProject = async (updates) => {
    try {
      // Ensure JSON fields are strings (they should already be from the modal)
      const newUrlTitle = updates.urlTitle || projectData.url_title;
      const urlTitleChanged = newUrlTitle !== projectData.url_title;
      
      const payload = {
        type: "edit",
        id: projectData.id,
        urlTitle: newUrlTitle,
        title: updates.title || projectData.title,
        descriptions: typeof updates.descriptions === 'string' 
          ? updates.descriptions 
          : (updates.descriptions || projectData.descriptions),
        images: typeof updates.images === 'string' 
          ? updates.images 
          : (updates.images || projectData.images),
        links: typeof updates.links === 'string' 
          ? updates.links 
          : (updates.links || projectData.links),
        technologies: typeof updates.technologies === 'string' 
          ? updates.technologies 
          : (updates.technologies || projectData.technologies),
        projectType: updates.projectType || projectData.type,
        date: updates.date || projectData.date
      };

      console.log("Sending update payload:", payload);

      const response = await fetch("/api/projectshandler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const responseData = await response.json();
        
        if (!responseData.data) {
          console.error("No data in response:", responseData);
          alert("Error: No data returned from update");
          return;
        }
        
        const updatedProject = responseData.data;
        
        // If URL title changed, navigate to the new URL
        if (urlTitleChanged) {
          router.push(`/portfolio/${updatedProject.url_title}`);
        } else {
          // Close modal and refresh - same pattern as other editable components
          setEditModal({ isOpen: false, section: null });
          router.refresh();
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        console.error("Update error:", errorData);
        alert(`Error updating project: ${errorData.message || "Please check console for details"}`);
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Error updating project");
    }
  };


  if (!projectData) {
    return <div>Project not found</div>;
  }

  return (
    <div className="animated-gradient min-h-screen">
      <Navigation />
      <div className="w-full flex flex-col items-center pt-24 pb-20 px-6">
        {/* Project Header */}
        <div className="text-center mb-12 fade-in max-w-4xl relative w-full">
          {isAuthenticated && (
            <EditButton
              onClick={() => setEditModal({ isOpen: true, section: "header" })}
              className="absolute top-0 right-0"
            />
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">{projectData.title}</span>
          </h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
        </div>

        {/* Project Images */}
        <div className="w-full max-w-6xl mb-12 fade-in relative">
          {isAuthenticated && (
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <label className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 font-semibold transition-all duration-300 hover:scale-105 shadow-lg cursor-pointer">
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
          {displayImages.length > 0 ? (
            <>
              <ProjectImages
                images={displayImages}
                onDelete={isAuthenticated ? handleImageDelete : null}
              />
            </>
          ) : (
            <div className="text-center text-gray-400 py-12 glass rounded-2xl">
              {isAuthenticated ? "No images yet. Add your first image!" : "No images available."}
            </div>
          )}
        </div>

        {/* Project Description */}
        <div className="w-full max-w-6xl mb-16 fade-in relative">
          {isAuthenticated && (
            <EditButton
              onClick={() => setEditModal({ isOpen: true, section: "project" })}
              className="absolute top-0 right-0"
            />
          )}
          <ProjectDescription description={desc} />
        </div>

        {/* Technologies and Links */}
        <div className="w-full max-w-6xl flex flex-col sm:flex-row gap-12 sm:gap-16 items-start sm:items-center sm:justify-center">
          {/* Technologies Section */}
          <div className="glass rounded-2xl p-8 hover-lift w-full sm:w-auto relative">
            {isAuthenticated && (
              <EditButton
                onClick={() => setEditModal({ isOpen: true, section: "project" })}
                className="absolute top-4 right-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-6 text-orange-500">Technologies</h2>
            <div className="flex flex-wrap gap-6 justify-center items-center">
              {technologies.length > 0 ? (
                technologies.map((tech, id) => (
                  <Link
                    key={id}
                    title={tech.title}
                    href={tech.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-16 w-16 flex justify-center items-center group transition-all duration-300 hover-lift"
                  >
                    <Image
                      src={"/technologyimages/" + tech.title + ".png"}
                      width={64}
                      height={64}
                      alt={tech.title}
                      className="transition-transform duration-300 group-hover:scale-110 filter group-hover:brightness-110"
                      style={{ width: "auto", height: "100%" }}
                    />
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  {isAuthenticated ? "No technologies. Click edit to add." : "No technologies listed."}
                </p>
              )}
            </div>
          </div>

          {/* Links Section */}
          <div className="glass rounded-2xl p-8 hover-lift w-full sm:w-auto relative">
            {isAuthenticated && (
              <EditButton
                onClick={() => setEditModal({ isOpen: true, section: "project" })}
                className="absolute top-4 right-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-6 text-orange-500">Links</h2>
            <div className="flex flex-wrap gap-6 justify-center items-center">
              {links.length > 0 ? (
                links.map((link, id) => (
                  <Link
                    key={id}
                    title={link.title}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-16 w-16 flex justify-center items-center group transition-all duration-300 hover-lift"
                  >
                    <Image
                      src={"/linkimages/" + link.title + ".png"}
                      width={64}
                      height={64}
                      alt={link.title}
                      className="transition-transform duration-300 group-hover:scale-110 filter group-hover:brightness-110"
                      style={{ width: "auto", height: "100%" }}
                    />
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  {isAuthenticated ? "No links. Click edit to add." : "No links available."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

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
            type: projectData.type,
            date: projectData.date
          }}
        />
      )}
    </div>
  );
}

