import Image from "next/image";

export default function Background() {
  const ImageStyle = {
    filter: "grayscale(0%)",
  };
  return (
    <section className="min-h-screen w-full max-w-7xl mx-auto px-6 py-20 flex flex-col justify-center">
      <div className="text-center mb-16 fade-in">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 uppercase tracking-wider">
          <span className="gradient-text">My Journey</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-400 font-light">
          Pursuing Growth and Knowledge
        </p>
        <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-12 items-center">
        <div className="md:w-1/2 w-full space-y-6 slide-in-left">
          <div className="glass rounded-2xl p-8 hover-lift">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300">
              My journey into the world of technology began with a fascination for
              how things work and a relentless curiosity to dig deeper. Starting
              with the idea of creating Minecraft mods in third grade, I started
              with game development with <span className="text-orange-500 font-semibold">Scratch</span> and then slowly learned new
              technologies, languages, and frameworks. Entering high school, I
              began entering technology classes and doing various projects. This
              resulted in entering the <span className="text-orange-500 font-semibold">SkillsUSA game development competition</span>,
              winning states two years in a row and placing top 10 nationally
              twice.
            </p>
          </div>
          <div className="glass rounded-2xl p-8 hover-lift">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300">
              Aside from Game Development, I also explored full-stack web
              development through college courses and online courses like <span className="text-orange-500 font-semibold">CS50x</span>. I
              presented one of my earliest web projects at the University of Rhode
              Island's Computer Science Summit. I also was the captain of my
              school's math team throughout high school, competing there as well,
              learning advanced math topics as well as leadership and teamwork
              skills.
            </p>
          </div>
        </div>
        <div className="md:w-1/2 flex items-center justify-center w-full slide-in-right">
          <div className="relative group w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative border-4 border-orange-500/50 rounded-2xl overflow-hidden hover-lift glow-orange-hover">
              <Image
                src="/SkillsUSAImage.jpeg"
                height={500}
                width={500}
                alt="Hayden Karas at SkillsUSA"
                style={ImageStyle}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
