"use server";

import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from "@/lib/supabase/schema";
import db from "../supabase/db";
import { generateEmbeddings } from "../ai/embedding";
import { embeddings as embeddingsTable } from "../supabase/schema";

export const createResource = async (input: NewResourceParams) => {
  try {
    const { content, userId } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content, userId })
      .returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        resourceId: resource.id,
        userId,
        ...embedding,
      }))
    );

    return "Resource successfully created and embedded.";
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : "Error, please try again.";
  }
};
