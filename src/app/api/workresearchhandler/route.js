import { createServiceRoleClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSkillCatalog, sanitizeTagSelection } from "@/lib/tag-catalog";

function normalizeHighlights(highlights) {
  if (Array.isArray(highlights)) {
    return highlights.map((item) => String(item)).filter(Boolean);
  }
  if (typeof highlights === "string" && highlights.trim().length > 0) {
    return highlights
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeExperienceType(value) {
  return value === "research" ? "research" : "work";
}

function parseBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return false;
}

export async function GET() {
  try {
    // Use service role for reliable public content reads even if RLS policies lag behind schema changes.
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("work_research_experience")
      .select("*")
      .order("display_order", { ascending: true })
      .order("start_date", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data: data || [] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching work and research experience:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching work and research experience" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error processing request" },
      { status: 500 }
    );
  }

  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin authentication required" },
        { status: 401 }
      );
    }

    const supabase = createServiceRoleClient();
    const { byKey: skillCatalogByKey } = await getSkillCatalog(supabase);

    if (body.type === "new") {
      const normalizedTags = sanitizeTagSelection(body.tags, skillCatalogByKey);
      if (normalizedTags.unknown.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Some tags are not defined in skills. Create them in Technical Skills first.",
            unknownTags: normalizedTags.unknown,
          },
          { status: 400 }
        );
      }
      const { data, error } = await supabase
        .from("work_research_experience")
        .insert({
          title: body.title,
          organization: body.organization || "",
          type: normalizeExperienceType(
            body.experience_type || body.experienceType || body.category
          ),
          start_date: body.start_date || null,
          end_date: body.end_date || null,
          is_current: parseBoolean(body.is_current),
          summary: body.summary || "",
          highlights: normalizeHighlights(body.highlights),
          tags: normalizedTags.tags,
          link: body.link || "",
          link_text: body.link_text || body.linkText || "",
          display_order: Number.isFinite(Number(body.display_order))
            ? Number(body.display_order)
            : 100,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    if (body.type === "edit") {
      const normalizedTags = sanitizeTagSelection(body.tags, skillCatalogByKey);
      if (normalizedTags.unknown.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Some tags are not defined in skills. Create them in Technical Skills first.",
            unknownTags: normalizedTags.unknown,
          },
          { status: 400 }
        );
      }
      const { data, error } = await supabase
        .from("work_research_experience")
        .update({
          title: body.title,
          organization: body.organization || "",
          type: normalizeExperienceType(
            body.experience_type || body.experienceType || body.category
          ),
          start_date: body.start_date || null,
          end_date: body.end_date || null,
          is_current: parseBoolean(body.is_current),
          summary: body.summary || "",
          highlights: normalizeHighlights(body.highlights),
          tags: normalizedTags.tags,
          link: body.link || "",
          link_text: body.link_text || body.linkText || "",
          display_order: Number.isFinite(Number(body.display_order))
            ? Number(body.display_order)
            : 100,
        })
        .eq("id", body.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    if (body.type === "delete") {
      const { error } = await supabase
        .from("work_research_experience")
        .delete()
        .eq("id", body.id);

      if (error) throw error;
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error processing work/research operation:", error);
    return NextResponse.json(
      { success: false, message: "Error processing request" },
      { status: 500 }
    );
  }
}
