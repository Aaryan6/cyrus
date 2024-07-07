import { relations } from "drizzle-orm/relations";
import { users, chats, usersInAuth } from "./schema";

export const chatsRelations = relations(chats, ({ one }) => ({
  user: one(users, {
    fields: [chats.user_id],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  chats: many(chats),
  usersInAuth: one(usersInAuth, {
    fields: [users.id],
    references: [usersInAuth.id],
  }),
}));

export const usersInAuthRelations = relations(usersInAuth, ({ many }) => ({
  users: many(users),
}));
