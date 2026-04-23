import { createServerClient, createServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

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
      const { data, error } = await supabase
        .from('top_skills')
        .insert({
          name: body.name,
          proficiency: body.proficiency,
          category: body.category,
          order: body.order || 0
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Top skill created!", data }, { status: 200 });
    } else if (body.type == "edit") {
      const { data, error } = await supabase
        .from('top_skills')
        .update({
          name: body.name,
          proficiency: body.proficiency,
          category: body.category,
          order: body.order || 0
        })
        .eq('id', body.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Top skill updated!", data }, { status: 200 });
    } else if (body.type == "delete") {
      const { error } = await supabase
        .from('top_skills')
        .delete()
        .eq('id', body.id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Top skill deleted!" }, { status: 200 });
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
      .from('top_skills')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error fetching top skills" }, { status: 500 });
  }
}
