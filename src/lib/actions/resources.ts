"use server";

import { db } from "../db";
import { generateEmbeddings } from "../ai/embedding";

export const createResource = async ({
  content,
  userId,
}: {
  content: string;
  userId: string;
}) => {
  try {
    const resource = await db.resources.create({ data: { content, userId } });

    const generatedEmbeddings = await generateEmbeddings(content);
    await db.embeddings.createMany({
      data: generatedEmbeddings.map((embedding) => ({
        resourceId: resource.id,
        userId,
        ...embedding,
      })),
    });

    return "Resource successfully created and embedded.";
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : "Error, please try again.";
  }
};
