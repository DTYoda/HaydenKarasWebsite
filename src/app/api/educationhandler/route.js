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
        .from('education')
        .insert({
          link: body.link || '',
          link_text: body.linkText || '',
          category: body.category,
          name: body.name,
          description: body.description
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Data received!", data }, { status: 200 });
    } else if (body.type == "edit") {
      const { data, error } = await supabase
        .from('education')
        .update({
          category: body.category,
          name: body.name,
          description: body.description,
          link: body.link || '',
          link_text: body.linkText || ''
        })
        .eq('name', body.oldName)
        .select();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Data received!", data: body }, { status: 200 });
    } else if (body.type == "delete") {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('name', body.name);

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Data received!", data: body }, { status: 200 });
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
      .from('education')
      .select('*')
      .order('name');

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error fetching education" }, { status: 500 });
  }
}
