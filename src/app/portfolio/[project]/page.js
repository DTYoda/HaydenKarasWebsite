import { createServerClient } from "@/lib/supabase";
import NewProjectPage from "@/app/_components/newprojectpage";

// Disable caching to ensure fresh data on refresh
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function ProjectPage({ params }) {
  const { project } = params; // `params` contains the dynamic URL segments
  let projectData = null;
  
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('url_title', project)
      .single();

    if (error) {
      console.error("Error fetching project:", error);
    } else {
      projectData = data;
    }
  } catch (error) {
    console.error("Error initializing Supabase:", error);
  }

  if (!projectData) {
    return <div>Project not found</div>;
  }

  return <NewProjectPage projectData={projectData} />;
}
