import { embed, embedMany } from "ai";
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
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
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
      ${cosineDistanceQuery(
        Prisma.sql`embedding`,
        Prisma.sql`${Prisma.join(userQueryEmbedded)}::vector`
      )} AS similarity
    FROM embeddings
    WHERE 
      ${cosineDistanceQuery(
        Prisma.sql`embedding`,
        Prisma.sql`${Prisma.join(userQueryEmbedded)}::vector`
      )} > 0.5
      AND "userId" = ${userId}
    ORDER BY similarity DESC
    LIMIT 4
  `;

  return similarGuides;
};

// export const findRelevantContent = async ({
//   userQuery,
//   userId,
// }: {
//   userQuery: string;
//   userId: string;
// }) => {
//   const userQueryEmbedded = await generateEmbedding(userQuery);
//   const similarity = sql<number>`1 - (${cosineDistance(
//     embeddings.embedding,
//     userQueryEmbedded
//   )})`;

//   const similarGuides = await db
//     .select({ name: embeddings.content, similarity })
//     .from(embeddings)
//     .where(sql`${gt(similarity, 0.5)} AND ${eq(embeddings.userId, userId)}`)
//     .orderBy((t) => desc(t.similarity))
//     .limit(4);
//   return similarGuides;
// };

// const cosineDistanceQuery = (embedding1: number[], embedding2: number[]): Prisma.Sql => {
//   return Prisma.sql`1 - (
//     (${embedding1}::vector · ${embedding2}::vector) /
//     (|${embedding1}::vector| * |${embedding2}::vector|)
//   )`
// }
