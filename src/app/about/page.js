import Navigation from "../_components/navigation";
import StartQuote from "../_components/startquote";

export default function About() {
  return (
    <div>
      <div className="flex flex-col h-screen w-screen">
        <Navigation />
        <div className="w-screen flex justify-center grow">
          <StartQuote
            quote="Quality is not an act, it is a habit."
            author="Aristotle"
          />
        </div>
      </div>
    </div>
  );
}
