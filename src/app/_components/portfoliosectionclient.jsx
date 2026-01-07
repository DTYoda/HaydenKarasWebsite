"use client";

import { useEffect, useState } from "react";
import PortfolioResult from "./portfolioresult";

export default function PortfolioSectionClient() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projectshandler");
      if (response.ok) {
        const data = await response.json();
        // Convert snake_case to camelCase
        const converted = (data.data || []).map(p => ({
          id: p.id,
          urlTitle: p.url_title,
          title: p.title,
          descriptions: p.descriptions,
          images: p.images,
          links: p.links,
          technologies: p.technologies,
          type: p.type,
          date: p.date
        }));
        setProjects(converted);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl place-items-center">
        {projects.map((project, id) => {
          let image = null;
          try {
            const images = JSON.parse(project.images || '[]');
            image = images[0];
          } catch (e) {
            console.error("Error parsing images:", e);
          }
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

