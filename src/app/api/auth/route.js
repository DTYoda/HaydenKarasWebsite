import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Get admin password from environment - ensure it's available at runtime
function getAdminPassword() {
  // In production, this should be set as an environment variable
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.error("ADMIN_PASSWORD environment variable is not set!");
    // Fallback for development only
    if (process.env.NODE_ENV === "development") {
      return "admin123";
    }
    throw new Error("Admin password not configured");
  }
  return password;
}

export async function POST(req) {
  try {
    const { password, action } = await req.json();

    if (action === "login") {
      const adminPassword = getAdminPassword();
      if (password === adminPassword) {
        const cookieStore = await cookies();
        cookieStore.set("admin-auth", "authenticated", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        return NextResponse.json({ success: true, message: "Login successful" });
      } else {
        return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
      }
    } else if (action === "logout") {
      const cookieStore = await cookies();
      cookieStore.delete("admin-auth");
      return NextResponse.json({ success: true, message: "Logout successful" });
    } else if (action === "check") {
      const cookieStore = await cookies();
      const authCookie = cookieStore.get("admin-auth");
      return NextResponse.json({ 
        authenticated: authCookie?.value === "authenticated" 
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ success: false, message: "Error processing request" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("admin-auth");
    return NextResponse.json({ 
      authenticated: authCookie?.value === "authenticated" 
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}

