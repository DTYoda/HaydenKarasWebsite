import { createServerClient, createServiceRoleClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function checkAdminAuth() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("admin-auth");
    return authCookie?.value === "authenticated";
  } catch (error) {
    return false;
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeStatus(status) {
  return status === "published" ? "published" : "draft";
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
      .filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeTimestamp(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function validatePostBody(body) {
  if (!isNonEmptyString(body.title)) {
    return "Title is required";
  }

  if (!isNonEmptyString(body.slug)) {
    return "Slug is required";
  }

  if (!body.contentJson || typeof body.contentJson !== "object") {
    return "contentJson must be a valid JSON object";
  }

  if (!isNonEmptyString(body.contentHtml)) {
    return "contentHtml is required";
  }

  return null;
}

async function ensureSlugUnique(supabase, slug, excludeId) {
  let query = supabase.from("blog_posts").select("id").eq("slug", slug).limit(1);
  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return !data || data.length === 0;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const includeDrafts = searchParams.get("includeDrafts") === "true";
    const limit = Number(searchParams.get("limit") || 100);
    const safeLimit = Number.isNaN(limit) ? 100 : Math.min(Math.max(limit, 1), 200);
    const isAdmin = await checkAdminAuth();

    const supabase = createServerClient();
    const baseSelect = "id,title,slug,excerpt,content_json,content_html,cover_image_url,tags,status,published_at,created_at,updated_at";

    if (slug) {
      let query = supabase.from("blog_posts").select(baseSelect).eq("slug", slug).limit(1);

      if (!isAdmin) {
        query = query.eq("status", "published");
      }

      const { data, error } = await query;
      if (error) {
        throw error;
      }

      const post = data?.[0];
      if (!post) {
        return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: post }, { status: 200 });
    }

    let listQuery = supabase
      .from("blog_posts")
      .select(baseSelect)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(safeLimit);

    if (!(includeDrafts && isAdmin)) {
      listQuery = listQuery.eq("status", "published");
    }

    const { data, error } = await listQuery;
    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data: data || [] }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error fetching blog posts" }, { status: 500 });
  }
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid JSON payload" }, { status: 400 });
  }

  const isAdmin = await checkAdminAuth();
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: Admin authentication required" },
      { status: 401 }
    );
  }

  try {
    const supabase = createServiceRoleClient();

    if (body.type === "new") {
      const validationError = validatePostBody(body);
      if (validationError) {
        return NextResponse.json({ success: false, message: validationError }, { status: 400 });
      }

      const slugUnique = await ensureSlugUnique(supabase, body.slug.trim());
      if (!slugUnique) {
        return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 409 });
      }

      const status = normalizeStatus(body.status);
      const publishedAt =
        status === "published"
          ? normalizeTimestamp(body.publishedAt) || new Date().toISOString()
          : null;

      const payload = {
        title: body.title.trim(),
        slug: body.slug.trim(),
        excerpt: typeof body.excerpt === "string" ? body.excerpt.trim() : "",
        content_json: body.contentJson,
        content_html: body.contentHtml,
        cover_image_url: typeof body.coverImageUrl === "string" ? body.coverImageUrl.trim() : null,
        tags: normalizeTags(body.tags),
        status,
        published_at: publishedAt,
      };

      const { data, error } = await supabase.from("blog_posts").insert(payload).select("*").single();
      if (error) {
        throw error;
      }

      return NextResponse.json({ success: true, message: "Post created", data }, { status: 200 });
    }

    if (body.type === "edit") {
      if (!body.id) {
        return NextResponse.json({ success: false, message: "Post id is required" }, { status: 400 });
      }

      const validationError = validatePostBody(body);
      if (validationError) {
        return NextResponse.json({ success: false, message: validationError }, { status: 400 });
      }

      const slugUnique = await ensureSlugUnique(supabase, body.slug.trim(), body.id);
      if (!slugUnique) {
        return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 409 });
      }

      const status = normalizeStatus(body.status);
      const publishedAt =
        status === "published"
          ? normalizeTimestamp(body.publishedAt) || new Date().toISOString()
          : null;

      const payload = {
        title: body.title.trim(),
        slug: body.slug.trim(),
        excerpt: typeof body.excerpt === "string" ? body.excerpt.trim() : "",
        content_json: body.contentJson,
        content_html: body.contentHtml,
        cover_image_url: typeof body.coverImageUrl === "string" ? body.coverImageUrl.trim() : null,
        tags: normalizeTags(body.tags),
        status,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", body.id)
        .select("*")
        .single();
      if (error) {
        throw error;
      }

      return NextResponse.json({ success: true, message: "Post updated", data }, { status: 200 });
    }

    if (body.type === "delete") {
      if (!body.id) {
        return NextResponse.json({ success: false, message: "Post id is required" }, { status: 400 });
      }

      const { error } = await supabase.from("blog_posts").delete().eq("id", body.id);
      if (error) {
        throw error;
      }

      return NextResponse.json({ success: true, message: "Post deleted" }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Error processing blog request" }, { status: 500 });
  }
}
