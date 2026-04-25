import { createServiceRoleClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSkillCatalog, resolveTagLabels, sanitizeTagSelection } from "@/lib/tag-catalog";

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export async function GET() {
  try {
    // Use service role for reliable public content reads even if RLS policies lag behind schema changes.
    const supabase = createServiceRoleClient();
    const skillCatalog = await getSkillCatalog(supabase);
    const { data, error } = await supabase
      .from("education_timeline_courses")
      .select("*")
      .order("display_order", { ascending: true })
      .order("course_name", { ascending: true });

    if (error) throw error;
    const normalized = (data || []).map((course) => ({
      ...course,
      tag_ids: Array.isArray(course.tags) ? course.tags : [],
      tags: resolveTagLabels(course.tags, skillCatalog.byId, skillCatalog.byKey),
    }));
    return NextResponse.json({ success: true, data: normalized }, { status: 200 });
  } catch (error) {
    console.error("Error fetching education timeline courses:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching education timeline courses" },
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
    const skillCatalog = await getSkillCatalog(supabase);
    const normalizedTags = sanitizeTagSelection(body.tags, skillCatalog);
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
    const payload = {
      term_label: body.term_label || "",
      course_name: body.course_name || "",
      subtitle: body.subtitle || "",
      mastered_summary: body.mastered_summary || "",
      description: body.description || "",
      topics: normalizeList(body.topics),
      outcomes: normalizeList(body.outcomes),
      tags: normalizedTags.tagIds,
      more_info_link: body.more_info_link || "",
      more_info_link_text: body.more_info_link_text || body.moreInfoLinkText || "",
      display_order: Number.isFinite(Number(body.display_order))
        ? Number(body.display_order)
        : 100,
    };

    if (body.type === "new") {
      const { data, error } = await supabase
        .from("education_timeline_courses")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    if (body.type === "edit") {
      const { data, error } = await supabase
        .from("education_timeline_courses")
        .update(payload)
        .eq("id", body.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    if (body.type === "delete") {
      const { error } = await supabase
        .from("education_timeline_courses")
        .delete()
        .eq("id", body.id);

      if (error) throw error;
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error processing education timeline operation:", error);
    return NextResponse.json(
      { success: false, message: "Error processing request" },
      { status: 500 }
    );
  }
}
