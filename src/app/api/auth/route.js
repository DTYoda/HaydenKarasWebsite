import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // Change this in production!

export async function POST(req) {
  try {
    const { password, action } = await req.json();

    if (action === "login") {
      if (password === ADMIN_PASSWORD) {
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

