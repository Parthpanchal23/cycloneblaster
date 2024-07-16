import nextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerifired?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
  interface session {
    user: {
      _id?: string;
      isVerifired?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerifired?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}
