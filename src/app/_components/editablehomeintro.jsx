"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import EditButton from "./editbutton";

export default function EditableHomeIntro() {
  const { isAuthenticated } = useAuth();
  const [introText, setIntroText] = useState("Hi, my name is");
  const [name, setName] = useState("Hayden Karas");
  const [roles, setRoles] = useState(["Coder", "Developer", "Mathematician"]);
  const [resumeLink, setResumeLink] = useState("/resume.pdf");
  const [linkedinLink, setLinkedinLink] = useState("https://www.linkedin.com/in/haydenkaras/");
  const [githubLink, setGithubLink] = useState("https://github.com/DTYoda");
  const { openEditModal, EditModalComponent } = useEditable("pagecontent", () => {
    fetchContent();
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/pagecontent?page=home&section=intro");
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          data.data.forEach(item => {
            if (item.key === "home-intro-text") setIntroText(item.content);
            else if (item.key === "home-intro-name") setName(item.content);
            else if (item.key === "home-intro-roles") {
              try {
                setRoles(JSON.parse(item.content));
              } catch (e) {
                setRoles(["Coder", "Developer", "Mathematician"]);
              }
            }
            else if (item.key === "home-intro-resume") setResumeLink(item.content);
            else if (item.key === "home-intro-linkedin") setLinkedinLink(item.content);
            else if (item.key === "home-intro-github") setGithubLink(item.content);
          });
        }
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const textFields = [
    { name: "content", label: "Content", type: "text", required: true },
  ];

  const rolesFields = [
    { name: "content", label: "Roles (JSON array)", type: "textarea", required: true },
  ];

  return (
    <>
      <div className="relative z-10 fade-in py-8">
        <div className="mb-4 sm:mb-6 relative">
          {isAuthenticated && (
            <EditButton
              onClick={() => openEditModal(
                { key: "home-intro-text", page: "home", section: "intro", content: introText, type: "text" },
                textFields
              )}
              className="absolute -top-2 -right-2 z-10 bg-blue-500 hover:bg-blue-600"
            />
          )}
          <span className="mono text-orange-500 text-base sm:text-lg font-medium">
            {introText}
          </span>
        </div>
        <h1 className="font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 sm:mb-6 leading-tight relative">
          {isAuthenticated && (
            <EditButton
              onClick={() => openEditModal(
                { key: "home-intro-name", page: "home", section: "intro", content: name, type: "text" },
                textFields
              )}
              className="absolute -top-2 -right-2 z-10 bg-blue-500 hover:bg-blue-600"
            />
          )}
          <span className="gradient-text">{name}</span>
        </h1>
        <div className="space-y-2 sm:space-y-4 mb-8 sm:mb-12 relative">
          {isAuthenticated && (
            <EditButton
              onClick={() => openEditModal(
                { key: "home-intro-roles", page: "home", section: "intro", content: JSON.stringify(roles), type: "json" },
                rolesFields
              )}
              className="absolute -top-2 -right-2 z-10 bg-blue-500 hover:bg-blue-600"
            />
          )}
          {roles.map((role, index) => (
            <div
              key={index}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold slide-in-left"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <span className="mono text-orange-500 mr-2 sm:mr-3">{">"}</span>
              <span className="text-gray-200">{role}</span>
            </div>
          ))}
        </div>
        <div
          className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8 slide-in-right relative"
          style={{ animationDelay: "0.4s" }}
        >
          {isAuthenticated && (
            <div className="absolute -top-2 -right-2 z-10 flex gap-2">
              <EditButton
                onClick={() => openEditModal(
                  { key: "home-intro-resume", page: "home", section: "intro", content: resumeLink, type: "text" },
                  textFields
                )}
                className="bg-blue-500 hover:bg-blue-600"
              />
              <EditButton
                onClick={() => openEditModal(
                  { key: "home-intro-linkedin", page: "home", section: "intro", content: linkedinLink, type: "text" },
                  textFields
                )}
                className="bg-blue-500 hover:bg-blue-600"
              />
              <EditButton
                onClick={() => openEditModal(
                  { key: "home-intro-github", page: "home", section: "intro", content: githubLink, type: "text" },
                  textFields
                )}
                className="bg-blue-500 hover:bg-blue-600"
              />
            </div>
          )}
          <Link
            rel="noopener noreferrer"
            href={resumeLink}
            target="_blank"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-all duration-300 hover-lift glow-orange-hover text-sm sm:text-base"
          >
            View Resume
          </Link>
          <Link
            rel="noopener noreferrer"
            href={linkedinLink}
            target="_blank"
            className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift text-sm sm:text-base"
          >
            LinkedIn
          </Link>
          <Link
            rel="noopener noreferrer"
            href={githubLink}
            target="_blank"
            className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift text-sm sm:text-base"
          >
            GitHub
          </Link>
        </div>
      </div>
      {EditModalComponent}
    </>
  );
}

