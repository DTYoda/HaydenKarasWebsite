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

function rewriteTagIdsToSkillId(tags, skillId, fallbackOldNameKey = "") {
  if (!Array.isArray(tags)) return { changed: false, next: [] };
  const oldNameKey = normalizeTagValue(fallbackOldNameKey);
  let changed = false;
  const next = [];
  const seen = new Set();
  tags.forEach((tag) => {
    const raw = String(tag || "").trim();
    if (!raw) {
      changed = true;
      return;
    }
    const mapped = normalizeTagValue(raw) === oldNameKey ? String(skillId) : raw;
    if (mapped !== raw) changed = true;
    if (seen.has(mapped)) {
      changed = true;
      return;
    }
    seen.add(mapped);
    next.push(mapped);
  });
  return { changed, next };
}

function removeTagIdFromList(tags, skillId, fallbackName = "") {
  if (!Array.isArray(tags)) return { changed: false, next: [] };
  const targetId = String(skillId || "").trim();
  const fallbackKey = normalizeTagValue(fallbackName);
  let changed = false;
  const next = [];
  const seen = new Set();
  tags.forEach((tag) => {
    const raw = String(tag || "").trim();
    if (!raw) {
      changed = true;
      return;
    }
    const shouldRemove = raw === targetId || normalizeTagValue(raw) === fallbackKey;
    if (shouldRemove) {
      changed = true;
      return;
    }
    if (seen.has(raw)) {
      changed = true;
      return;
    }
    seen.add(raw);
    next.push(raw);
  });
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
  skillId,
  oldName,
  newName,
  newCategory
) {
  const oldKey = normalizeTagValue(oldName);
  const newLabel = String(newName || "").trim();
  const nextCategory = String(newCategory || "").trim() || "other";
  if (!oldKey || !newLabel) return;

  const [projectsRes, workRes, timelineRes, blogRes] = await Promise.all([
    supabase.from("projects").select("id,technologies"),
    supabase.from("work_research_experience").select("id,tags"),
    supabase.from("education_timeline_courses").select("id,tags"),
    supabase.from("blog_posts").select("id,tags"),
  ]);

  if (projectsRes.error) throw projectsRes.error;
  if (workRes.error) throw workRes.error;
  if (timelineRes.error) throw timelineRes.error;
  if (blogRes.error) throw blogRes.error;

  const projectUpdates = (projectsRes.data || [])
    .map((project) => {
      const parsed = normalizeProjectTechnologies(project.technologies);
      let changed = false;
      const next = parsed.map((tech) => {
        if (!tech || typeof tech !== "object") return tech;
        const currentTitle = String(tech.title || tech.name || "").trim();
        const currentId = String(tech.id || tech.skill_id || "").trim();
        if (currentId !== String(skillId) && normalizeTagValue(currentTitle) !== oldKey) return tech;
        const updated = {
          ...tech,
          id: String(skillId),
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

  const workUpdates = (workRes.data || [])
    .map((entry) => {
      const { changed, next } = rewriteTagIdsToSkillId(entry.tags, skillId, oldName);
      if (!changed) return null;
      return supabase
        .from("work_research_experience")
        .update({ tags: next })
        .eq("id", entry.id);
    })
    .filter(Boolean);

  const timelineUpdates = (timelineRes.data || [])
    .map((course) => {
      const { changed, next } = rewriteTagIdsToSkillId(course.tags, skillId, oldName);
      if (!changed) return null;
      return supabase
        .from("education_timeline_courses")
        .update({ tags: next })
        .eq("id", course.id);
    })
    .filter(Boolean);

  const blogUpdates = (blogRes.data || [])
    .map((post) => {
      const { changed, next } = rewriteTagIdsToSkillId(post.tags, skillId, oldName);
      if (!changed) return null;
      return supabase.from("blog_posts").update({ tags: next }).eq("id", post.id);
    })
    .filter(Boolean);

  const results = await Promise.all([
    ...projectUpdates,
    ...workUpdates,
    ...timelineUpdates,
    ...blogUpdates,
  ]);
  const failed = results.find((result) => result?.error);
  if (failed?.error) throw failed.error;
}

async function removeSkillReferencesOnDelete(supabase, skillId, skillName) {
  const [projectsRes, workRes, timelineRes, blogRes] = await Promise.all([
    supabase.from("projects").select("id,technologies"),
    supabase.from("work_research_experience").select("id,tags"),
    supabase.from("education_timeline_courses").select("id,tags"),
    supabase.from("blog_posts").select("id,tags"),
  ]);

  if (projectsRes.error) throw projectsRes.error;
  if (workRes.error) throw workRes.error;
  if (timelineRes.error) throw timelineRes.error;
  if (blogRes.error) throw blogRes.error;

  const targetId = String(skillId || "").trim();
  const targetNameKey = normalizeTagValue(skillName);

  const projectUpdates = (projectsRes.data || [])
    .map((project) => {
      const parsed = normalizeProjectTechnologies(project.technologies);
      let changed = false;
      const next = parsed.filter((tech) => {
        if (!tech || typeof tech !== "object") return false;
        const techId = String(tech.id || tech.skill_id || "").trim();
        const techNameKey = normalizeTagValue(tech.title || tech.name || "");
        const shouldKeep = techId !== targetId && techNameKey !== targetNameKey;
        if (!shouldKeep) changed = true;
        return shouldKeep;
      });
      if (!changed) return null;
      return supabase.from("projects").update({ technologies: next }).eq("id", project.id);
    })
    .filter(Boolean);

  const workUpdates = (workRes.data || [])
    .map((entry) => {
      const { changed, next } = removeTagIdFromList(entry.tags, targetId, skillName);
      if (!changed) return null;
      return supabase.from("work_research_experience").update({ tags: next }).eq("id", entry.id);
    })
    .filter(Boolean);

  const timelineUpdates = (timelineRes.data || [])
    .map((course) => {
      const { changed, next } = removeTagIdFromList(course.tags, targetId, skillName);
      if (!changed) return null;
      return supabase.from("education_timeline_courses").update({ tags: next }).eq("id", course.id);
    })
    .filter(Boolean);

  const blogUpdates = (blogRes.data || [])
    .map((post) => {
      const { changed, next } = removeTagIdFromList(post.tags, targetId, skillName);
      if (!changed) return null;
      return supabase.from("blog_posts").update({ tags: next }).eq("id", post.id);
    })
    .filter(Boolean);

  const results = await Promise.all([
    ...projectUpdates,
    ...workUpdates,
    ...timelineUpdates,
    ...blogUpdates,
  ]);
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
        await propagateSkillMetadata(supabase, body.id, oldName, newName, body.category);
      }
      return NextResponse.json({ success: true, message: "Data received!", data: body }, { status: 200 });
    } else if (body.type == "delete") {
      if (!body.id) {
        return NextResponse.json(
          { success: false, message: "Skill id is required for delete" },
          { status: 400 }
        );
      }
      const { data: existingSkill, error: existingError } = await supabase
        .from("skills")
        .select("id,name")
        .eq("id", body.id)
        .single();
      if (existingError || !existingSkill) {
        return NextResponse.json(
          { success: false, message: "Skill not found" },
          { status: 404 }
        );
      }

      await removeSkillReferencesOnDelete(supabase, existingSkill.id, existingSkill.name);
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', body.id);

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
