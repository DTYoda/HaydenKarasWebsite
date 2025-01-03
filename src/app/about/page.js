import Navigation from "../_components/navigation";
import StartQuote from "../_components/startquote";
import WhoAmI from "../_components/whoami";
import Background from "../_components/background";

export default function About() {
  return (
    <div>
      <div className="flex flex-col h-screen w-screen">
        <Navigation />
        <div className="w-screen flex justify-center grow">
          <StartQuote
            quote="Quality is not an act, it is a habit."
            author="Aristotle"
            links={["Who Am I?", "My Journey"]}
          />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <a id="1"></a>
        <WhoAmI />
        <a id="2"></a>
        <Background />
      </div>
    </div>
  );
}
