"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import EditButton from "./editbutton";

export default function EditableHomeIntro({ initialData }) {
  const { isAuthenticated } = useAuth();
  const [intro, setIntro] = useState(initialData || {});
  const { openEditModal, EditModalComponent } = useEditable(
    "pagecontent",
    (result) => {
      const item = result?.data;
      if (!item?.key) return;
      setIntro((prev) => {
        const next = { ...prev };
        if (item.key === "home-intro-text") next.introText = item.content;
        else if (item.key === "home-intro-name") next.name = item.content;
        else if (item.key === "home-intro-roles") {
          try {
            next.roles = JSON.parse(item.content);
          } catch {
            next.roles = [];
          }
        } else if (item.key === "home-intro-resume") next.resumeLink = item.content;
        else if (item.key === "home-intro-linkedin") next.linkedinLink = item.content;
        else if (item.key === "home-intro-github") next.githubLink = item.content;
        return next;
      });
    }
  );

  useEffect(() => {
    setIntro(initialData || {});
  }, [initialData]);

  const textFields = [
    { name: "content", label: "Content", type: "text", required: true },
  ];
  const rolesFields = [
    {
      name: "content",
      label: "Roles",
      type: "stringlist",
      required: true,
      helpText: "One role per line",
    },
  ];

  const introText = intro.introText || "";
  const name = intro.name || "";
  const roles = Array.isArray(intro.roles) ? intro.roles : [];
  const resumeLink = intro.resumeLink || "";
  const linkedinLink = intro.linkedinLink || "";
  const githubLink = intro.githubLink || "";

  return (
    <>
      <div
        className="relative z-10 fade-in py-8"
        style={{ animationDelay: "0s" }}
      >
        <div className="mb-4 sm:mb-6 relative">
          {isAuthenticated && (
            <EditButton
              title="Edit greeting text"
              onClick={() =>
                openEditModal(
                  {
                    key: "home-intro-text",
                    page: "home",
                    section: "intro",
                    content: introText,
                    type: "text",
                  },
                  textFields,
                  "Edit Home Greeting"
                )
              }
            />
          )}
          {introText ? (
            <span className="mono text-orange-500 text-base sm:text-lg font-medium">
              {introText}
            </span>
          ) : isAuthenticated ? (
            <span className="text-gray-500 text-sm">Add intro text</span>
          ) : null}
        </div>
        <h1 className="font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 sm:mb-6 leading-tight relative">
          {isAuthenticated && (
            <EditButton
              title="Edit display name"
              onClick={() =>
                openEditModal(
                  {
                    key: "home-intro-name",
                    page: "home",
                    section: "intro",
                    content: name,
                    type: "text",
                  },
                  textFields,
                  "Edit Display Name"
                )
              }
            />
          )}
          <span className="gradient-text">{name}</span>
        </h1>
        <div className="space-y-2 sm:space-y-4 mb-8 sm:mb-12 relative">
          {isAuthenticated && (
            <EditButton
              title="Edit roles"
              onClick={() =>
                openEditModal(
                  {
                    key: "home-intro-roles",
                    page: "home",
                    section: "intro",
                    content: JSON.stringify(roles),
                    type: "json",
                  },
                  rolesFields,
                  "Edit Roles"
                )
              }
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
                title="Edit resume link"
                onClick={() =>
                  openEditModal(
                    {
                      key: "home-intro-resume",
                      page: "home",
                      section: "intro",
                      content: resumeLink,
                      type: "text",
                    },
                    textFields,
                    "Edit Resume Link"
                  )
                }
              />
              <EditButton
                title="Edit LinkedIn link"
                onClick={() =>
                  openEditModal(
                    {
                      key: "home-intro-linkedin",
                      page: "home",
                      section: "intro",
                      content: linkedinLink,
                      type: "text",
                    },
                    textFields,
                    "Edit LinkedIn Link"
                  )
                }
              />
              <EditButton
                title="Edit GitHub link"
                onClick={() =>
                  openEditModal(
                    {
                      key: "home-intro-github",
                      page: "home",
                      section: "intro",
                      content: githubLink,
                      type: "text",
                    },
                    textFields,
                    "Edit GitHub Link"
                  )
                }
              />
            </div>
          )}
          {resumeLink ? (
            <Link
              rel="noopener noreferrer"
              href={resumeLink}
              target="_blank"
              className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift text-sm sm:text-base"
            >
              View Resume
            </Link>
          ) : null}
          {linkedinLink ? (
            <Link
              rel="noopener noreferrer"
              href={linkedinLink}
              target="_blank"
              className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift text-sm sm:text-base"
            >
              LinkedIn
            </Link>
          ) : null}
          {githubLink ? (
            <Link
              rel="noopener noreferrer"
              href={githubLink}
              target="_blank"
              className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift text-sm sm:text-base"
            >
              GitHub
            </Link>
          ) : null}
        </div>
      </div>
      {EditModalComponent}
    </>
  );
}
