import Navigation from "./_components/navigation";
import PortfolioResult from "./_components/portfolioresult";
import Link from "next/link";

export const metadata = {
  title: "Hayden Karas",
  description:
    "Efficient software developer and passionate learner, Hayden Karas, showcases innovation in computer science, game development, and digital solutions. Explore a hub of creativity, leadership, and impactful projects.",
};

export default function Home() {
  return (
    <div>
      <div className="flex flex-col h-screen w-screen">
        <Navigation />
        <div className="w-screen flex justify-center grow">
          <div className="max-w-5xl grow flex flex-col justify-center">
            <h1 className="font-bold text-7xl">Hayden Karas</h1>
            <ul>
              <li className="text-5xl mt-8">
                <span className="text-orange-500">{">"}</span>Coder
              </li>
              <li className="text-5xl mt-8">
                <span className="text-orange-500">{">"}</span>Developer
              </li>
              <li className="text-5xl mt-8">
                <span className="text-orange-500">{">"}</span>Mathematician
              </li>
              <li>
                <Link
                  rel="noopener noreferrer"
                  href="/resume.pdf"
                  target="_blank"
                  className="hover:underline transition-all decoration-orange-500  m-4"
                >
                  Resume
                </Link>
                <Link
                  rel="noopener noreferrer"
                  href="https://www.linkedin.com/in/haydenkaras/"
                  target="_blank"
                  className="hover:underline transition-all decoration-orange-500  m-4"
                >
                  LinkedIn
                </Link>
                <Link
                  rel="noopener noreferrer"
                  href="https://github.com/DTYoda"
                  target="_blank"
                  className="hover:underline transition-all decoration-orange-500  m-4"
                >
                  GitHub
                </Link>
              </li>
            </ul>
            <div className="h-1/3 w-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
