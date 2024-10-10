import Navigation from "../_components/navigation";
import SkillsSection from "../_components/skillsection";
import EducationSection from "../_components/educationsection";
import StartQuote from "../_components/startquote";

export default function Experience() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="flex flex-col h-screen w-screen">
        <Navigation />
        <div className="w-screen flex justify-center grow">
          <StartQuote
            quote="Real knowledge is to know the extent of one's ignorance."
            author="Confucius"
          />
        </div>
      </div>
      <SkillsSection />
      <EducationSection />
    </div>
  );
}
