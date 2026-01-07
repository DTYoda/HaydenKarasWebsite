import PortfolioResult from "./portfolioresult";
import SearchBar from "./searchbar";
import { PrismaClient } from "@prisma/client";

export default async function PortfolioSection() {
  const prisma = new PrismaClient();
  const projects = await prisma.projects.findMany();

  return (
    <div className="min-h-screen flex flex-col items-center py-20 px-6">
      <div className="text-center mb-16 fade-in">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 uppercase tracking-wider">
          <span className="gradient-text">Portfolio</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-400 font-light">
          Showcasing My Work
        </p>
        <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl place-items-center">
        {projects.map((project, id) => (
          <div key={id} className="fade-in" style={{ animationDelay: `${id * 0.1}s` }}>
            <PortfolioResult
              link={project.urlTitle}
              title={project.title}
              type={project.type}
              date={project.date}
              image={JSON.parse(project.images)[0]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
