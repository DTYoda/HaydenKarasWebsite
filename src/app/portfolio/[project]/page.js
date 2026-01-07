import Navigation from "@/app/_components/navigation";
import ProjectImages from "@/app/_components/projectImages";
import ProjectDescription from "@/app/_components/projectdesc";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

export default async function ProjectPage({ params }) {
  const { project } = params; // `params` contains the dynamic URL segments
  const prisma = new PrismaClient();
  const projectData = await prisma.Projects.findFirst({
    where: { urlTitle: project },
  });

  if (!projectData) {
    return <div>Project not found</div>;
  }

  let desc = JSON.parse(projectData.descriptions);
  let images = JSON.parse(projectData.images);
  images.shift();
  let links = JSON.parse(projectData.links);
  let technologies = JSON.parse(projectData.technologies);

  return (
    <div className="animated-gradient min-h-screen">
      <Navigation />
      <div className="w-full flex flex-col items-center pt-24 pb-20 px-6">
        {/* Project Header */}
        <div className="text-center mb-12 fade-in max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">{projectData.title}</span>
          </h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto mt-6"></div>
        </div>

        {/* Project Images */}
        <div className="w-full max-w-6xl mb-12 fade-in">
          <ProjectImages
            images={images.map(
              (image) => "/" + projectData.urlTitle + "/" + image
            )}
          />
        </div>

        {/* Project Description */}
        <div className="w-full max-w-6xl mb-16 fade-in">
          <ProjectDescription description={desc} />
        </div>

        {/* Technologies and Links */}
        <div className="w-full max-w-6xl flex flex-col sm:flex-row gap-12 sm:gap-16 items-start sm:items-center sm:justify-center">
          {/* Technologies Section */}
          <div className="glass rounded-2xl p-8 hover-lift w-full sm:w-auto">
            <h2 className="text-2xl font-bold mb-6 text-orange-500">Technologies</h2>
            <div className="flex flex-wrap gap-6 justify-center items-center">
              {technologies.map((tech, id) => (
                <Link
                  key={id}
                  title={tech.title}
                  href={tech.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-16 w-16 flex justify-center items-center group transition-all duration-300 hover-lift"
                >
                  <Image
                    src={"/technologyimages/" + tech.title + ".png"}
                    width={64}
                    height={64}
                    alt={tech.title}
                    className="transition-transform duration-300 group-hover:scale-110 filter group-hover:brightness-110"
                    style={{ width: "auto", height: "100%" }}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="glass rounded-2xl p-8 hover-lift w-full sm:w-auto">
            <h2 className="text-2xl font-bold mb-6 text-orange-500">Links</h2>
            <div className="flex flex-wrap gap-6 justify-center items-center">
              {links.map((link, id) => (
                <Link
                  key={id}
                  title={link.title}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-16 w-16 flex justify-center items-center group transition-all duration-300 hover-lift"
                >
                  <Image
                    src={"/linkimages/" + link.title + ".png"}
                    width={64}
                    height={64}
                    alt={link.title}
                    className="transition-transform duration-300 group-hover:scale-110 filter group-hover:brightness-110"
                    style={{ width: "auto", height: "100%" }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
