import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id_token: string;
  access_token: string;
  refresh_token: string;
  username: string;
  token_expires: number;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
