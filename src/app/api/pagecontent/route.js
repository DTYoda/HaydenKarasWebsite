import { createServerClient, createServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getWriteAction } from "@/lib/api-action";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const CONTENT_TYPES = new Set(["text", "json", "html", "number"]);

function getContentType(body) {
  if (body?.contentType && CONTENT_TYPES.has(body.contentType)) {
    return body.contentType;
  }
  if (body?.type && CONTENT_TYPES.has(body.type)) {
    return body.type;
  }
  return "text";
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
    const action = getWriteAction(body);

    if (action == "new" || action == "edit") {
      const { data: existing } = await supabase
        .from('page_content')
        .select('id')
        .eq('key', body.key)
        .maybeSingle();

      let result;
      if (existing) {
        const { data, error } = await supabase
          .from('page_content')
          .update({
            page: body.page,
            section: body.section,
            content: body.content,
            type: getContentType(body)
          })
          .eq('key', body.key)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('page_content')
          .insert({
            key: body.key,
            page: body.page,
            section: body.section,
            content: body.content,
            type: getContentType(body)
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return NextResponse.json({ success: true, message: "Content saved!", data: result }, { status: 200 });
    } else if (action == "delete") {
      const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('key', body.key);

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Content deleted!" }, { status: 200 });
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
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    let query = supabase.from('page_content').select('*');

    if (page) query = query.eq('page', page);
    if (section) query = query.eq('section', section);

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error fetching content" }, { status: 500 });
  }
}
