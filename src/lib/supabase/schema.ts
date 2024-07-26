import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";
import { nanoid } from "../utils";
import { sql } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const chats = pgTable("chats", {
  id: text("id").primaryKey().notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  email: text("email"),
  username: text("username"),
  full_name: text("full_name"),
  avatar_url: text("avatar_url"),
  provider_token: text("provider_token"),
});

export const embeddings = pgTable(
  "embeddings",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    resourceId: varchar("resource_id", { length: 191 }).references(
      () => resources.id,
      { onDelete: "cascade" }
    ),
    userId: uuid("user_id").references(() => users.id),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);

export const resources = pgTable("resources", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  content: text("content").notNull(),
  userId: uuid("user_id").references(() => users.id),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for resources - used to validate API requests
export const insertResourceSchema = createSelectSchema(resources)
  .extend({})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  });

// Type for resources - used to type API request params and within Components
export type NewResourceParams = z.infer<typeof insertResourceSchema>;
