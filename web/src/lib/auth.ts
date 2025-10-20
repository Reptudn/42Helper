import { NextAuthOptions } from "next-auth";
import FortyTwoProvider from "next-auth/providers/42-school";
import { config } from "./config";

interface FortyTwoProfile {
  login: string;
  image?: {
    link: string;
  };
  campus?: Array<{
    name: string;
  }>;
  cursus_users?: Array<{
    level: number;
  }>;
}

export const authOptions: NextAuthOptions = {
  providers: [
    FortyTwoProvider({
      clientId: config.fortyTwo.clientId!,
      clientSecret: config.fortyTwo.clientSecret!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("JWT callback:", { account, profile }); // Debug logging
      
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      
      // Add additional user info from 42 profile
      if (profile) {
        const fortyTwoProfile = profile as FortyTwoProfile;
        token.login = fortyTwoProfile.login;
        token.image = fortyTwoProfile.image?.link;
        token.campus = fortyTwoProfile.campus?.[0]?.name;
        token.level = fortyTwoProfile.cursus_users?.[0]?.level;
      }
      
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      if (session.user) {
        session.user.login = token.login as string;
        session.user.campus = token.campus as string;
        session.user.level = token.level as number;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: config.nextAuth.secret,
  debug: true, // Enable debug mode
};
