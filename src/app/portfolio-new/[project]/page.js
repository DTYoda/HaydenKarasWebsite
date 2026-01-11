import { createServerClient } from "@/lib/supabase";
import NewProjectPage from "@/app/_components/newprojectpage";

// Disable caching to ensure fresh data on refresh
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function ProjectPageNew({ params }) {
  const { project } = params;
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

