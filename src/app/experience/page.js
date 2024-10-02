import Navigation from "../_components/navigation";
import SkillsSection from "../_components/skillsection";
import EducationSection from "../_components/educationsection";

export default function Experience() {
    return (<div className="flex flex-col items-center min-h-screen">      
        <div className="flex flex-col h-screen w-screen">
            <a className="snap-start" />
            <Navigation />
            <div className="w-screen flex justify-center grow">
            <div className="max-w-5xl grow flex flex-col justify-center">
                <h1 className="font-bold text-7xl">"Real knowledge is to know the extent of one's ignorance."</h1>
                <ul>
                <li className="text-5xl mt-8">{">"}Confucius</li>
                <li>
                    <a href="#1" className="hover:underline transition-all hover:font-bold m-4">abilties</a>
                    <a href="#2" className="hover:underline transition-all hover:font-bold m-4">education</a>
                </li>
                </ul>
                <div className="h-1/3 w-4"></div>
            </div>
            </div>
        </div>
        <a id="1" className="snap-start" />
        <SkillsSection />
        <a id="2" className="snap-start" />
        <EducationSection />
    </div>);
}