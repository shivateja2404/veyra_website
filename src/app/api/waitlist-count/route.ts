import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { supabase } from "@/integrations/supabase/client";
export async function GET() {
 
  try {
    const { count, error } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    // Always at least 1000, or actual count + 1000
    const waitlistCount = Math.max(1000, (count || 0) + 1000);

    return NextResponse.json({ success: true, waitlistCount });
  } catch (error) {
    console.error("Error fetching waitlist count:", error);
    return NextResponse.json(
      { success: false, waitlistCount: 1000 },
      { status: 500 }
    );
  }
}
