import Navigation from "./_components/navigation";
import EditableQuickStats from "./_components/editablequickstats";
import EditableLatestProjects from "./_components/editablelatestprojects";
import EditableTopSkills from "./_components/editabletopskills";
import AboutPreview from "./_components/aboutpreview";
import ContactPreview from "./_components/contactpreview";
import EditableHomeIntro from "./_components/editablehomeintro";
import { createServerClient } from "@/lib/supabase";

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
    // Fetch top skills - get from skills table and sort by proficiency
    const { data: skillsData, error: skillsError } = await supabase
      .from("skills")
      .select("*");

    if (!skillsError && skillsData) {
      // Sort by proficiency descending and take first 8
      topSkills = skillsData
        .sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
        .slice(0, 8);
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
