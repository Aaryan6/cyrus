import { pgTable, foreignKey, pgEnum, uuid, text, timestamp, jsonb, index, varchar, vector } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const aal_level = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const code_challenge_method = pgEnum("code_challenge_method", ['s256', 'plain'])
export const factor_status = pgEnum("factor_status", ['unverified', 'verified'])
export const factor_type = pgEnum("factor_type", ['totp', 'webauthn'])
export const one_time_token_type = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])
export const key_status = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const key_type = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const equality_op = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])


export const users = pgTable("users", {
	id: uuid("id").primaryKey().notNull(),
	email: text("email"),
	username: text("username"),
	full_name: text("full_name"),
	avatar_url: text("avatar_url"),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	provider_token: text("provider_token"),
},
(table) => {
	return {
		users_id_fkey: foreignKey({
			columns: [table.id],
			foreignColumns: [table.id],
			name: "users_id_fkey"
		}).onDelete("cascade"),
	}
});

export const chats = pgTable("chats", {
	id: text("id").primaryKey().notNull(),
	user_id: uuid("user_id").notNull().references(() => users.id),
	payload: jsonb("payload"),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const embeddings = pgTable("embeddings", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	resource_id: varchar("resource_id", { length: 191 }).references(() => resources.id, { onDelete: "cascade" } ),
	content: text("content").notNull(),
	embedding: vector("embedding", { dimensions: 1536 }).notNull(),
	user_id: uuid("user_id").references(() => users.id),
},
(table) => {
	return {
		embeddingIndex: index("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops")),
	}
});

export const resources = pgTable("resources", {
	id: varchar("id", { length: 191 }).primaryKey().notNull(),
	content: text("content").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	user_id: uuid("user_id").references(() => users.id),
});