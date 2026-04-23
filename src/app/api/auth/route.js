import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createAdminSessionToken,
  getAdminCookieNames,
  getAdminSessionCookieOptions,
  isAdminAuthenticated,
  verifyAdminPassword,
} from "@/lib/admin-auth";

const { session: ADMIN_SESSION_COOKIE, legacy: LEGACY_ADMIN_COOKIE } =
  getAdminCookieNames();

export async function POST(req) {
  try {
    const { password, action } = await req.json();

    if (action === "login") {
      if (verifyAdminPassword(password)) {
        const token = createAdminSessionToken();
        const cookieStore = await cookies();
        cookieStore.set(ADMIN_SESSION_COOKIE, token, getAdminSessionCookieOptions());
        cookieStore.delete(LEGACY_ADMIN_COOKIE);
        return NextResponse.json({ success: true, message: "Login successful" });
      } else {
        return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
      }
    } else if (action === "logout") {
      const cookieStore = await cookies();
      cookieStore.delete(ADMIN_SESSION_COOKIE);
      cookieStore.delete(LEGACY_ADMIN_COOKIE);
      return NextResponse.json({ success: true, message: "Logout successful" });
    } else if (action === "check") {
      const authenticated = await isAdminAuthenticated();
      return NextResponse.json({ 
        authenticated
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
    const authenticated = await isAdminAuthenticated();
    return NextResponse.json({ 
      authenticated
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}

