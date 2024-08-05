import { db } from "@/lib/db";
import "server-only";

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      include: { accounts: true },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
