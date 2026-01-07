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
  let projects = [];
  
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error("Database error:", error);
    } else if (data) {
      // Convert snake_case to camelCase for compatibility
      projects = data.map(p => ({
        id: p.id,
        urlTitle: p.url_title,
        title: p.title,
        descriptions: p.descriptions,
        images: p.images,
        links: p.links,
        technologies: p.technologies,
        type: p.type,
        date: p.date
      }));
    }
  } catch (error) {
    console.error("Error initializing Supabase or fetching projects:", error);
    // Continue rendering even if database fails
  }

  return (
    <div className="animated-gradient">
      <div className="flex flex-col min-h-screen w-screen relative overflow-hidden">
        <Navigation />
        <div className="w-screen flex justify-center grow pt-16 pb-8">
          <div className="max-w-6xl w-full px-6 flex flex-col justify-center relative">
            {/* Background decorative elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl hidden md:block"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl hidden md:block"></div>

            <EditableHomeIntro />
            <div style={{ animationDelay: "0.5s" }} className="fade-in">
              <EditableQuickStats />
            </div>
          </div>
        </div>
      </div>

      {/* Content Preview Sections */}
      <div className="bg-gradient-to-b from-transparent to-[#0a0a0a] w-full">
        <div className="w-full max-w-7xl mx-auto px-6 py-20">
          {/* Latest Projects */}
          {projects.length > 0 && <EditableLatestProjects projects={projects} />}

          {/* Top Skills */}
          <EditableTopSkills />

          {/* About Preview */}
          <AboutPreview />

          {/* Contact Preview */}
          <ContactPreview />
        </div>
      </div>
    </div>
  );
}
