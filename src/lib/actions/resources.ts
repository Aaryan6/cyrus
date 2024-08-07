"use server";

import { db } from "../db";
import { generateEmbeddings } from "../ai/embedding";
import { Prisma, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

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

    const values = generatedEmbeddings.map(({ content, embedding }) => {
      const id = uuidv4();
      return Prisma.sql`(${id}, ${content}, ${
        resource.id
      }, ${userId}, ${Prisma.raw(
        `ARRAY[${embedding.join(",")}]::vector(1536)`
      )})`;
    });

    await prisma.$executeRaw`
    INSERT INTO "Embeddings" (id, content, "resourceId", "userId", embedding)
    VALUES ${Prisma.join(values)}
  `;

    return "Resource successfully created and embedded.";
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : "Error, please try again.";
  }
};
