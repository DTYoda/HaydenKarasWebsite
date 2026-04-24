import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";
import { getTagUsageMap } from "@/lib/tag-usage";
import { normalizeTagKey } from "@/lib/tags";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag");
    const includeAll = searchParams.get("all") === "1";

    const supabase = createServiceRoleClient();
    const usageByKey = await getTagUsageMap(supabase);

    if (tag) {
      const usage = usageByKey[normalizeTagKey(tag)] || null;
      return NextResponse.json({ success: true, data: usage }, { status: 200 });
    }

    if (includeAll) {
      return NextResponse.json({ success: true, data: usageByKey }, { status: 200 });
    }

    return NextResponse.json(
      { success: true, data: Object.values(usageByKey) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tag usage:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching tag usage" },
      { status: 500 }
    );
  }
}
