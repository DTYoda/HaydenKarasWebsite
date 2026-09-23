"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import EditButton from "./editbutton";

export default function EditableContactContent({ initialData }) {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState(initialData || {});
  const { openEditModal, EditModalComponent } = useEditable(
    "pagecontent",
    (result) => {
      const item = result?.data;
      if (!item?.key) return;
      setContent((prev) => {
        const next = { ...prev };
        if (item.key === "contact-content-availableFor") {
          try {
            next.availableFor = JSON.parse(item.content);
          } catch {
            next.availableFor = [];
          }
        } else if (item.key === "contact-content-links") {
          try {
            next.links = JSON.parse(item.content);
          } catch {
            next.links = [];
          }
        } else if (item.key === "contact-content-email") {
          next.email = item.content;
        }
        return next;
      });
    }
  );

  useEffect(() => {
    setContent(initialData || {});
  }, [initialData]);

  const availableFor = Array.isArray(content.availableFor) ? content.availableFor : [];
  const links = Array.isArray(content.links) ? content.links : [];
  const email = content.email || "";

  const availableForFields = [
    {
      name: "content",
      label: "Available For",
      type: "stringlist",
      required: true,
      helpText: "One item per line",
    },
  ];

  const linksFields = [
    {
      name: "content",
      label: "Links",
      type: "pairlist",
      required: true,
      helpText: "One per line: url | label",
    },
  ];

  const emailFields = [
    { name: "content", label: "Email", type: "text", required: true },
  ];

  const displayLinks = links.map((link) => {
    if (Array.isArray(link)) {
      return { url: link[0], label: link[1], icon: "🔗" };
    }
    return {
      url: link.url || link.link || "",
      label: link.label || link.title || "",
      icon: link.icon || "🔗",
    };
  });

  return (
    <>
      <section className="w-full mb-20 fade-in relative">
        <div className="glass rounded-2xl p-8 border border-orange-500/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              {isAuthenticated && (
                <EditButton
                  title="Edit availability list"
                  onClick={() =>
                    openEditModal(
                      {
                        key: "contact-content-availableFor",
                        page: "contact",
                        section: "content",
                        content: JSON.stringify(availableFor),
                        type: "json",
                      },
                      availableForFields,
                      "Edit Availability List"
                    )
                  }
                />
              )}
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
                    title="Edit contact links"
                    onClick={() =>
                      openEditModal(
                        {
                          key: "contact-content-links",
                          page: "contact",
                          section: "content",
                          content: JSON.stringify(
                            displayLinks.map((link) => [link.url, link.label])
                          ),
                          type: "json",
                        },
                        linksFields,
                        "Edit Contact Links"
                      )
                    }
                  />
                  <EditButton
                    title="Edit contact email"
                    onClick={() =>
                      openEditModal(
                        {
                          key: "contact-content-email",
                          page: "contact",
                          section: "content",
                          content: email,
                          type: "text",
                        },
                        emailFields,
                        "Edit Contact Email"
                      )
                    }
                  />
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-200 mb-4">Quick Links</h3>
              <div className="space-y-3">
                {displayLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    target={link.url.startsWith("http") ? "_blank" : undefined}
                    rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 transition-all group"
                  >
                    <span className="text-2xl">{link.icon}</span>
                    <span className="text-gray-300 group-hover:text-orange-500 transition-colors">
                      {link.label}
                    </span>
                    <span className="ml-auto text-orange-500">→</span>
                  </Link>
                ))}
                {email ? (
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
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>
      {EditModalComponent}
    </>
  );
}
