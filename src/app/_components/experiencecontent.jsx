"use client";

import { useState, useEffect } from "react";
import SkillProficiency from "./skillproficiency";
import AnimatedEducationCard from "./animatededucationcard";
import { useAuth } from "./authprovider";
import { useEditable } from "./useeditable";
import EditButton from "./editbutton";
import DeleteButton from "./deletebutton";
import AddButton from "./addbutton";

// Fallback mock data
const mockSkills = {
  languages: [
    {
      name: "Python",
      description:
        "Advanced Python with data structures, algorithms, and web development.",
    },
    {
      name: "JavaScript",
      description:
        "Expert-level for both frontend and backend development with modern frameworks.",
    },
    {
      name: "Java",
      description:
        "Strong object-oriented programming skills for application development.",
    },
    {
      name: "C#",
      description:
        "Extensive Unity game development experience, placed top 10 nationally in competitions.",
    },
    {
      name: "C/C++",
      description:
        "System-level programming and performance-critical applications.",
    },
    {
      name: "TypeScript",
      description: "Type-safe JavaScript for modern web applications.",
    },
    {
      name: "SQL",
      description:
        "Database design, query optimization, and management systems.",
    },
  ],
  frameworks: [
    {
      name: "React",
      description:
        "Building modern, responsive user interfaces with hooks and state management.",
    },
    {
      name: "Next.js",
      description:
        "Full-stack React framework for production applications with SSR.",
    },
    {
      name: "Node.js",
      description:
        "Backend development with Express.js, RESTful APIs, and authentication.",
    },
    {
      name: "Unity",
      description: "Game development engine, created multiple published games.",
    },
    {
      name: "Tailwind CSS",
      description: "Utility-first CSS framework for rapid responsive design.",
    },
  ],
  apis: [
    {
      name: "REST APIs",
      description:
        "Design and implementation of RESTful services with Express.js and FastAPI.",
    },
    {
      name: "GraphQL",
      description:
        "Query language for APIs with Apollo Client and schema design.",
    },
    {
      name: "WebSockets",
      description:
        "Real-time communication for live updates and interactive features.",
    },
  ],
  tools: [
    {
      name: "Git/GitHub",
      description:
        "Version control, branching strategies, and collaborative development.",
    },
    {
      name: "Docker",
      description:
        "Containerization for application deployment and orchestration.",
    },
    {
      name: "AWS",
      description:
        "Cloud services including EC2, S3, Lambda for scalable applications.",
    },
    {
      name: "CI/CD",
      description:
        "Continuous integration and deployment pipelines with automated testing.",
    },
  ],
};

const mockEducation = {
  coursework: [
    {
      name: "Data Structures & Algorithms",
      description:
        "Advanced study of trees, graphs, hash tables, and algorithm optimization techniques.",
      category: "coursework",
    },
    {
      name: "Computer Systems",
      description:
        "Low-level system programming, memory management, and computer architecture.",
      category: "coursework",
    },
    {
      name: "Database Systems",
      description:
        "Relational database design, SQL optimization, and database administration.",
      category: "coursework",
    },
  ],
  certifications: [
    {
      name: "CS50x - Harvard University",
      description:
        "Introduction to Computer Science covering algorithms, data structures, and multiple languages.",
      category: "certifications",
      link: "#",
      linkText: "View Certificate",
    },
    {
      name: "Computer Science Principles",
      description:
        "Comprehensive certification covering fundamental computer science concepts.",
      category: "certifications",
      link: "#",
      linkText: "View Certificate",
    },
  ],
  courses: [
    {
      name: "The Complete Web Development Bootcamp",
      description:
        "Full-stack web development: HTML, CSS, JavaScript, React, Node.js, and databases.",
      category: "courses",
      link: "#",
      linkText: "View Course",
    },
  ],
  awards: [
    {
      name: "SkillsUSA - National Top 10",
      description:
        "Placed top 10 nationally in game development competition two consecutive years.",
      category: "awards",
      link: "#",
      linkText: "Learn More",
    },
    {
      name: "State Champion - Game Development",
      description:
        "Won state championship in SkillsUSA game development competition.",
      category: "awards",
      link: "#",
      linkText: "Learn More",
    },
  ],
};

