import Navigation from "@/app/_components/navigation";
import ProjectImages from "@/app/_components/projectImages";
import ProjectDescription from "@/app/_components/projectdesc";
import { PrismaClient } from "@prisma/client";

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

  return (
    <div>
        <Navigation />
        <div className="w-[100vw] flex flex-col items-center">       
          <div className="text-center">
            <h1 className="text-7xl space-y-5">{projectData.title}</h1>
            <p>This is the {projectData.title} project page.</p>
          </div> 
          <div className="flex w-[100vw] md:w-[80vw] md:h-[40vw] h-[200vw] gap-4 m-4 md:flex-row flex-col">
            <ProjectImages images={images}/>
            <ProjectDescription description={desc}/>
          </div>
          <div className=" w-[90vw] md:w-[70vw] xl:w-[70vw] h-[10vw] grid md:grid-cols-2 grid-cols-1 gap-4">
            <div className="border-orange-800 border-4  rounded-lg min-h-14">
            </div>
            <div className="border-orange-800 border-4  rounded-lg min-h-14">
            </div>
            <div className="border-orange-800 border-4  rounded-lg min-h-14">
            </div>
            <div className="border-orange-800 border-4  rounded-lg min-h-14">
            </div>
          </div>
        </div>
    </div>
  );
}
