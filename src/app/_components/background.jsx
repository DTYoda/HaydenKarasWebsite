import Image from "next/image";

export default function Background() {
  const ImageStyle = {
    filter: "grayscale(100%)",
  };
  return (
    <div className="min-h-screen h-full w-[100vw] md:w-[80vw] xl:w-[60vw]">
      <div className="text-center">
        <h1 className="sm:text-7xl text-5xl p-2 text-center uppercase tracking-widest">
          My Journey
        </h1>
        <p className="sm:text-2xl text-xl pb-10 text-center">
          Pursuing Growth and Knowledge
        </p>
      </div>
      <div className="flex flex-col-reverse md:flex-row h-full">
        <div className="md:w-1/2 w-full p-4">
          <p className="lg:text-[1.2vw] md:text-[1.6vw] sm-text-[2vw] text-[4vw]">
            My journey into the world of technology began with a fascination for
            how things work and a relentless curiosity to dig deeper. Starting
            with the idea of creating Minecraft mods in third grade, I started
            with game development with scratch and then slowly learned new
            technologies, languages, and frameworks. Entering high school, I
            began entering technology classes and doing various projects. This
            resulted in entering the SkillsUSA game development competition,
            winning states two years in a row and placing top 10 nationally
            twice.{" "}
          </p>
          <br />
          <p className="lg:text-[1.2vw] md:text-[1.6vw] sm-text-[2vw] text-[4vw]">
            Aside from Game Development, I also explored full-stack web
            development through college courses and online courses like CS50x. I
            presented one of my earliest web projects at the University of Rhode
            Island's Computer Science Summit. I also was the captain of my
            school's math team throughout high school, competing there as well,
            learning advanced math topics as well as leadership and teamwork
            skills.
          </p>
        </div>
        <div className="md:w-1/2 flex items-center justify-center w-full">
          <div className="border-8 border-orange-500 rounded-lg">
            <Image
              src="/SkillsUSAImage.jpeg"
              height={500}
              width={500}
              alt="Hayden Karas"
              style={ImageStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
