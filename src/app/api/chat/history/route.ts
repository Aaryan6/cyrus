import db from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { chats } from "../../../../../migrations/schema";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    const res = await db.select().from(chats).where(eq(chats.userId, user.id));
    return NextResponse.json({ chats: res }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { chatId } = body;
  try {
    const res = await db.select().from(chats).where(eq(chats.id, chatId));
    return NextResponse.json({ chat: res }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
