// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
 
// For API Routes (route.ts)
 
// For Server Components (app/ directory)
export const supabaseServer = () => createServerComponentClient({ cookies });
