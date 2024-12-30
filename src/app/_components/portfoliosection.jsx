import PortfolioResult from "./portfolioresult";
import SearchBar from "./searchbar";
import { PrismaClient } from "@prisma/client";

export default async function PortfolioSection() {
  const prisma = new PrismaClient();
  const projects = await prisma.ProjectsButton.findMany();

  console.log(projects);


  return (
    <div className="min-h-screen flex flex-col items-center">
      <h1 className="sm:text-[4vw] text-[10vw] p-8 text-center text-7xl uppercase">
        Portfolio
      </h1>
      <SearchBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-[80vw] 2xl:w-[70vw] mt-8 place-items-center">
        <PortfolioResult />
        <PortfolioResult />
        <PortfolioResult />
        <PortfolioResult />
        <PortfolioResult />
        <PortfolioResult />
        <PortfolioResult />
        <PortfolioResult />
      </div>
    </div>
  );
}
