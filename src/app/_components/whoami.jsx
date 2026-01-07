import Image from "next/image";

export default function WhoAmI() {
  const ImageStyle = {
    filter: "grayscale(0%)",
  };
  return (
    <section className="min-h-screen w-full max-w-7xl mx-auto px-6 py-20 flex flex-col justify-center">
      <div className="text-center mb-16 fade-in">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 uppercase tracking-wider">
          <span className="gradient-text">Who Am I?</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-400 font-light">
          Always Curious, Forever Learning
        </p>
        <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
      </div>
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="md:w-1/2 flex items-center justify-center w-full slide-in-left">
          <div className="relative group w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative border-4 border-orange-500/50 rounded-2xl overflow-hidden hover-lift glow-orange-hover">
              <Image
                src="/CrossArmImage.png"
                height={500}
                width={500}
                alt="Hayden Karas"
                style={ImageStyle}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
        <div className="md:w-1/2 w-full space-y-6 slide-in-right">
          <div className="glass rounded-2xl p-8 hover-lift">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300">
              Hi, I'm <span className="text-orange-500 font-semibold">Hayden Karas</span>, a Computer Science major from Cranston, Rhode
              Island. I am currently a freshman at <span className="text-orange-500 font-semibold">Carnegie Mellon University's</span>
              School of Computer Science. I've always loved learning, from physics
              to technology to engineering, and began coding in fifth grade. I
              value my relationships more than anything else in the world, and try
              to learn something new every single day.
            </p>
          </div>
          <div className="glass rounded-2xl p-8 hover-lift">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300">
              I am an excellent communicator, always ready to share my thoughts
              and ideas with others. I am also a great problem solver, always
              looking for the most simple and efficient solutions to problems.
              With this comes being a leader and listener, always ready to
              understand and respond to thoughts and ideas, as well as provide my
              own.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
