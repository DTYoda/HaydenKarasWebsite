import Image from "next/image";

export default function WhoAmI() {
  const ImageStyle = {
    filter: "grayscale(100%)",
  };
  return (
    <div className="h-min-screen md:h-screen h-full w-[100vw] md:w-[80vw] xl:w-[60vw]">
      <div className="text-center">
        <h1 className="sm:text-7xl text-5xl p-2 text-center uppercase tracking-widest">
          Who Am I?
        </h1>
        <p className="sm:text-2xl text-xl pb-10 text-center">
          Always Curious, Forever Learning
        </p>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 flex items-center justify-center w-full">
          <div className="border-8 border-orange-500 rounded-lg">
            <Image
              src="/CrossArmImage.png"
              height={500}
              width={500}
              alt="Hayden Karas"
              style={ImageStyle}
            />
          </div>
        </div>
        <div className="md:w-1/2 w-full p-4">
          <p className="lg:text-[1.2vw] md:text-[1.6vw] sm-text-[2vw] text-[4vw]">
            Hi, I'm Hayden Karas, a Computer Science major from Cranston, Rhode
            Island. I am currently doing freelance full-stack web development
            and applying to college as a senior in high school. I've always
            loved learning, from physics to technology to engineering, and began
            coding in fifth grade. I value my relationships more than anything
            else in the world, and try to learn something new every single day.
          </p>
          <br />
          <p className="lg:text-[1.2vw] md:text-[1.6vw] sm-text-[2vw] text-[4vw]">
            I am an excellent communicator, always ready to share my thoughts
            and ideas with others. I am also a great problem solver, always
            looking for the most simple and efficient solutions to problems.
            With this comes being a leader and listner, always ready to
            understand and respond to thoughts and ideas, as well as provide my
            own .
          </p>
        </div>
      </div>
    </div>
  );
}
