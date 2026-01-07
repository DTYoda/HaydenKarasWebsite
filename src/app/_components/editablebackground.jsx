"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import EditButton from "./editbutton";

export default function EditableBackground() {
  const { isAuthenticated } = useAuth();
  const [title, setTitle] = useState("My Journey");
  const [subtitle, setSubtitle] = useState("Pursuing Growth and Knowledge");
  const [paragraph1, setParagraph1] = useState("My journey into the world of technology began with a fascination for how things work and a relentless curiosity to dig deeper. Starting with the idea of creating Minecraft mods in third grade, I started with game development with <span className=\"text-orange-500 font-semibold\">Scratch</span> and then slowly learned new technologies, languages, and frameworks. Entering high school, I began entering technology classes and doing various projects. This resulted in entering the <span className=\"text-orange-500 font-semibold\">SkillsUSA game development competition</span>, winning states two years in a row and placing top 10 nationally twice.");
  const [paragraph2, setParagraph2] = useState("Aside from Game Development, I also explored full-stack web development through college courses and online courses like <span className=\"text-orange-500 font-semibold\">CS50x</span>. I presented one of my earliest web projects at the University of Rhode Island's Computer Science Summit. I also was the captain of my school's math team throughout high school, competing there as well, learning advanced math topics as well as leadership and teamwork skills.");
  const { openEditModal, EditModalComponent } = useEditable("pagecontent", () => {
    fetchContent();
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/pagecontent?page=about&section=background");
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          data.data.forEach(item => {
            if (item.key === "about-background-title") setTitle(item.content);
            else if (item.key === "about-background-subtitle") setSubtitle(item.content);
            else if (item.key === "about-background-paragraph1") setParagraph1(item.content);
            else if (item.key === "about-background-paragraph2") setParagraph2(item.content);
          });
        }
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const ImageStyle = {
    filter: "grayscale(0%)",
  };

  const textFields = [
    { name: "content", label: "Content", type: "textarea", required: true },
  ];

  return (
    <>
      <section className="min-h-screen w-full max-w-7xl mx-auto px-6 py-20 flex flex-col justify-center relative">
        {isAuthenticated && (
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <EditButton
              onClick={() => openEditModal(
                { key: "about-background-title", page: "about", section: "background", content: title, type: "text" },
                textFields
              )}
              className="bg-blue-500 hover:bg-blue-600"
            />
          </div>
        )}
        <div className="text-center mb-16 fade-in relative">
          {isAuthenticated && (
            <EditButton
              onClick={() => openEditModal(
                { key: "about-background-subtitle", page: "about", section: "background", content: subtitle, type: "text" },
                textFields
              )}
              className="absolute top-0 right-0 bg-blue-500 hover:bg-blue-600"
            />
          )}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 uppercase tracking-wider">
            <span className="gradient-text">{title}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 font-light">
            {subtitle}
          </p>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-12 items-center">
          <div className="md:w-1/2 w-full space-y-6 slide-in-left">
            <div className="glass rounded-2xl p-8 hover-lift relative">
              {isAuthenticated && (
                <EditButton
                  onClick={() => openEditModal(
                    { key: "about-background-paragraph1", page: "about", section: "background", content: paragraph1, type: "html" },
                    textFields
                  )}
                  className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600"
                />
              )}
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300" dangerouslySetInnerHTML={{ __html: paragraph1 }} />
            </div>
            <div className="glass rounded-2xl p-8 hover-lift relative">
              {isAuthenticated && (
                <EditButton
                  onClick={() => openEditModal(
                    { key: "about-background-paragraph2", page: "about", section: "background", content: paragraph2, type: "html" },
                    textFields
                  )}
                  className="absolute top-2 right-2 bg-blue-500 hover:bg-blue-600"
                />
              )}
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300" dangerouslySetInnerHTML={{ __html: paragraph2 }} />
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

