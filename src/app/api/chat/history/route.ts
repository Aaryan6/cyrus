import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/hooks/use-current-user";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    const res = await db.chats.findMany({ where: { userId: user?.id } });
    return NextResponse.json({ chats: res }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { chatId } = body;
  try {
    const res = await db.chats.findUnique({ where: { id: chatId } });
    return NextResponse.json({ chat: res }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
