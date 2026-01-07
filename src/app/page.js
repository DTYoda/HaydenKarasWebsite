import Navigation from "./_components/navigation";
import PortfolioResult from "./_components/portfolioresult";
import Link from "next/link";
import WhoAmI from "./_components/whoami";
import Background from "./_components/background";

export const metadata = {
  title: "Hayden Karas",
  description:
    "Efficient software developer and passionate learner, Hayden Karas, showcases innovation in computer science, game development, and digital solutions. Explore a hub of creativity, leadership, and impactful projects.",
};

export default function Home() {
  return (
    <div className="animated-gradient">
      <div className="flex flex-col min-h-screen w-screen relative overflow-hidden">
        <Navigation />
        <div className="w-screen flex justify-center grow pt-16 pb-8">
          <div className="max-w-6xl w-full px-6 flex flex-col justify-center relative">
            {/* Background decorative elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl hidden md:block"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl hidden md:block"></div>

            <div className="relative z-10 fade-in py-8">
              <div className="mb-4 sm:mb-6">
                <span className="mono text-orange-500 text-base sm:text-lg font-medium">
                  Hi, my name is
                </span>
              </div>
              <h1 className="font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 sm:mb-6 leading-tight">
                <span className="gradient-text">Hayden Karas</span>
              </h1>
              <div className="space-y-2 sm:space-y-4 mb-8 sm:mb-12">
                <div
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold slide-in-left"
                  style={{ animationDelay: "0.1s" }}
                >
                  <span className="mono text-orange-500 mr-2 sm:mr-3">{">"}</span>
                  <span className="text-gray-200">Coder</span>
                </div>
                <div
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold slide-in-left"
                  style={{ animationDelay: "0.2s" }}
                >
                  <span className="mono text-orange-500 mr-2 sm:mr-3">{">"}</span>
                  <span className="text-gray-200">Developer</span>
                </div>
                <div
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold slide-in-left"
                  style={{ animationDelay: "0.3s" }}
                >
                  <span className="mono text-orange-500 mr-2 sm:mr-3">{">"}</span>
                  <span className="text-gray-200">Mathematician</span>
                </div>
              </div>
              <div
                className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8 slide-in-right"
                style={{ animationDelay: "0.4s" }}
              >
                <Link
                  rel="noopener noreferrer"
                  href="/resume.pdf"
                  target="_blank"
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-all duration-300 hover-lift glow-orange-hover text-sm sm:text-base"
                >
                  View Resume
                </Link>
                <Link
                  rel="noopener noreferrer"
                  href="https://www.linkedin.com/in/haydenkaras/"
                  target="_blank"
                  className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift text-sm sm:text-base"
                >
                  LinkedIn
                </Link>
                <Link
                  rel="noopener noreferrer"
                  href="https://github.com/DTYoda"
                  target="_blank"
                  className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift text-sm sm:text-base"
                >
                  GitHub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center bg-gradient-to-b from-transparent to-[#0a0a0a]">
        <a id=""></a>
        <WhoAmI />
        <a id=""></a>
        <Background />
      </div>
    </div>
  );
}
