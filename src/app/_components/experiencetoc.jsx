"use client";

import { useEffect, useMemo, useState } from "react";

export default function ExperienceToc({ sections = [] }) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");

  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);

  useEffect(() => {
    if (sectionIds.length === 0) return;
    const stickyOffset = 190;

    const updateActiveSection = () => {
      const sectionsWithTop = sectionIds
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) return null;
          return { id, top: element.getBoundingClientRect().top };
        })
        .filter(Boolean);

      if (sectionsWithTop.length === 0) return;

      const current = [...sectionsWithTop]
        .reverse()
        .find((section) => section.top <= stickyOffset);

      if (current) {
        setActiveSection(current.id);
        return;
      }

      setActiveSection(sectionsWithTop[0].id);
    };

    let rafId = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        updateActiveSection();
        rafId = null;
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, [sectionIds]);

  return (
    <div className="sticky top-20 z-30 w-full max-w-7xl mx-auto px-6 mb-8">
      <nav className="glass rounded-2xl p-3">
        <ul className="flex flex-wrap gap-2 justify-center">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-gray-300 hover:text-orange-400 hover:bg-orange-500/10"
                  }`}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
