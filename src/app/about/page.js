import Navigation from "../_components/navigation";
import StartQuote from "../_components/startquote";
import WhoAmI from "../_components/whoami";
import Background from "../_components/background";

export const metadata = {
  title: "Hayden Karas | About",
  description: "The about page for Hayden Karas, a software engineer from Cranston, Rhode Island.",
};
export default function About() {
  return (
    <div>
      <div className="flex flex-col h-screen w-screen">
        <Navigation />
        <div className="w-screen flex justify-center grow">
          <StartQuote
            quote="Quality is not an act, it is a habit."
            author="Aristotle"
            links={[["#1", "Who Am I?"], ["#2","My Journey"]]}
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
