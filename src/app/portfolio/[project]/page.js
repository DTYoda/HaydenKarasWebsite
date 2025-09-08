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
    <div>
      <Navigation />
      <div className="w-[100vw] flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-5xl space-y-5">{projectData.title}</h1>
        </div>
        <div className="flex w-full gap-4 m-4 flex-col items-center">
          <ProjectImages
            images={images.map(
              (image) => "/" + projectData.urlTitle + "/" + image
            )}
          />
          <div>Project Overview</div>
          <ProjectDescription description={desc} />
        </div>
        <div className=" w-[90vw] md:w-[70vw] xl:w-[70vw] grid md:grid-cols-2 grid-cols-1 gap-4">
          <div>
            <p>Technologies</p>
            <div className="border-orange-800 border-4 gap-4 rounded-lg min-h-14 flex justify-center items-center h-20">
              {technologies.map((tech, id) => (
                <Link
                  key={id}
                  title={tech.title}
                  href={tech.link}
                  target="_blank"
                  className=" h-full w-24 flex justify-center items-center group"
                >
                  <Image
                    src={"/technologyimages/" + tech.title + ".png"}
                    width={100}
                    height={100}
                    style={{ width: "auto", height: "90%" }}
                    className="group-hover:scale-[1.1]"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div>
            Links
            <div
              className="border-orange-800 border-4 gap-4 rounded-lg min-h-14 flex justify-center items-center h-20
              "
            >
              {links.map((link, id) => (
                <Link
                  key={id}
                  title={link.title}
                  href={link.link}
                  target="_blank"
                  className=" h-full w-24 flex justify-center items-center group animate-all"
                >
                  <Image
                    src={"/linkimages/" + link.title + ".png"}
                    width={100}
                    height={100}
                    style={{ width: "auto", height: "90%" }}
                    className="group-hover:scale-[1.1]"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div>
            Date
            <div className="border-orange-800 border-4  rounded-lg min-h-14 flex justify-center items-center h-20">
              <p className="text-[4vw] md:text-[2vw]">{projectData.date}</p>
            </div>
          </div>

          <div>
            Type
            <div className="border-orange-800 border-4  rounded-lg min-h-14 h-20 flex justify-center items-center">
              <p className="text-[4vw] md:text-[2vw]">{projectData.type}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
