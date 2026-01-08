import { createServerClient, createServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Helper to check admin authentication
async function checkAdminAuth() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("admin-auth");
    return authCookie?.value === "authenticated";
  } catch (error) {
    return false;
  }
}

export async function POST(req) {
  try {
    var body = await req.json();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error processing request" }, { status: 500 });
  }

  // Check admin auth for write operations
  if (body.type !== "get") {
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized: Admin authentication required" 
      }, { status: 401 });
    }
  }

  try {
    // Use service role client for admin operations to bypass RLS
    const supabase = createServiceRoleClient();
    
    // Log the incoming data for debugging
    if (body.type === "edit") {
      console.log("Updating project:", {
        id: body.id,
        urlTitle: body.urlTitle,
        title: body.title,
        descriptions: body.descriptions,
        links: body.links,
        technologies: body.technologies
      });
    }

    if (body.type == "new") {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          url_title: body.urlTitle,
          title: body.title,
          descriptions: body.descriptions,
          images: body.images,
          links: body.links,
          technologies: body.technologies || "[]",
          type: body.projectType || "website",
          date: body.date || "undefined"
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Project created!", data }, { status: 200 });
    } else if (body.type == "edit") {
      // Ensure all JSON fields are strings
      const updateData = {
        url_title: body.urlTitle,
        title: body.title,
        descriptions: typeof body.descriptions === 'string' ? body.descriptions : JSON.stringify(body.descriptions || []),
        images: typeof body.images === 'string' ? body.images : JSON.stringify(body.images || []),
        links: typeof body.links === 'string' ? body.links : JSON.stringify(body.links || []),
        technologies: typeof body.technologies === 'string' ? body.technologies : JSON.stringify(body.technologies || []),
        type: body.projectType || body.type || "website",
        date: body.date || "undefined"
      };

      console.log("Update data being sent:", updateData);

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', body.id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      console.log("Update successful:", data);
      return NextResponse.json({ success: true, message: "Project updated!", data }, { status: 200 });
    } else if (body.type == "delete") {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', body.id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Project deleted!" }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error processing request" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error fetching projects" }, { status: 500 });
  }
}
