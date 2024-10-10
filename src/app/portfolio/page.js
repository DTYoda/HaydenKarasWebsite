import Navigation from "../_components/navigation";
import StartQuote from "../_components/startquote";

export default function Portfolio() {
  return (
    <div>
      <div className="flex flex-col h-screen w-screen">
        <Navigation />
        <div className="w-screen flex justify-center grow">
          <StartQuote
            quote="The only place success comes before work is in the dictionary."
            author="Vince Lombardi"
          />
        </div>
      </div>
    </div>
  );
}
