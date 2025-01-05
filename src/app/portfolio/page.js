import Navigation from "../_components/navigation";
import PortfolioSection from "../_components/portfoliosection";
import StartQuote from "../_components/startquote";

export const metadata = {
  title: "Hayden Karas | Portfolio",
  description: "The portfolio for Hayden Karas, a software engineer from Cranston, Rhode Island.",
};

export default function Portfolio() {
  return (
    <div>
      <div className="flex flex-col h-screen w-screen">
        <Navigation />
        <div className="w-screen flex justify-center grow">
          <StartQuote
            quote="The only place success comes before work is in the dictionary."
            author="Vince Lombardi"
            links={["GitHub", "LinkedIn"]}
          />
        </div>
      </div>
      <div>
        <PortfolioSection />
      </div>
    </div>
  );
}
