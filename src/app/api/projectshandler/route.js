import { createServerClient } from '@/lib/supabase';
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    var body = await req.json();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error processing request" }, { status: 500 });
  }

  try {
    const supabase = createServerClient();

    if (body.type == "new") {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          url_title: body.urlTitle,
          title: body.title,
          descriptions: body.descriptions,
          images: body.images,
          links: body.links,
          technologies: body.technologies || "[]",
          type: body.projectType || "website",
          date: body.date || "undefined"
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Project created!", data }, { status: 200 });
    } else if (body.type == "edit") {
      const { data, error } = await supabase
        .from('projects')
        .update({
          url_title: body.urlTitle,
          title: body.title,
          descriptions: body.descriptions,
          images: body.images,
          links: body.links,
          technologies: body.technologies || "[]",
          type: body.projectType || "website",
          date: body.date || "undefined"
        })
        .eq('id', body.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, message: "Project updated!", data }, { status: 200 });
    } else if (body.type == "delete") {
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

export async function GET(req) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error fetching projects" }, { status: 500 });
  }
}
