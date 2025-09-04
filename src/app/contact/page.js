import Navigation from "../_components/navigation";
import StartQuote from "../_components/startquote";

export const metadata = {
  title: "Hayden Karas | Contact",
  description:
    "Get in touch with Hayden Karas, an aspiring software engineer and leader in tech innovation. Contact for collaborations, tutoring, or game development insights. Find email and social links here.",
};
export default function Contact() {
  return (
    <div>
      <div className="flex flex-col h-screen w-screen">
        <Navigation />
        <div className="w-screen flex justify-center grow">
          <StartQuote
            quote="Communication—the human connection—is the key to personal and career success."
            author="Paul J. Meyer"
            links={[
              ["https://www.linkedin.com/in/haydenkaras/", "LinkedIn"],
              ["https://mailto:hkaras1121@gmail.com", "hkaras1121@gmail.com"],
            ]}
          />
        </div>
      </div>
    </div>
  );
}
