import Link from "next/link";
import { stripHtml } from "@/lib/projects";

export default function AboutPreview({ whoami, background }) {
  const whoamiText =
    stripHtml(whoami?.paragraph1) ||
    "A Computer Science student focused on building useful software and learning every day.";
  const journeyText =
    stripHtml(background?.paragraph1) ||
    "From early coding projects to competition work and full-stack development.";

  return (
    <section className="w-full mb-20 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            <span className="gradient-text">About Me</span>
          </h2>
          <p className="text-gray-400 text-lg">
            A quick introduction to who I am
          </p>
        </div>
        <Link
          href="/about"
          className="px-6 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift whitespace-nowrap"
        >
          Learn More →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass rounded-2xl p-8 border border-orange-500/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">👋</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-200">Who I Am</h3>
              <div className="w-12 h-0.5 bg-orange-500 mt-2"></div>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">{whoamiText}</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-orange-500/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">🚀</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-200">My Journey</h3>
              <div className="w-12 h-0.5 bg-orange-500 mt-2"></div>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed">{journeyText}</p>
        </div>
      </div>
    </section>
  );
}
