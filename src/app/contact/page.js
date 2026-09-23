import Navigation from "../_components/navigation";
import EditableStartQuote from "../_components/editablestartquote";
import EditableContactContent from "../_components/editablecontactcontent";
import ContactForm from "../_components/contactform";
import {
  contentMapFromRows,
  getPageContentRows,
  mapContactContent,
  mapQuote,
} from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata = {
  title: "Hayden Karas | Contact",
  description:
    "Get in touch with Hayden Karas, an aspiring software engineer and leader in tech innovation. Contact for collaborations, tutoring, or game development insights. Find email and social links here.",
};

export default async function Contact() {
  const [quoteRows, contentRows] = await Promise.all([
    getPageContentRows("contact", "quote"),
    getPageContentRows("contact", "content"),
  ]);

  const quote = mapQuote(contentMapFromRows(quoteRows), "contact", "quote", {
    quote:
      "Communication—the human connection—is the key to personal and career success.",
    author: "Paul J. Meyer",
    links: [
      ["https://www.linkedin.com/in/haydenkaras/", "LinkedIn"],
      ["mailto:hkaras1121@gmail.com", "hkaras1121@gmail.com"],
    ],
  });
  const contactContent = mapContactContent(contentMapFromRows(contentRows));

  return (
    <div className="bg-[#0a0a0a] relative">
      <div
        className="flex flex-col items-center min-h-screen"
        style={{ zIndex: 10 }}
      >
        <div className="flex flex-col min-h-screen w-screen relative overflow-hidden">
          <Navigation />
          <div className="w-screen flex justify-center grow pt-16">
            <EditableStartQuote
              quote={quote.quote}
              author={quote.author}
              links={quote.links}
              page="contact"
              section="quote"
            />
          </div>
        </div>
        <div className="bg-gradient-to-b from-transparent to-[#0a0a0a] w-full">
          <div className="w-full max-w-7xl mx-auto px-6 py-20">
            <ContactForm />
            <EditableContactContent initialData={contactContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
