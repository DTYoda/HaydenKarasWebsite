import { createServerClient, createServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

function normalizeYearsExperience(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.floor(parsed);
}

function normalizeTagValue(value) {
  return String(value || "").trim().toLowerCase();
}

async function findSkillByNormalizedName(supabase, targetName) {
  const normalizedTarget = normalizeTagValue(targetName);
  if (!normalizedTarget) return null;
  const { data, error } = await supabase.from("skills").select("id,name");
  if (error) throw error;
  return (data || []).find((skill) => normalizeTagValue(skill.name) === normalizedTarget) || null;
}

function replaceTagInList(tags, oldName, newName) {
  if (!Array.isArray(tags)) return { changed: false, next: tags };
  const oldKey = normalizeTagValue(oldName);
  const next = tags.map((tag) => {
    if (normalizeTagValue(tag) === oldKey) return newName;
    return tag;
  });
  const changed = next.some((tag, index) => tag !== tags[index]);
  return { changed, next };
}

function normalizeProjectTechnologies(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function propagateSkillMetadata(
  supabase,
  oldName,
  newName,
  newCategory
) {
  const oldKey = normalizeTagValue(oldName);
  const newLabel = String(newName || "").trim();
  const nextCategory = String(newCategory || "").trim() || "other";
  if (!oldKey || !newLabel) return;

  const [projectsRes, workRes, timelineRes] = await Promise.all([
    supabase.from("projects").select("id,technologies"),
    supabase.from("work_research_experience").select("id,tags"),
    supabase.from("education_timeline_courses").select("id,tags"),
  ]);

  if (projectsRes.error) throw projectsRes.error;
  if (workRes.error) throw workRes.error;
  if (timelineRes.error) throw timelineRes.error;

  const projectUpdates = (projectsRes.data || [])
    .map((project) => {
      const parsed = normalizeProjectTechnologies(project.technologies);
      let changed = false;
      const next = parsed.map((tech) => {
        if (!tech || typeof tech !== "object") return tech;
        const currentTitle = String(tech.title || tech.name || "").trim();
        if (normalizeTagValue(currentTitle) !== oldKey) return tech;
        const updated = {
          ...tech,
          title: newLabel,
          category: nextCategory,
          ...(tech.name !== undefined ? { name: newLabel } : {}),
        };
        if (
          updated.title !== tech.title ||
          updated.category !== tech.category ||
          updated.name !== tech.name
        ) {
          changed = true;
        }
        return updated;
      });
      if (!changed) return null;
      return supabase.from("projects").update({ technologies: next }).eq("id", project.id);
    })
    .filter(Boolean);

  const shouldRename = oldKey !== normalizeTagValue(newLabel);
  const workUpdates = shouldRename
    ? (workRes.data || [])
    .map((entry) => {
      const { changed, next } = replaceTagInList(entry.tags, oldName, newLabel);
      if (!changed) return null;
      return supabase
        .from("work_research_experience")
        .update({ tags: next })
        .eq("id", entry.id);
    })
    .filter(Boolean)
    : [];

  const timelineUpdates = shouldRename
    ? (timelineRes.data || [])
    .map((course) => {
      const { changed, next } = replaceTagInList(course.tags, oldName, newLabel);
      if (!changed) return null;
      return supabase
        .from("education_timeline_courses")
        .update({ tags: next })
        .eq("id", course.id);
    })
    .filter(Boolean)
    : [];

  const results = await Promise.all([...projectUpdates, ...workUpdates, ...timelineUpdates]);
  const failed = results.find((result) => result?.error);
  if (failed?.error) throw failed.error;
}

export async function POST(req) {
  try {
    var body = await req.json();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error processing request" }, { status: 500 });
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

    if (body.type == "new") {
      const normalizedName = String(body.name || "").trim();
      // Validate required fields
      if (!body.category || !normalizedName) {
        return NextResponse.json({ 
          success: false, 
          message: "Missing required fields: category and name are required" 
        }, { status: 400 });
      }
      const existingSkill = await findSkillByNormalizedName(supabase, normalizedName);
      if (existingSkill) {
        return NextResponse.json(
          {
            success: false,
            message: `Skill tag "${normalizedName}" already exists. Edit the existing tag instead.`,
          },
          { status: 409 }
        );
      }

      const { data, error } = await supabase
        .from('skills')
        .insert({
          category: body.category,
          name: normalizedName,
          description: body.description || "",
          proficiency: parseInt(body.proficiency) || 80,
          years_experience: normalizeYearsExperience(body.years_experience),
          top_project_label: body.top_project_label || "",
          top_project_link: body.top_project_link || "",
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ 
          success: false, 
          message: error.message || "Error creating skill",
          error: error 
        }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Data received!", data }, { status: 200 });
    } else if (body.type == "edit") {
      const oldName = String(body.oldName || "").trim();
      const newName = String(body.name || "").trim();
      if (!body.category || !newName) {
        return NextResponse.json(
          {
            success: false,
            message: "Missing required fields: category and name are required",
          },
          { status: 400 }
        );
      }
      const existingSkill = await findSkillByNormalizedName(supabase, newName);
      if (existingSkill && String(existingSkill.id) !== String(body.id || "")) {
        return NextResponse.json(
          {
            success: false,
            message: `Skill tag "${newName}" already exists. Rename failed to avoid duplicates.`,
          },
          { status: 409 }
        );
      }
      const { data, error } = await supabase
        .from('skills')
        .update({
          category: body.category,
          name: newName,
          description: body.description || "",
          proficiency: parseInt(body.proficiency) || 80,
          years_experience: normalizeYearsExperience(body.years_experience),
          top_project_label: body.top_project_label || "",
          top_project_link: body.top_project_link || "",
        })
        .eq('id', body.id)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ 
          success: false, 
          message: error.message || "Error updating skill",
          error: error 
        }, { status: 500 });
      }
      if (oldName && newName) {
        await propagateSkillMetadata(supabase, oldName, newName, body.category);
      }
      return NextResponse.json({ success: true, message: "Data received!", data: body }, { status: 200 });
    } else if (body.type == "delete") {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('name', body.name);

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ 
          success: false, 
          message: error.message || "Error deleting skill",
          error: error 
        }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Data received!", data: body }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Error processing request",
      error: error.toString()
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name');

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error fetching skills" }, { status: 500 });
  }
}
