import Navigation from "../_components/navigation";
import SkillsSection from "../_components/skillsection";
import EducationSection from "../_components/educationsection";
import StartQuote from "../_components/startquote";
import { PrismaClient } from "@prisma/client";

export const metadata = {
  title: "Hayden Karas | Experience",
  description: "The experience page for Hayden Karas, a software engineer from Cranston, Rhode Island.",
};

export default async function Experience() {
  const prisma = new PrismaClient();

  const skills = await prisma.Skills.findMany();
  const education = await prisma.Education.findMany();

  return (
    <div className="animated-gradient">
      <div className="flex flex-col items-center min-h-screen">
        <div className="flex flex-col min-h-screen w-screen relative overflow-hidden">
          <Navigation />
          <div className="w-screen flex justify-center grow pt-16">
            <StartQuote
              quote="Real knowledge is to know the extent of one's ignorance."
              author="Confucius"
              links={[["#1", "Abilities"], ["#2", "Education"], ["https://leetcode.com/u/DTYoda/", "LeetCode"]]}
            />
          </div>
        </div>
        <div className="bg-gradient-to-b from-transparent to-[#0a0a0a] w-full">
          <a id="1"></a>
          <SkillsSection skills={skills} />
          <a id="2"></a>
          <EducationSection education={education} />
        </div>
      </div>
    </div>
  );
}
