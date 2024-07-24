import {
  pgTable,
  foreignKey,
  unique,
  pgEnum,
  uuid,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const aal_level = pgEnum("aal_level", ["aal1", "aal2", "aal3"]);
export const code_challenge_method = pgEnum("code_challenge_method", [
  "s256",
  "plain",
]);
export const factor_status = pgEnum("factor_status", [
  "unverified",
  "verified",
]);
export const factor_type = pgEnum("factor_type", ["totp", "webauthn"]);
export const one_time_token_type = pgEnum("one_time_token_type", [
  "confirmation_token",
  "reauthentication_token",
  "recovery_token",
  "email_change_token_new",
  "email_change_token_current",
  "phone_change_token",
]);
export const key_status = pgEnum("key_status", [
  "default",
  "valid",
  "invalid",
  "expired",
]);
export const key_type = pgEnum("key_type", [
  "aead-ietf",
  "aead-det",
  "hmacsha512",
  "hmacsha256",
  "auth",
  "shorthash",
  "generichash",
  "kdf",
  "secretbox",
  "secretstream",
  "stream_xchacha20",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().notNull(),
    email: text("email"),
    username: text("username"),
    full_name: text("full_name"),
    avatar_url: text("avatar_url"),
    updated_at: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => {
    return {
      users_id_fkey: foreignKey({
        columns: [table.id],
        foreignColumns: [table.id],
        name: "users_id_fkey",
      }).onDelete("cascade"),
      users_email_key: unique("users_email_key").on(table.email),
      users_username_key: unique("users_username_key").on(table.username),
    };
  }
);

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
