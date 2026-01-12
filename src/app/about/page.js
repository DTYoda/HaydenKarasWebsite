import Navigation from "../_components/navigation";
import EditableStartQuote from "../_components/editablestartquote";
import EditableWhoAmI from "../_components/editablewhoami";
import EditableBackground from "../_components/editablebackground";

export const metadata = {
  title: "Hayden Karas | About",
  description:
    "Meet Hayden Karas: a dedicated learner and leader in computer science and mathematics, with a passion for bridging the digital divide. Discover his journey from coding beginnings to impactful projects and leadership roles.",
};

export default function About() {
  return (
    <div className="bg-[#0a0a0a] relative">
      <div className="flex flex-col items-center min-h-screen" style={{ zIndex: 10 }}>
        <div className="flex flex-col min-h-screen w-screen relative overflow-hidden">
          <Navigation />
          <div className="w-screen flex justify-center grow pt-16">
            <EditableStartQuote
              quote="Quality is not an act, it is a habit."
              author="Aristotle"
              links={[
                ["#whoami", "Who Am I?"],
                ["#journey", "My Journey"],
              ]}
              page="about"
              section="quote"
            />
          </div>
        </div>
        <div className="bg-gradient-to-b from-transparent to-[#0a0a0a] w-full">
          <a id="whoami"></a>
          <EditableWhoAmI />
          <a id="journey"></a>
          <EditableBackground />
        </div>
      </div>
    </div>
  );
}
