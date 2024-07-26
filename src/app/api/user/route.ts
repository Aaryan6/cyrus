import db from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { users } from "../../../../migrations/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    console.log("user", user);
    if (!user) return NextResponse.json({ message: error }, { status: 404 });
    const res = await db.select().from(users).where(eq(users.id, user.id));
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