export default function ExperienceContent() {
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState("languages");
  const [activeEduCategory, setActiveEduCategory] = useState("coursework");
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [skillsRes, educationRes] = await Promise.all([
        fetch("/api/skillshandler"),
        fetch("/api/educationhandler"),
      ]);

      if (skillsRes.ok) {
        const data = await skillsRes.json();
        setSkills(data.data || []);
      }
      if (educationRes.ok) {
        const data = await educationRes.json();
        // Convert link_text to linkText for compatibility
        const converted = (data.data || []).map((edu) => ({
          ...edu,
          linkText: edu.link_text || edu.linkText,
        }));
        setEducation(converted);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    openEditModal: openSkillEdit,
    handleDelete: handleSkillDelete,
    EditModalComponent: SkillEditModal,
  } = useEditable("skill", fetchData);
  const {
    openEditModal: openEduEdit,
    handleDelete: handleEduDelete,
    EditModalComponent: EduEditModal,
  } = useEditable("education", fetchData);

  const allSkills = skills;
  const allEducation = education;

  const categoryConfig = {
    languages: { icon: "💻", label: "Languages" },
    frameworks: { icon: "⚡", label: "Frameworks" },
    apis: { icon: "🔌", label: "APIs" },
    tools: { icon: "🛠️", label: "Tools" },
  };

  const eduCategoryConfig = {
    coursework: { icon: "📚", label: "Coursework" },
    certifications: { icon: "🏆", label: "Certifications" },
    courses: { icon: "💻", label: "Courses" },
    awards: { icon: "⭐", label: "Awards" },
  };

  const skillFields = [
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: [
        { value: "languages", label: "Languages" },
        { value: "frameworks", label: "Frameworks" },
        { value: "apis", label: "APIs" },
        { value: "tools", label: "Tools" },
      ],
    },
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "proficiency",
      label: "Proficiency (%)",
      type: "number",
      required: true,
      min: 0,
      max: 100,
    },
  ];

  const educationFields = [
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: [
        { value: "coursework", label: "Coursework" },
        { value: "certifications", label: "Certifications" },
        { value: "courses", label: "Courses" },
        { value: "awards", label: "Awards" },
      ],
    },
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    { name: "link", label: "Link", type: "text", required: false },
    { name: "linkText", label: "Link Text", type: "text", required: false },
  ];

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {SkillEditModal}
      {EduEditModal}
      {/* Skills Section */}
      <section
        id="skills"
        className="w-full max-w-7xl mx-auto px-6 py-16 sm:py-20 min-h-[1vh] relative"
      >
        {isAuthenticated && (
          <div className="absolute top-6 right-6 z-10">
            <AddButton
              onClick={() => openSkillEdit(null, skillFields)}
              label="Add Skill"
            />
          </div>
        )}
        <div className="text-center mb-10 sm:mb-12 fade-in">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 uppercase tracking-wider">
            <span className="gradient-text">Technical Skills</span>
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 sm:mb-12">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30"
                    : "glass text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 hover:scale-105"
                }`}
              >
                <span className="text-xl">{config.icon}</span>
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Proficiency Graph - Condensed Grid with Fixed Height */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto"
          style={{ minHeight: "700px", alignContent: "start" }}
        >
          {allSkills.filter((s) => s.category === activeCategory).length ===
          0 ? (
            <div className="col-span-2 text-center text-gray-400 py-12">
              No{" "}
              {categoryConfig[activeCategory]?.label.toLowerCase() || "skills"}{" "}
              available. {isAuthenticated && "Add your first skill!"}
            </div>
          ) : (
            allSkills
              .filter((s) => s.category === activeCategory)
              .map((skill, index) => (
                <div key={skill.id || index} className="relative">
                  {isAuthenticated && (
                    <>
                      <EditButton
                        onClick={() => openSkillEdit(skill, skillFields)}
                        className="absolute top-2 right-2 z-10"
                      />
                      <DeleteButton
                        onClick={() => handleSkillDelete(skill.id, skill.name)}
                        className="absolute top-2 left-2 z-10"
                      />
                    </>
                  )}
                  <SkillProficiency
                    skill={skill}
                    index={index}
                    category={activeCategory}
                  />
                </div>
              ))
          )}
        </div>
      </section>

      {/* Education Section */}
      <section
        id="education"
        className="w-full max-w-7xl mx-auto px-6 py-16 sm:py-20 relative"
      >
        {isAuthenticated && (
          <div className="absolute top-6 right-6 z-10">
            <AddButton
              onClick={() => openEduEdit(null, educationFields)}
              label="Add Education"
            />
          </div>
        )}
        <div className="text-center mb-10 sm:mb-12 fade-in">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 uppercase tracking-wider">
            <span className="gradient-text">Education</span>
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
        </div>

        {/* Education Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 sm:mb-12">
          {Object.entries(eduCategoryConfig).map(([key, config]) => {
            const isActive = activeEduCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveEduCategory(key)}
                className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30"
                    : "glass text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 hover:scale-105"
                }`}
              >
                <span className="text-xl">{config.icon}</span>
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Education Grid with Fixed Height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {allEducation.filter((e) => e.category === activeEduCategory)
            .length === 0 ? (
            <div className="col-span-3 text-center text-gray-400 py-12">
              No{" "}
              {eduCategoryConfig[activeEduCategory]?.label.toLowerCase() ||
                "education"}{" "}
              available. {isAuthenticated && "Add your first education entry!"}
            </div>
          ) : (
            allEducation
              .filter((e) => e.category === activeEduCategory)
              .map((item, index) => (
                <div key={item.id || index} className="relative">
                  {isAuthenticated && (
                    <>
                      <EditButton
                        onClick={() => openEduEdit(item, educationFields)}
                        className="absolute top-2 right-2 z-10"
                      />
                      <DeleteButton
                        onClick={() => handleEduDelete(item.id, item.name)}
                        className="absolute top-2 left-2 z-10"
                      />
                    </>
                  )}
                  <AnimatedEducationCard item={item} index={index} />
                </div>
              ))
          )}
        </div>
      </section>
    </>
  );
}
