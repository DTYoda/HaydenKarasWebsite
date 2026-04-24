import { createServerClient, createServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getSkillCatalog,
  sanitizeProjectTechnologies,
} from "@/lib/tag-catalog";

export async function POST(req) {
  try {
    var body = await req.json();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error processing request" }, { status: 500 });
  }

  // Check admin auth for write operations
  if (body.type !== "get") {
    const isAdmin = await isAdminAuthenticated();
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
    const { byKey: skillCatalogByKey } = await getSkillCatalog(supabase);
    
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
      const sanitizedTech = sanitizeProjectTechnologies(body.technologies, skillCatalogByKey);
      if (sanitizedTech.unknown.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Some technologies are not defined in skills. Create them in Skills first.",
            unknownTags: sanitizedTech.unknown,
          },
          { status: 400 }
        );
      }
      const { data, error } = await supabase
        .from('projects')
        .insert({
          url_title: body.urlTitle,
          title: body.title,
          descriptions: body.descriptions,
          images: body.images,
          links: body.links,
          technologies: JSON.stringify(sanitizedTech.technologies),
          type: body.projectType || "website",
          date: body.date || "undefined"
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Project created!", data }, { status: 200 });
    } else if (body.type == "edit") {
      const sanitizedTech = sanitizeProjectTechnologies(body.technologies, skillCatalogByKey);
      if (sanitizedTech.unknown.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Some technologies are not defined in skills. Create them in Skills first.",
            unknownTags: sanitizedTech.unknown,
          },
          { status: 400 }
        );
      }
      // Ensure all JSON fields are strings
      const updateData = {
        url_title: body.urlTitle,
        title: body.title,
        descriptions: typeof body.descriptions === 'string' ? body.descriptions : JSON.stringify(body.descriptions || []),
        images: typeof body.images === 'string' ? body.images : JSON.stringify(body.images || []),
        links: typeof body.links === 'string' ? body.links : JSON.stringify(body.links || []),
        technologies: JSON.stringify(sanitizedTech.technologies),
        type: body.projectType || body.type || "website",
        date: body.date || "undefined"
      };

      // Only include highlights if it's provided and the column exists
      // If highlights column doesn't exist, this will be skipped gracefully
      if (body.highlights !== undefined) {
        updateData.highlights = typeof body.highlights === 'string' ? body.highlights : JSON.stringify(body.highlights || []);
      }

      console.log("Update data being sent:", updateData);

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', body.id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        // If error is about highlights column not existing, try without it
        if (error.message && error.message.includes('highlights')) {
          console.log("Highlights column doesn't exist, retrying without it");
          delete updateData.highlights;
          const { data: retryData, error: retryError } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', body.id)
            .select()
            .single();
          
          if (retryError) {
            console.error("Retry update error:", retryError);
            throw retryError;
          }
          
          return NextResponse.json({ success: true, message: "Project updated! (Note: highlights column not found in database)", data: retryData }, { status: 200 });
        }
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
