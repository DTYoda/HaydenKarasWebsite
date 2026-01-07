import Link from "next/link";

export default function ContactPreview() {
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
              <li className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-1">•</span>
                <span className="text-gray-300">Internships and full-time opportunities</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-1">•</span>
                <span className="text-gray-300">Game development projects</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-1">•</span>
                <span className="text-gray-300">Web development collaborations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-1">•</span>
                <span className="text-gray-300">Research opportunities</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 text-xl mt-1">•</span>
                <span className="text-gray-300">Open-source contributions</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-200 mb-4">Quick Links</h3>
            <div className="space-y-3">
              <Link
                href="https://www.linkedin.com/in/haydenkaras/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 transition-all group"
              >
                <span className="text-2xl">💼</span>
                <span className="text-gray-300 group-hover:text-orange-500 transition-colors">LinkedIn</span>
                <span className="ml-auto text-orange-500">→</span>
              </Link>
              <Link
                href="https://github.com/DTYoda"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 transition-all group"
              >
                <span className="text-2xl">💻</span>
                <span className="text-gray-300 group-hover:text-orange-500 transition-colors">GitHub</span>
                <span className="ml-auto text-orange-500">→</span>
              </Link>
              <Link
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 glass rounded-lg hover:bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/50 transition-all group"
              >
                <span className="text-2xl">📄</span>
                <span className="text-gray-300 group-hover:text-orange-500 transition-colors">Resume</span>
                <span className="ml-auto text-orange-500">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

