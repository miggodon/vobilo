import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Lightweight config utan DB-imports — används i middleware (Edge runtime)
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/logga-in" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.groupId = (user as { groupId?: string }).groupId;
        token.groupSlug = (user as { groupSlug?: string }).groupSlug;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.groupId = token.groupId as string | undefined;
        session.user.groupSlug = token.groupSlug as string | undefined;
      }
      return session;
    },
  },
  providers: [Credentials({})],
};
