"use server";
import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateUserUsername({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  const res = await db.user.update({
    where: {
      id: userId,
    },
    data: {
      username,
    },
  });
  return res;
}
