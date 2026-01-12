"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import EditButton from "./editbutton";
import DeleteButton from "./deletebutton";
import AddButton from "./addbutton";

export default function EditableLatestProjects({ projects: initialProjects }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects || []);
  const { openEditModal, handleDelete, EditModalComponent } = useEditable(
    "project",
    () => {
      fetchProjects();
    }
  );

  useEffect(() => {
    setProjects(initialProjects || []);
  }, [initialProjects]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projectshandler");
      if (response.ok) {
        const data = await response.json();
        // Convert snake_case to camelCase
        const converted = (data.data || []).map((p) => ({
          id: p.id,
          urlTitle: p.url_title || p.urlTitle,
          title: p.title,
          descriptions: p.descriptions,
          images: p.images,
          links: p.links,
          technologies: p.technologies,
          type: p.type,
          date: p.date,
        }));
        setProjects(converted);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Format date as "Month Year"
  const formatDateDisplay = (dateStr) => {
    if (!dateStr || dateStr === "undefined" || dateStr === "null") return "";
    
    try {
      // Handle YYYY-MM format
      const yyyyMmMatch = dateStr.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
      if (yyyyMmMatch) {
        const year = parseInt(yyyyMmMatch[1]);
        const month = parseInt(yyyyMmMatch[2]) - 1; // Month is 0-indexed
        const date = new Date(year, month, 1);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
      }
      
      // Try parsing as date string
      const date = new Date(dateStr + "T00:00:00");
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });
      }
    } catch {}
    
    return dateStr;
  };

  // Sort projects by date (newest first) and take latest 3
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = a.date || "";
    const dateB = b.date || "";
    // Compare YYYY-MM format strings (descending order)
    return dateB.localeCompare(dateA);
  });
  const latestProjects = sortedProjects.slice(0, 3);

  const projectFields = [
    { name: "urlTitle", label: "URL Title", type: "text", required: true },
    { name: "title", label: "Title", type: "text", required: true },
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
    { name: "type", label: "Type", type: "text", required: false },
    { name: "date", label: "Date", type: "text", required: false },
  ];

  return (
    <>
      <section className="w-full mb-20 fade-in relative">
        {isAuthenticated && (
          <div className="absolute top-0 right-0 z-10">
            <AddButton
              onClick={() => openEditModal(null, projectFields)}
              label="Add Project"
            />
          </div>
        )}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              <span className="gradient-text">Latest Projects</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Recent work showcasing my skills and creativity
            </p>
          </div>
          <Link
            href="/portfolio"
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-all duration-300 hover-lift glow-orange-hover whitespace-nowrap"
          >
            View All Projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestProjects.map((project, index) => {
            const images = project.images ? JSON.parse(project.images) : [];
            // Handle both local paths and Supabase URLs
            const getImageSrc = () => {
              if (!images || images.length === 0) return null;
              const image = images[0];
              // If it's already a full URL (Supabase), return as is
              if (image.startsWith("http://") || image.startsWith("https://")) {
                return image;
              }
              // Otherwise, construct local path
              return `/${project.urlTitle}/${image}`;
            };
            const imagePath = getImageSrc();

            return (
              <div key={project.id || index} className="relative group">
                {isAuthenticated && (
                  <>
                    <EditButton
                      onClick={() => openEditModal(project, projectFields)}
                      className="absolute top-2 right-2 z-20"
                    />
                    <DeleteButton
                      onClick={() => handleDelete(project.id)}
                      className="absolute top-2 left-2 z-20"
                    />
                  </>
                )}
                <Link
                  href={`/portfolio/${project.urlTitle}`}
                  className="group glass rounded-2xl overflow-hidden hover-lift transition-all duration-300 border border-orange-500/20 hover:border-orange-500/50 block animate-float-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {imagePath && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={imagePath}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        loading={index < 2 ? "eager" : "lazy"}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//Z"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-200 mb-2 group-hover:text-orange-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-orange-500/80 font-medium mb-2">
                      {project.type}
                    </p>
                    <p className="text-xs text-gray-500">{formatDateDisplay(project.date)}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
      {EditModalComponent}
    </>
  );
}
