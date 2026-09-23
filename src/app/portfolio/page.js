import Navigation from "../_components/navigation";
import PortfolioSection from "../_components/portfoliosection";
import EditableStartQuote from "../_components/editablestartquote";
import {
  compareProjectDatesDesc,
  mapProject,
} from "@/lib/projects";
import { createServerClient } from "@/lib/supabase";
import {
  contentMapFromRows,
  getPageContentRows,
  mapQuote,
} from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata = {
  title: "Hayden Karas | Portfolio",
  description:
    "Explore Hayden Karas’ dynamic projects, including game development, full-stack web applications, and astrophysics research. Showcasing programming prowess in Python, Java, and more to create real-world impact.",
};

export default async function Portfolio() {
  const supabase = createServerClient();
  const [quoteRows, projectsResult] = await Promise.all([
    getPageContentRows("portfolio", "quote"),
    supabase.from("projects").select("*"),
  ]);
  const quote = mapQuote(contentMapFromRows(quoteRows), "portfolio", "quote", {
    quote: "The only place success comes before work is in the dictionary.",
    author: "Vince Lombardi",
    links: [
      ["https://github.com/DTYoda?tab=repositories", "GitHub"],
      ["https://www.linkedin.com/in/haydenkaras/", "LinkedIn"],
      ["/resume.pdf", "Resume"],
    ],
  });

  const projects = (projectsResult.data || [])
    .map(mapProject)
    .filter(Boolean)
    .sort(compareProjectDatesDesc);

  return (
    <div className="bg-[#0a0a0a] relative">
      <div
        className="flex flex-col min-h-screen w-screen relative overflow-hidden"
        style={{ zIndex: 10 }}
      >
        <Navigation />
        <div className="w-screen flex justify-center grow pt-16">
          <EditableStartQuote
            quote={quote.quote}
            author={quote.author}
            links={quote.links}
            page="portfolio"
            section="quote"
          />
        </div>
      </div>
      <div className="bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <PortfolioSection initialProjects={projects} />
      </div>
    </div>
  );
}
