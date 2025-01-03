import Navigation from "./_components/navigation";
import PortfolioResult from "./_components/portfolioresult";

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
                <button className="hover:underline transition-all decoration-orange-500  m-4">
                  resume
                </button>
                <button className="hover:underline transition-all decoration-orange-500  m-4">
                  featured works
                </button>
                <button className="hover:underline transition-all decoration-orange-500  m-4">
                  github
                </button>
              </li>
            </ul>
            <div className="h-1/3 w-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
