import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      login?: string;
      campus?: string;
      level?: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    login?: string;
    campus?: string;
    level?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    login?: string;
    campus?: string;
    level?: number;
  }
}
