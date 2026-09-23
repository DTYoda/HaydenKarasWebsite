import Navigation from "./_components/navigation";
import EditableQuickStats from "./_components/editablequickstats";
import EditableLatestProjects from "./_components/editablelatestprojects";
import EditableTopSkills from "./_components/editabletopskills";
import AboutPreview from "./_components/aboutpreview";
import ContactPreview from "./_components/contactpreview";
import EditableHomeIntro from "./_components/editablehomeintro";
import { getHomePageData } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata = {
  title: "Hayden Karas",
  description:
    "Efficient software developer and passionate learner, Hayden Karas, showcases innovation in computer science, game development, and digital solutions. Explore a hub of creativity, leadership, and impactful projects.",
};

export default async function Home() {
  const {
    latestProjects,
    quickStats,
    homeIntro,
    topSkills,
    topSkillsSettings,
    aboutWhoami,
    aboutBackground,
    contactContent,
  } = await getHomePageData();

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

      <div className="bg-gradient-to-b from-transparent to-[#0a0a0a] w-full">
        <div className="w-full max-w-7xl mx-auto px-6 py-20">
          {latestProjects.length > 0 && (
            <EditableLatestProjects projects={latestProjects} />
          )}

          <EditableTopSkills
            initialData={topSkills}
            initialSettings={topSkillsSettings}
          />

          <AboutPreview whoami={aboutWhoami} background={aboutBackground} />
          <ContactPreview contactContent={contactContent} />
        </div>
      </div>
    </div>
  );
}
