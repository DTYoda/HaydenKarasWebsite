import PortfolioResult from "./portfolioresult";
import SearchBar from "./searchbar";

export default function PortfolioSection() {
  return (
    <div className="min-h-screenn flex flex-col items-center">
      <h1 className="sm:text-[4vw] text-[10vw] p-8 text-center text-7xl uppercase">
        Portfolio
      </h1>
      <SearchBar />
      <div className="grid gap-4 w-[80vw] grid-col-4 grid-rows-4">
        <PortfolioResult />
        <PortfolioResult />
        <PortfolioResult />
      </div>
    </div>
  );
}
