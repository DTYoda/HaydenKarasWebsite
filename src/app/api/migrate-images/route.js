import { createServerClient, createServiceRoleClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

// Helper to check admin authentication
async function checkAdminAuth() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("admin-auth");
    return authCookie?.value === "authenticated";
  } catch (error) {
    return false;
  }
}

export async function POST(req) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Admin authentication required",
        },
        { status: 401 }
      );
    }

    const supabase = createServiceRoleClient();
    const results = {
      projects: { processed: 0, updated: 0, errors: [] },
      static: { processed: 0, uploaded: 0, errors: [] },
    };

    // Step 1: Migrate project images
    try {
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*");

      if (projectsError) throw projectsError;

      for (const project of projects || []) {
        results.projects.processed++;
        try {
          let images = [];
          try {
            images = JSON.parse(project.images || "[]");
          } catch (e) {
            console.error(`Error parsing images for project ${project.id}:`, e);
            continue;
          }

          if (!Array.isArray(images) || images.length === 0) continue;

          const updatedImages = [];
          let hasChanges = false;

          for (const imagePath of images) {
            // Skip if already a Supabase URL
            if (
              imagePath &&
              (imagePath.startsWith("http://") ||
                imagePath.startsWith("https://"))
            ) {
              updatedImages.push(imagePath);
              continue;
            }

            // Skip if empty
            if (!imagePath) {
              continue;
            }

            hasChanges = true;

            // Construct local file path
            // Images are stored as: /{url_title}/{imagePath}
            // In Next.js, public folder is at project root
            const projectRoot = process.cwd();
            const localPath = path.join(
              projectRoot,
              "public",
              project.url_title,
              imagePath
            );

            // Check if file exists
            if (!fs.existsSync(localPath)) {
              console.warn(`File not found: ${localPath}`);
              results.projects.errors.push(
                `Project ${project.title}: Image not found - ${imagePath}`
              );
              continue;
            }

            // Read file
            const fileBuffer = fs.readFileSync(localPath);
            const fileExt = path.extname(imagePath);
            const fileName = path.basename(imagePath, fileExt);
            const uniqueFileName = `${
              project.id
            }-${fileName}-${Date.now()}${fileExt}`;
            const storagePath = `projects/${project.id}/${uniqueFileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
              .from("project-images")
              .upload(storagePath, fileBuffer, {
                contentType: getContentType(fileExt),
                upsert: true,
                cacheControl: "3600",
              });

            if (uploadError) {
              console.error(`Upload error for ${imagePath}:`, uploadError);
              results.projects.errors.push(
                `Project ${project.title}: Upload failed - ${imagePath}`
              );
              continue;
            }

            // Get public URL
            const {
              data: { publicUrl },
            } = supabase.storage
              .from("project-images")
              .getPublicUrl(storagePath);

            updatedImages.push(publicUrl);
            console.log(`Migrated: ${imagePath} -> ${publicUrl}`);
          }

          // Update project if there were changes
          if (hasChanges && updatedImages.length > 0) {
            const { error: updateError } = await supabase
              .from("projects")
              .update({ images: JSON.stringify(updatedImages) })
              .eq("id", project.id);

            if (updateError) {
              console.error(
                `Update error for project ${project.id}:`,
                updateError
              );
              results.projects.errors.push(
                `Project ${project.title}: Database update failed`
              );
            } else {
              results.projects.updated++;
              console.log(`Updated project: ${project.title}`);
            }
          }
        } catch (error) {
          console.error(`Error processing project ${project.id}:`, error);
          results.projects.errors.push(
            `Project ${project.title}: ${error.message}`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      results.projects.errors.push(
        `Failed to fetch projects: ${error.message}`
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Migration completed",
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error during migration",
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Check admin authentication
    const isAdmin = await checkAdminAuth();
    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Admin authentication required",
        },
        { status: 401 }
      );
    }

    const supabase = createServerClient();

    // Get all projects and check which ones need migration
    const { data: projects, error } = await supabase
      .from("projects")
      .select("id, title, url_title, images");

    if (error) throw error;

    const needsMigration = [];
    const alreadyMigrated = [];

    for (const project of projects || []) {
      let images = [];
      try {
        images = JSON.parse(project.images || "[]");
      } catch (e) {
        continue;
      }

      if (!Array.isArray(images) || images.length === 0) continue;

      const hasLocalPaths = images.some(
        (img) =>
          img && !img.startsWith("http://") && !img.startsWith("https://")
      );

      if (hasLocalPaths) {
        needsMigration.push({
          id: project.id,
          title: project.title,
          url_title: project.url_title,
          imageCount: images.length,
        });
      } else {
        alreadyMigrated.push({
          id: project.id,
          title: project.title,
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        needsMigration: needsMigration.length,
        alreadyMigrated: alreadyMigrated.length,
        projects: {
          needsMigration,
          alreadyMigrated,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking migration status:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error checking migration status",
      },
      { status: 500 }
    );
  }
}

function getContentType(ext) {
  const contentTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".JPG": "image/jpeg",
    ".PNG": "image/png",
  };
  return contentTypes[ext.toLowerCase()] || "image/jpeg";
}
