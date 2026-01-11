"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import EditButton from "./editbutton";

export default function EditableContactContent() {
  const { isAuthenticated } = useAuth();
  const [availableFor, setAvailableFor] = useState([
    "Internships and full-time opportunities",
    "Game development projects",
    "Web development collaborations",
    "Research opportunities",
    "Open-source contributions",
  ]);
  const [links, setLinks] = useState([
    { url: "https://www.linkedin.com/in/haydenkaras/", label: "LinkedIn", icon: "💼" },
    { url: "https://github.com/DTYoda", label: "GitHub", icon: "💻" },
    { url: "/resume.pdf", label: "Resume", icon: "📄" },
  ]);
  const [email, setEmail] = useState("hkaras1121@gmail.com");
  const { openEditModal, EditModalComponent } = useEditable("pagecontent", () => {
    fetchContent();
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/pagecontent?page=contact&section=content");
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const availableForData = data.data.find(
            (c) => c.key === "contact-content-availableFor"
          );
          const linksData = data.data.find(
            (c) => c.key === "contact-content-links"
          );
          const emailData = data.data.find(
            (c) => c.key === "contact-content-email"
          );

          if (availableForData) {
            try {
              setAvailableFor(JSON.parse(availableForData.content));
            } catch (e) {
              console.error("Error parsing availableFor:", e);
            }
          }
          if (linksData) {
            try {
              setLinks(JSON.parse(linksData.content));
            } catch (e) {
              console.error("Error parsing links:", e);
            }
          }
          if (emailData) {
            setEmail(emailData.content);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching contact content:", error);
    }
  };

  const availableForFields = [
    {
      name: "content",
      label: "Available For (JSON array of strings)",
      type: "textarea",
      required: true,
    },
  ];

  const linksFields = [
    {
      name: "content",
      label: "Links (JSON array of {url, label, icon} objects)",
      type: "textarea",
      required: true,
    },
  ];

  const emailFields = [
    { name: "content", label: "Email", type: "text", required: true },
  ];

  return (
    <>
      <section className="w-full mb-20 fade-in relative">
        {isAuthenticated && (
          <div className="absolute top-0 right-0 flex gap-2 z-10">
            <EditButton
              onClick={() =>
                openEditModal(
                  {
                    key: "contact-content-availableFor",
                    page: "contact",
                    section: "content",
                    content: JSON.stringify(availableFor, null, 2),
                    type: "json",
                  },
                  availableForFields
                )
              }
              className="bg-blue-500 hover:bg-blue-600"
            />
          </div>
        )}

        <div className="glass rounded-2xl p-8 border border-orange-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-200 mb-4">I'm Available For</h3>
              <ul className="space-y-3">
                {availableFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-orange-500 text-xl mt-1">•</span>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              {isAuthenticated && (
                <div className="absolute top-0 right-0 flex gap-2 z-10">
                  <EditButton
                    onClick={() =>
                      openEditModal(
                        {
                          key: "contact-content-links",
                          page: "contact",
                          section: "content",
                          content: JSON.stringify(links, null, 2),
                          type: "json",
                        },
                        linksFields
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-600"
                  />
                  <EditButton
                    onClick={() =>
                      openEditModal(
                        {
                          key: "contact-content-email",
                          page: "contact",
                          section: "content",
                          content: email,
                          type: "text",
                        },
                        emailFields
                      )
                    }
                    className="bg-blue-500 hover:bg-blue-600"
                  />
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-200 mb-4">Quick Links</h3>
              <div className="space-y-3">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    target={link.url.startsWith("http") ? "_blank" : undefined}
                    rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 transition-all group"
                  >
                    <span className="text-2xl">{link.icon || "🔗"}</span>
                    <span className="text-gray-300 group-hover:text-orange-500 transition-colors">
                      {link.label}
                    </span>
                    <span className="ml-auto text-orange-500">→</span>
                  </Link>
                ))}
                <Link
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 transition-all group"
                >
                  <span className="text-2xl">📧</span>
                  <span className="text-gray-300 group-hover:text-orange-500 transition-colors">
                    {email}
                  </span>
                  <span className="ml-auto text-orange-500">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {EditModalComponent}
    </>
  );
}

