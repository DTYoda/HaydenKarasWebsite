import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID, createHash } from "crypto";
import { createServiceRoleClient } from "@/lib/supabase";

const ANON_COOKIE_NAME = "blog-anon-id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getClientIp(headerList) {
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return headerList.get("x-real-ip") || "unknown";
}

function buildFingerprint({ anonId, ip, userAgent, action }) {
  return createHash("sha256")
    .update(`${anonId}|${ip}|${userAgent}|${action}`)
    .digest("hex");
}

async function hasEvent(supabase, postId, eventType, fingerprint) {
  const { data, error } = await supabase
    .from("blog_post_engagement_events")
    .select("id")
    .eq("post_id", postId)
    .eq("event_type", eventType)
    .eq("fingerprint", fingerprint)
    .limit(1);

  if (error) {
    throw error;
  }

  return Boolean(data?.length);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const action = body?.action;
    const slug = body?.slug;

    if (!slug || (action !== "view" && action !== "like")) {
      return NextResponse.json(
        { success: false, message: "slug and valid action are required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const headerStore = await headers();
    const supabase = createServiceRoleClient();

    const existingAnonId = cookieStore.get(ANON_COOKIE_NAME)?.value;
    const anonId = existingAnonId || randomUUID();
    const shouldSetCookie = !existingAnonId;

    const ip = getClientIp(headerStore);
    const userAgent = (headerStore.get("user-agent") || "unknown").slice(0, 255);
    const fingerprint = buildFingerprint({ anonId, ip, userAgent, action });
    const likeFingerprint = buildFingerprint({ anonId, ip, userAgent, action: "like" });

    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .select("id, status, views_count, likes_count")
      .eq("slug", slug)
      .limit(1)
      .single();

    if (postError || !post || post.status !== "published") {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    const alreadyTracked = await hasEvent(supabase, post.id, action, fingerprint);

    let viewsCount = post.views_count || 0;
    let likesCount = post.likes_count || 0;

    if (!alreadyTracked) {
      const { error: insertError } = await supabase.from("blog_post_engagement_events").insert({
        post_id: post.id,
        event_type: action,
        fingerprint,
        ip_address: ip,
        user_agent: userAgent,
      });

      if (insertError) {
        throw insertError;
      }

      if (action === "view") {
        viewsCount += 1;
      } else {
        likesCount += 1;
      }

      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
          views_count: viewsCount,
          likes_count: likesCount,
        })
        .eq("id", post.id);

      if (updateError) {
        throw updateError;
      }
    }

    const likedByCurrentUser = await hasEvent(supabase, post.id, "like", likeFingerprint);
    const response = NextResponse.json(
      {
        success: true,
        alreadyTracked,
        likesCount,
        viewsCount,
        likedByCurrentUser,
      },
      { status: 200 }
    );

    if (shouldSetCookie) {
      response.cookies.set(ANON_COOKIE_NAME, anonId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      });
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to track engagement" },
      { status: 500 }
    );
  }
}
