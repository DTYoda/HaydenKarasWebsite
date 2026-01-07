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

    if (body.type == "new" || body.type == "edit") {
      // Check if exists
      const { data: existing } = await supabase
        .from('static_content')
        .select('id')
        .eq('key', body.key)
        .single();

      let result;
      if (existing) {
        // Update
        const { data, error } = await supabase
          .from('static_content')
          .update({
            title: body.title,
            content: body.content,
            section: body.section
          })
          .eq('key', body.key)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Insert
        const { data, error } = await supabase
          .from('static_content')
          .insert({
            key: body.key,
            title: body.title,
            content: body.content,
            section: body.section
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      return NextResponse.json({ success: true, message: "Content saved!", data: result }, { status: 200 });
    } else if (body.type == "delete") {
      const { error } = await supabase
        .from('static_content')
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
    const { data, error } = await supabase
      .from('static_content')
      .select('*');

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Error fetching content" }, { status: 500 });
  }
}
