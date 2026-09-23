import { createServerClient, createServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getSkillCatalog,
  sanitizeProjectTechnologies,
} from "@/lib/tag-catalog";
import { getProjectType, getWriteAction, normalizeDateValue } from "@/lib/api-action";
import { mapProject, stringifyJsonField } from "@/lib/projects";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function POST(req) {
  try {
    var body = await req.json();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error processing request" }, { status: 500 });
  }

  const action = getWriteAction(body);

  if (action !== "get") {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized: Admin authentication required"
      }, { status: 401 });
    }
  }

  try {
    const supabase = createServiceRoleClient();
    const skillCatalog = await getSkillCatalog(supabase);

    if (action == "new") {
      const sanitizedTech = sanitizeProjectTechnologies(body.technologies, skillCatalog);
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
          descriptions: stringifyJsonField(body.descriptions, []),
          images: stringifyJsonField(body.images, []),
          links: stringifyJsonField(body.links, []),
          technologies: JSON.stringify(sanitizedTech.technologies),
          type: getProjectType(body),
          date: normalizeDateValue(body.date),
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Project created!", data: mapProject(data) }, { status: 200 });
    } else if (action == "edit") {
      const sanitizedTech = sanitizeProjectTechnologies(body.technologies, skillCatalog);
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

      const updateData = {
        url_title: body.urlTitle,
        title: body.title,
        descriptions: stringifyJsonField(body.descriptions, []),
        images: stringifyJsonField(body.images, []),
        links: stringifyJsonField(body.links, []),
        technologies: JSON.stringify(sanitizedTech.technologies),
        type: getProjectType(body),
        date: normalizeDateValue(body.date),
      };

      if (body.highlights !== undefined) {
        updateData.highlights = stringifyJsonField(body.highlights, []);
      }

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', body.id)
        .select()
        .single();

      if (error) {
        if (error.message && error.message.includes('highlights')) {
          delete updateData.highlights;
          const { data: retryData, error: retryError } = await supabase
            .from('projects')
            .update(updateData)
            .eq('id', body.id)
            .select()
            .single();

          if (retryError) throw retryError;
          return NextResponse.json({ success: true, message: "Project updated!", data: mapProject(retryData) }, { status: 200 });
        }
        throw error;
      }

      return NextResponse.json({ success: true, message: "Project updated!", data: mapProject(data) }, { status: 200 });
    } else if (action == "delete") {
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

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*');

    if (error) throw error;
    return NextResponse.json({
      success: true,
      data: (data || []).map(mapProject).filter(Boolean),
    }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error fetching projects" }, { status: 500 });
  }
}
