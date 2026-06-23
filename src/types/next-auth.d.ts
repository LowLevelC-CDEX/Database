import type { Role, Clearance } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username: string;
      role: Role;
      clearance: Clearance;
      status: string;
    };
  }

  interface User {
    username: string;
    role: Role;
    clearance: Clearance;
    status: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
    username: string;
    role: Role;
    clearance: Clearance;
    status: string;
  }
}
