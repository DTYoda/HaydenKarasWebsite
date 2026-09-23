"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import EditButton from "./editbutton";

export default function EditableStartQuote({
  quote: initialQuote,
  author: initialAuthor,
  links: initialLinks,
  page,
  section,
}) {
  const { isAuthenticated } = useAuth();
  const [quote, setQuote] = useState(initialQuote || "");
  const [author, setAuthor] = useState(initialAuthor || "");
  const [links, setLinks] = useState(initialLinks || []);
  const { openEditModal, EditModalComponent } = useEditable(
    "pagecontent",
    (result) => {
      const item = result?.data;
      if (!item?.key) return;
      if (item.key === `${page}-${section}-quote`) setQuote(item.content);
      if (item.key === `${page}-${section}-author`) setAuthor(item.content);
      if (item.key === `${page}-${section}-links`) {
        try {
          setLinks(JSON.parse(item.content));
        } catch {
          setLinks(initialLinks || []);
        }
      }
    }
  );

  useEffect(() => {
    setQuote(initialQuote || "");
    setAuthor(initialAuthor || "");
    setLinks(initialLinks || []);
  }, [initialQuote, initialAuthor, initialLinks]);

  const quoteFields = [
    { name: "content", label: "Quote", type: "textarea", required: true },
  ];
  const authorFields = [
    { name: "content", label: "Author", type: "text", required: true },
  ];
  const linksFields = [
    {
      name: "content",
      label: "Links",
      type: "pairlist",
      required: false,
      helpText: "One per line: url | label",
    },
  ];

  return (
    <>
      <div className="max-w-6xl w-full px-6 grow flex flex-col justify-start pt-32 relative">
        <div className="relative z-10 fade-in py-8">
          <div className="mb-6 sm:mb-8 relative">
            {isAuthenticated && (
              <EditButton
                title="Edit page quote"
                onClick={() =>
                  openEditModal(
                    {
                      key: `${page}-${section}-quote`,
                      page,
                      section,
                      content: quote,
                      type: "text",
                    },
                    quoteFields,
                    "Edit Page Quote"
                  )
                }
              />
            )}
            <span className="mono text-orange-500 text-xl sm:text-2xl md:text-3xl">
              {'"'}
            </span>
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight inline">
              {quote}
            </h1>
            <span className="mono text-orange-500 text-xl sm:text-2xl md:text-3xl">
              {'"'}
            </span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-6 sm:mt-8 mb-6 sm:mb-8 relative">
            {isAuthenticated && (
              <EditButton
                title="Edit quote author"
                onClick={() =>
                  openEditModal(
                    {
                      key: `${page}-${section}-author`,
                      page,
                      section,
                      content: author,
                      type: "text",
                    },
                    authorFields,
                    "Edit Quote Author"
                  )
                }
              />
            )}
            <span className="mono text-orange-500 mr-2 sm:mr-3">{">"}</span>
            <span className="text-gray-300 font-medium">{author}</span>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8 relative">
            {isAuthenticated && (
              <EditButton
                title="Edit quote links"
                onClick={() =>
                  openEditModal(
                    {
                      key: `${page}-${section}-links`,
                      page,
                      section,
                      content: JSON.stringify(links),
                      type: "json",
                    },
                    linksFields,
                    "Edit Quote Links"
                  )
                }
              />
            )}
            {links.map((link, id) => (
              <Link
                key={id}
                className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift text-sm sm:text-base"
                target={link[0][0] != "#" ? "_blank" : ""}
                href={link[0]}
              >
                {link[1]}
              </Link>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-8 h-8 text-orange-500/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
      {EditModalComponent}
    </>
  );
}
