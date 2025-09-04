import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({
    cookies: () => cookies() // DO NOT call cookies() at top-level
  });  try {
    const body = await req.json();
    const { email, name, brandName, isBrand, ip_address, source } = body;

    const { error } = await supabase.from("waitlist").insert([
      {
        email,
        full_name: name,
        brand_name: isBrand ? brandName : null,
        is_brand: isBrand,
        ip_address,
        source,
      },
    ]);

    if (error) {
      // ✅ Duplicate email (Postgres unique constraint violation)
      if (error.code === "23505") {
        return NextResponse.json(
          { success: false, message: "You're already on the waitlist!" },
          { status: 200 }
        );
      }

      throw error;
    }

    return NextResponse.json({ success: true, message: "Joined waitlist!" });
  } catch (error: any) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
