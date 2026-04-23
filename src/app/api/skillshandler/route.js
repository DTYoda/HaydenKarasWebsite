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
      // Validate required fields
      if (!body.category || !body.name || !body.description) {
        return NextResponse.json({ 
          success: false, 
          message: "Missing required fields: category, name, and description are required" 
        }, { status: 400 });
      }

      const { data, error } = await supabase
        .from('skills')
        .insert({
          category: body.category,
          name: body.name,
          description: body.description,
          proficiency: parseInt(body.proficiency) || 80
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
      const { data, error } = await supabase
        .from('skills')
        .update({
          category: body.category,
          name: body.name,
          description: body.description,
          proficiency: parseInt(body.proficiency) || 80
        })
        .eq('name', body.oldName)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ 
          success: false, 
          message: error.message || "Error updating skill",
          error: error 
        }, { status: 500 });
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
