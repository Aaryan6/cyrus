import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "../auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    error: "/sign-in",
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ account }) {
      await db.account.update({
        where: {
          provider_providerAccountId: {
            provider: account!.provider,
            providerAccountId: account!.providerAccountId,
          },
        },
        data: {
          access_token: account!.access_token,
          refresh_token: account!.refresh_token,
          id_token: account!.id_token,
          expires_at: account!.expires_at,
          session_state: account!.token_type,
        },
      });
      return true;
    },
    async jwt({ token }) {
      if (token.sub) {
        const accountDetails = await db.user.findUnique({
          where: {
            id: token.sub,
          },
          include: {
            accounts: true,
          },
        });
        token.id_token = accountDetails?.accounts[0]?.id_token;
        token.access_token = accountDetails?.accounts[0]?.access_token;
        token.refresh_token = accountDetails?.accounts[0]?.refresh_token;
        token.token_expires = accountDetails?.accounts[0]?.expires_at;
        token.username = accountDetails?.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (
        token.id_token &&
        token.access_token &&
        token.refresh_token &&
        session.user &&
        token.sub
      ) {
        session.user.id_token = token.id_token as string;
        session.user.access_token = token.access_token as string;
        session.user.refresh_token = token.refresh_token as string;
        session.user.token_expires = token.token_expires as number;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  ...authConfig,
  debug: process.env.NODE_ENV === "development",
});
