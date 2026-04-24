import Navigation from "./_components/navigation";
import EditableQuickStats from "./_components/editablequickstats";
import EditableLatestProjects from "./_components/editablelatestprojects";
import EditableTopSkills from "./_components/editabletopskills";
import AboutPreview from "./_components/aboutpreview";
import ContactPreview from "./_components/contactpreview";
import EditableHomeIntro from "./_components/editablehomeintro";
import { createServerClient } from "@/lib/supabase";
import { getTagMeta } from "@/lib/tags";

export const metadata = {
  title: "Hayden Karas",
  description:
    "Efficient software developer and passionate learner, Hayden Karas, showcases innovation in computer science, game development, and digital solutions. Explore a hub of creativity, leadership, and impactful projects.",
};

export default async function Home() {
  const supabase = createServerClient();

  // Fetch all data server-side
  let projects = [];
  let quickStats = [];
  let topSkills = [];
  let topSkillsCount = 8;
  let topSkillsAllowedCategories = [
    "programming-language",
    "frontend",
    "backend",
    "game-dev",
    "tools",
    "soft-skills",
    "mathematics",
    "computer-science",
    "other",
  ];
  let homeIntro = {
    introText: "Hi, my name is",
    name: "Hayden Karas",
    roles: ["Coder", "Developer", "Mathematician"],
    resumeLink: "/resume.pdf",
    linkedinLink: "https://www.linkedin.com/in/haydenkaras/",
    githubLink: "https://github.com/DTYoda",
  };

  try {
    // Fetch projects
    const { data: projectsData, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .order("date", { ascending: false });

    if (!projectsError && projectsData) {
      projects = projectsData.map((p) => ({
        id: p.id,
        urlTitle: p.url_title,
        title: p.title,
        descriptions: p.descriptions,
        images: p.images,
        links: p.links,
        technologies: p.technologies,
        type: p.type,
        date: p.date,
      }));
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
  }

  try {
    // Fetch quick stats
    const { data: statsData, error: statsError } = await supabase
      .from("quick_stats")
      .select("*")
      .order("order", { ascending: true });

    if (!statsError && statsData) {
      quickStats = statsData;
    }
  } catch (error) {
    console.error("Error fetching quick stats:", error);
  }

  try {
    const { data: topSkillsSettingsData, error: topSkillsSettingsError } = await supabase
      .from("page_content")
      .select("*")
      .eq("page", "home")
      .eq("section", "top-skills");

    if (!topSkillsSettingsError && topSkillsSettingsData) {
      const countSetting = topSkillsSettingsData.find((item) => item.key === "top-skills-count");
      const categoriesSetting = topSkillsSettingsData.find(
        (item) => item.key === "top-skills-categories"
      );

      if (countSetting?.content) {
        topSkillsCount = parseInt(countSetting.content) || 8;
      }

      if (categoriesSetting?.content) {
        try {
          const parsed = JSON.parse(categoriesSetting.content);
          if (Array.isArray(parsed) && parsed.length > 0) {
            topSkillsAllowedCategories = parsed
              .map((value) => String(value || "").trim())
              .filter(Boolean);
          }
        } catch {
          // Keep defaults
        }
      }
    }
  } catch (error) {
    console.error("Error fetching top skills settings:", error);
  }

  try {
    // Fetch top skills and prioritize years of experience for ranking.
    const { data: skillsData, error: skillsError } = await supabase
      .from("skills")
      .select("*");

    if (!skillsError && skillsData) {
      // Sort by years descending and take first 8 for quick recruiter scan.
      topSkills = skillsData
        .sort((a, b) => {
          const yearsDiff = (b.years_experience || 0) - (a.years_experience || 0);
          if (yearsDiff !== 0) return yearsDiff;
          return String(a.name || "").localeCompare(String(b.name || ""));
        })
        .filter((skill) => {
          const meta = getTagMeta(skill.name, skill.category);
          return topSkillsAllowedCategories.includes(meta.category || "other");
        })
        .slice(0, topSkillsCount);
    }
  } catch (error) {
    console.error("Error fetching top skills:", error);
  }

  try {
    // Fetch home intro content
    const { data: introData, error: introError } = await supabase
      .from("page_content")
      .select("*")
      .eq("page", "home")
      .eq("section", "intro");

    if (!introError && introData) {
      introData.forEach((item) => {
        if (item.key === "home-intro-text") homeIntro.introText = item.content;
        else if (item.key === "home-intro-name") homeIntro.name = item.content;
        else if (item.key === "home-intro-roles") {
          try {
            homeIntro.roles = JSON.parse(item.content);
          } catch (e) {
            // Keep default
          }
        } else if (item.key === "home-intro-resume")
          homeIntro.resumeLink = item.content;
        else if (item.key === "home-intro-linkedin")
          homeIntro.linkedinLink = item.content;
        else if (item.key === "home-intro-github")
          homeIntro.githubLink = item.content;
      });
    }
  } catch (error) {
    console.error("Error fetching home intro:", error);
  }

  return (
    <div className="bg-[#0a0a0a] relative">
      <div className="flex flex-col min-h-screen w-screen relative overflow-hidden" style={{ zIndex: 10 }}>
        <Navigation />
        <div className="w-screen flex justify-center grow pt-16 pb-8">
          <div className="max-w-6xl w-full px-6 flex flex-col justify-center relative">
            <EditableHomeIntro initialData={homeIntro} />
            <div className="fade-in" style={{ animationDelay: "0.5s" }}>
              <EditableQuickStats initialData={quickStats} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Preview Sections */}
      <div className="bg-gradient-to-b from-transparent to-[#0a0a0a] w-full">
        <div className="w-full max-w-7xl mx-auto px-6 py-20">
          {/* Latest Projects */}
          {projects.length > 0 && (
            <EditableLatestProjects projects={projects} />
          )}

          {/* Top Skills */}
          <EditableTopSkills initialData={topSkills} />

          {/* About Preview */}
          <AboutPreview />

          {/* Contact Preview */}
          <ContactPreview />
        </div>
      </div>
    </div>
  );
}
