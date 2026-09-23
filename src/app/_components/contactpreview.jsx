import Link from "next/link";

export default function ContactPreview({ contactContent }) {
  const availableFor = Array.isArray(contactContent?.availableFor)
    ? contactContent.availableFor
    : [];
  const links = Array.isArray(contactContent?.links) ? contactContent.links : [];

  const displayLinks = links.map((link) => {
    if (Array.isArray(link)) {
      return { url: link[0], label: link[1], icon: "🔗" };
    }
    return {
      url: link.url || link.link || "",
      label: link.label || link.title || "",
      icon: link.icon || "🔗",
    };
  });

  return (
    <section className="w-full mb-20 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            <span className="gradient-text">Get In Touch</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Let's connect and discuss opportunities
          </p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift whitespace-nowrap"
        >
          Contact Me →
        </Link>
      </div>

      <div className="glass rounded-2xl p-8 border border-orange-500/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gray-200 mb-4">I'm Available For</h3>
            <ul className="space-y-3">
              {availableFor.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-orange-500 text-xl mt-1">•</span>
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-200 mb-4">Quick Links</h3>
            <div className="space-y-3">
              {displayLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target={link.url.startsWith("http") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 transition-all group"
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span className="text-gray-300 group-hover:text-orange-500 transition-colors">
                    {link.label}
                  </span>
                  <span className="ml-auto text-orange-500">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
