import Navigation from "../_components/navigation";
import EditableStartQuote from "../_components/editablestartquote";
import ExperienceContent from "../_components/experiencecontent";

export const metadata = {
  title: "Hayden Karas | Experience",
  description:
    "Technical skills, education, and qualifications. A visual overview for recruiters.",
};

export default function Experience() {
  return (
    <div className="bg-[#0a0a0a] relative">
      <div className="flex flex-col items-center min-h-screen" style={{ zIndex: 10 }}>
        <div className="flex flex-col min-h-screen w-screen relative overflow-hidden">
          <Navigation />
          <div className="w-screen flex justify-center grow pt-16">
            <EditableStartQuote
              quote="Real knowledge is to know the extent of one's ignorance."
              author="Confucius"
              links={[
                ["#skills", "Skills"],
                ["#master-timeline", "Master Timeline"],
                ["https://leetcode.com/u/DTYoda/", "LeetCode"],
              ]}
              page="experience"
              section="quote"
            />
          </div>
        </div>

        <div className="bg-gradient-to-b from-transparent to-[#0a0a0a] w-full">
          <ExperienceContent />
        </div>
      </div>
    </div>
  );
}
