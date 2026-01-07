import Navigation from "../_components/navigation";
import PortfolioSection from "../_components/portfoliosection";
import StartQuote from "../_components/startquote";

export const metadata = {
  title: "Hayden Karas | Portfolio",
  description:
    "Explore Hayden Karas’ dynamic projects, including game development, full-stack web applications, and astrophysics research. Showcasing programming prowess in Python, Java, and more to create real-world impact.",
};

export default function Portfolio() {
  return (
    <div className="animated-gradient">
      <div className="flex flex-col min-h-screen w-screen relative overflow-hidden">
        <Navigation />
        <div className="w-screen flex justify-center grow pt-16">
          <StartQuote
            quote="The only place success comes before work is in the dictionary."
            author="Vince Lombardi"
            links={[
              ["https://github.com/DTYoda?tab=repositories", "GitHub"],
              ["https://www.linkedin.com/in/haydenkaras/", "LinkedIn"],
              ["/resume.pdf", "Resume"],
            ]}
          />
        </div>
      </div>
      <div className="bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <PortfolioSection />
      </div>
    </div>
  );
}
