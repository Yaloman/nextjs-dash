import DiscordProvider from "next-auth/providers/discord";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Attach the Discord user ID to the session
      if (session.user && token.sub) {
        session.user.discordId = token.sub;
      }
      return session;
    },
  },
};
