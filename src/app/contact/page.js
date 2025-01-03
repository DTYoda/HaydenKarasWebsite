import Navigation from "../_components/navigation";
import StartQuote from "../_components/startquote";

export default function Contact() {
  return (
    <div>
      <div className="flex flex-col h-screen w-screen">
        <Navigation />
        <div className="w-screen flex justify-center grow">
          <StartQuote
            quote="Communication—the human connection—is the key to personal and career success."
            author="Paul J. Meyer"
            links={["LinkedIn", "GitHub"]}
          />
        </div>
      </div>
    </div>
  );
}
