import { createServerClient, createServiceRoleClient } from '@/lib/supabase';
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(req) {
  try {
    // Check admin authentication
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized: Admin authentication required" 
      }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const projectId = formData.get('projectId');
    const fileName = formData.get('fileName');

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    // Use service role client to bypass RLS for admin operations
    const supabase = createServiceRoleClient();
    
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const uniqueFileName = fileName || `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = projectId 
      ? `projects/${projectId}/${uniqueFileName}`
      : `projects/temp/${uniqueFileName}`;

    // Read file as ArrayBuffer (Supabase accepts ArrayBuffer, Blob, or File)
    const arrayBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(filePath, arrayBuffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
        cacheControl: '3600'
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ 
        success: false, 
        message: error.message || "Error uploading image" 
      }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      path: filePath
    }, { status: 200 });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Error processing upload" 
    }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    // Check admin authentication
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized: Admin authentication required" 
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json({ success: false, message: "No file path provided" }, { status: 400 });
    }

    // Use service role client to bypass RLS for admin operations
    const supabase = createServiceRoleClient();
    
    const { error } = await supabase.storage
      .from('project-images')
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json({ 
        success: false, 
        message: error.message || "Error deleting image" 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Image deleted" }, { status: 200 });

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Error processing delete" 
    }, { status: 500 });
  }
}

