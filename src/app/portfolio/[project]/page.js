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
          <ProjectDescription description={desc} />
        </div>
        <div className="h-16"></div>
        <div className=" w-[90vw] md:w-[70vw] xl:w-[70vw] flex flex-col sm:flex-row items-start sm:justify-center sm:gap-16 bottom-0 bg-black">
          <div>
            <p>Technologies</p>
            <div className="gap-4 rounded-lg flex justify-center items-start sm:items-center">
              {technologies.map((tech, id) => (
                <Link
                  key={id}
                  title={tech.title}
                  href={tech.link}
                  target="_blank"
                  className=" h-10 sm:h-16 w-fill flex justify-center items-center group"
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
              className=" gap-4 rounded-lg flex items-start sm:items-center justify-center
              "
            >
              {links.map((link, id) => (
                <Link
                  key={id}
                  title={link.title}
                  href={link.link}
                  target="_blank"
                  className=" h-10 sm:h-16 w-fill
                   flex justify-center items-center group animate-all"
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
        </div>
      </div>
    </div>
  );
}
