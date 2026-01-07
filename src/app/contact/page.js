import Navigation from "../_components/navigation";
import EditableStartQuote from "../_components/editablestartquote";

export const metadata = {
  title: "Hayden Karas | Contact",
  description:
    "Get in touch with Hayden Karas, an aspiring software engineer and leader in tech innovation. Contact for collaborations, tutoring, or game development insights. Find email and social links here.",
};
export default function Contact() {
  return (
    <div className="animated-gradient">
      <div className="flex flex-col min-h-screen w-screen relative overflow-hidden">
        <Navigation />
        <div className="w-screen flex justify-center grow pt-16">
          <EditableStartQuote
            quote="Communication—the human connection—is the key to personal and career success."
            author="Paul J. Meyer"
            links={[
              ["https://www.linkedin.com/in/haydenkaras/", "LinkedIn"],
              ["mailto:hkaras1121@gmail.com", "hkaras1121@gmail.com"],
            ]}
            page="contact"
            section="quote"
          />
        </div>
      </div>
    </div>
  );
}
