import { NextResponse } from "next/server";
 import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { supabase } from "@/integrations/supabase/client";
export async function POST(req: Request) {
 
  const { password } = await req.json();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Password updated!" });
}
