"use server";
import { embed, embedMany, cosineSimilarity } from "ai";
import { openai } from "@ai-sdk/openai";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const embeddingModel = openai.embedding("text-embedding-ada-002");

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string
): Promise<{ embedding: number[]; content: string }[]> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  const embeddingsArray = embeddings.map((e, i) => ({
    content: chunks[i],
    embedding: e,
  }));
  return embeddingsArray;
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

const cosineDistanceQuery = (
  embedding1: Prisma.Sql,
  embedding2: Prisma.Sql
): Prisma.Sql => {
  return Prisma.sql`1 - (
    (${embedding1} · ${embedding2}) /
    (|${embedding1}| * |${embedding2}|)
  )`;
};

export const findRelevantContent = async ({
  userQuery,
  userId,
}: {
  userQuery: string;
  userId: string;
}) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);

  const similarGuides = await prisma.$queryRaw<
    Array<{ content: string; similarity: number }>
  >`
    SELECT
      content,
      1 - (embedding <=> ${Prisma.raw(
        `ARRAY[${userQueryEmbedded.join(",")}]::vector(1536)`
      )}::vector) AS similarity
    FROM "Embeddings"
    WHERE
      1 - (embedding <=> ${Prisma.raw(
        `ARRAY[${userQueryEmbedded.join(",")}]::vector(1536)`
      )}::vector) > 0.5
      AND "userId" = ${userId}
    ORDER BY similarity DESC
    LIMIT 4
  `;

  return similarGuides;
};
