"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import EditButton from "./editbutton";

export default function EditableBackground({ initialData }) {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState(initialData || {});
  const { openEditModal, EditModalComponent } = useEditable(
    "pagecontent",
    (result) => {
      const item = result?.data;
      if (!item?.key) return;
      setContent((prev) => {
        const next = { ...prev };
        if (item.key === "about-background-title") next.title = item.content;
        else if (item.key === "about-background-subtitle") next.subtitle = item.content;
        else if (item.key === "about-background-paragraph1") next.paragraph1 = item.content;
        else if (item.key === "about-background-paragraph2") next.paragraph2 = item.content;
        return next;
      });
    }
  );

  useEffect(() => {
    setContent(initialData || {});
  }, [initialData]);

  const ImageStyle = {
    filter: "grayscale(0%)",
  };

  const textFields = [
    { name: "content", label: "Content", type: "textarea", required: true },
  ];

  const title = content.title || "";
  const subtitle = content.subtitle || "";
  const paragraph1 = content.paragraph1 || "";
  const paragraph2 = content.paragraph2 || "";

  return (
    <>
      <section className="min-h-screen w-full max-w-7xl mx-auto px-6 py-20 flex flex-col justify-center relative">
        <div className="text-center mb-16 fade-in relative">
          {isAuthenticated && (
            <EditButton
              onClick={() =>
                openEditModal(
                  {
                    key: "about-background-title",
                    page: "about",
                    section: "background",
                    content: title,
                    type: "text",
                  },
                  textFields
                )
              }
            />
          )}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 uppercase tracking-wider">
            <span className="gradient-text">{title || "My Journey"}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 font-light relative">
            {isAuthenticated && (
              <EditButton
                onClick={() =>
                  openEditModal(
                    {
                      key: "about-background-subtitle",
                      page: "about",
                      section: "background",
                      content: subtitle,
                      type: "text",
                    },
                    textFields
                  )
                }
              />
            )}
            {subtitle}
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-12 items-center">
          <div className="md:w-1/2 w-full space-y-6 slide-in-left">
            <div className="glass rounded-2xl p-8 hover-lift relative">
              {isAuthenticated && (
                <EditButton
                  onClick={() =>
                    openEditModal(
                      {
                        key: "about-background-paragraph1",
                        page: "about",
                        section: "background",
                        content: paragraph1,
                        type: "html",
                      },
                      textFields
                    )
                  }
                />
              )}
              <p
                className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300"
                dangerouslySetInnerHTML={{ __html: paragraph1 }}
              />
            </div>
            <div className="glass rounded-2xl p-8 hover-lift relative">
              {isAuthenticated && (
                <EditButton
                  onClick={() =>
                    openEditModal(
                      {
                        key: "about-background-paragraph2",
                        page: "about",
                        section: "background",
                        content: paragraph2,
                        type: "html",
                      },
                      textFields
                    )
                  }
                />
              )}
              <p
                className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300"
                dangerouslySetInnerHTML={{ __html: paragraph2 }}
              />
            </div>
          </div>
          <div className="md:w-1/2 flex items-center justify-center w-full slide-in-right">
            <div className="relative group w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative border-4 border-orange-500/50 rounded-2xl overflow-hidden hover-lift glow-orange-hover">
                <Image
                  src="/SkillsUSAImage.jpeg"
                  height={500}
                  width={500}
                  alt="Hayden Karas at SkillsUSA"
                  style={ImageStyle}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {EditModalComponent}
    </>
  );
}
