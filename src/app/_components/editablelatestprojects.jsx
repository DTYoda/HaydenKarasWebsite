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
import {
  formatDateDisplay,
  getLatestProjects,
  getProjectImageUrl,
  getProjectImages,
} from "@/lib/projects";

export default function EditableLatestProjects({ projects: initialProjects }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects || []);
  const { handleDelete } = useEditable("project", () => {});

  useEffect(() => {
    setProjects(initialProjects || []);
  }, [initialProjects]);

  const latestProjects = getLatestProjects(projects, 3);

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
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/portfolio/${data.data.urlTitle}`);
      } else {
        const error = await response.json().catch(() => ({}));
        alert(error.message || "Error creating project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project");
    }
  };

  return (
    <section className="w-full mb-20 fade-in relative">
      {isAuthenticated && (
        <div className="absolute top-0 right-0 z-10">
          <AddButton onClick={createNewProject} label="Add Project" />
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
          const images = getProjectImages(project);
          const imagePath = getProjectImageUrl(project, images[0]);

          return (
            <div key={project.id || index} className="relative group">
              {isAuthenticated && (
                <>
                  <EditButton
                    onClick={() => router.push(`/portfolio/${project.urlTitle}`)}
                    className="absolute top-2 right-2 z-20"
                  />
                  <DeleteButton
                    onClick={() => {
                      handleDelete(project.id);
                      setProjects((prev) =>
                        prev.filter((item) => item.id !== project.id)
                      );
                    }}
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
                  <p className="text-xs text-gray-500">
                    {formatDateDisplay(project.date)}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
