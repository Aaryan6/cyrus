import { relations } from "drizzle-orm/relations";
import { usersInAuth, users, chats, resources, embeddings } from "./schema";

export const usersRelations = relations(users, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [users.id],
		references: [usersInAuth.id]
	}),
	chats: many(chats),
	embeddings: many(embeddings),
	resources: many(resources),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	users: many(users),
}));

export const chatsRelations = relations(chats, ({one}) => ({
	user: one(users, {
		fields: [chats.user_id],
		references: [users.id]
	}),
}));

export const embeddingsRelations = relations(embeddings, ({one}) => ({
	resource: one(resources, {
		fields: [embeddings.resource_id],
		references: [resources.id]
	}),
	user: one(users, {
		fields: [embeddings.user_id],
		references: [users.id]
	}),
}));

export const resourcesRelations = relations(resources, ({one, many}) => ({
	embeddings: many(embeddings),
	user: one(users, {
		fields: [resources.user_id],
		references: [users.id]
	}),
}));