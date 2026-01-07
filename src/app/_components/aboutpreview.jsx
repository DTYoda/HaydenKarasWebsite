import Link from "next/link";
import Image from "next/image";

export default function AboutPreview() {
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
          <p className="text-gray-300 leading-relaxed mb-4">
            I'm <span className="text-orange-500 font-semibold">Hayden Karas</span>, a Computer Science major from Cranston, Rhode Island. Currently a freshman at{" "}
            <span className="text-orange-500 font-semibold">Carnegie Mellon University's</span> School of Computer Science.
          </p>
          <p className="text-gray-300 leading-relaxed">
            I've been coding since fifth grade and have always loved learning—from physics to technology to engineering. I value relationships more than anything and try to learn something new every single day.
          </p>
        </div>

        <div className="glass rounded-2xl p-8 border border-orange-500/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl">🚀</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-200">My Journey</h3>
              <div className="w-12 h-0.5 bg-orange-500 mt-2"></div>
            </div>
          </div>
          <p className="text-gray-300 leading-relaxed mb-4">
            Started with <span className="text-orange-500 font-semibold">Scratch</span> and Minecraft mods, then progressed to game development with Unity. Won{" "}
            <span className="text-orange-500 font-semibold">SkillsUSA</span> state championships two years in a row and placed{" "}
            <span className="text-orange-500 font-semibold">top 10 nationally</span> twice.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Also explored full-stack web development through college courses and <span className="text-orange-500 font-semibold">CS50x</span>, presenting projects at URI's Computer Science Summit.
          </p>
        </div>
      </div>

      <div className="mt-8 glass rounded-2xl p-6 border border-orange-500/20">
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">8+</div>
            <div className="text-sm text-gray-400">Years Coding</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">CMU</div>
            <div className="text-sm text-gray-400">University</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">Top 10</div>
            <div className="text-sm text-gray-400">National</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500 mb-1">2x</div>
            <div className="text-sm text-gray-400">State Champ</div>
          </div>
        </div>
      </div>
    </section>
  );
}

