import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { audit } from "@/lib/audit";
import { rateLimit } from "@/lib/rate-limit";
import type { Role, Clearance } from "@prisma/client";

import { SESSION_COOKIE_NAME, USE_SECURE_COOKIES } from "@/lib/constants";

const MAX_FAILED = 5;
const LOCK_MINUTES = 15;
const useSecureCookies = USE_SECURE_COOKIES;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 hours
    updateAge: 60 * 30,
  },
  jwt: { maxAge: 60 * 60 * 8 },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  useSecureCookies,
  cookies: {
    sessionToken: {
      name: SESSION_COOKIE_NAME,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        totp: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials, req) {
        const username = credentials?.username?.trim().toLowerCase();
        const password = credentials?.password ?? "";
        const ip =
          (req?.headers?.["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
          "unknown";

        if (!username || !password) return null;

        // Per-IP + per-username brute force throttling.
        const rl = rateLimit(`login:${ip}:${username}`, { limit: 10, windowMs: 5 * 60_000 });
        if (!rl.allowed) {
          await audit({ action: "auth.login.ratelimited", target: username, ip });
          throw new Error("Too many attempts. Please wait and try again.");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ username }, { email: username }],
            deletedAt: null,
          },
        });

        if (!user || !user.passwordHash) {
          await audit({ action: "auth.login.unknown_user", target: username, ip });
          return null;
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          await audit({ userId: user.id, action: "auth.login.locked", ip });
          throw new Error("Account temporarily locked due to failed attempts.");
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
          const failed = user.failedLoginCount + 1;
          const lock = failed >= MAX_FAILED;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginCount: lock ? 0 : failed,
              lockedUntil: lock ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null,
            },
          });
          await audit({
            userId: user.id,
            action: lock ? "auth.login.lockout" : "auth.login.failed",
            ip,
            meta: { failed },
          });
          if (lock) throw new Error("Account locked after repeated failures.");
          return null;
        }

        if (user.status === "PENDING") {
          throw new Error("Account pending administrator approval.");
        }
        if (user.status === "SUSPENDED" || user.status === "ARCHIVED") {
          throw new Error("Account access has been revoked.");
        }

        // Optional 2FA check (secret comparison is a placeholder for a TOTP lib).
        if (user.twoFactorEnabled) {
          const code = credentials?.totp?.trim();
          if (!code) throw new Error("2FA_REQUIRED");
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginCount: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
            lastLoginIp: ip,
          },
        });
        await audit({ userId: user.id, action: "auth.login.success", ip });

        return {
          id: user.id,
          name: user.name ?? user.username,
          email: user.email,
          username: user.username,
          role: user.role,
          clearance: user.clearance,
          status: user.status,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: Role }).role;
        token.clearance = (user as { clearance: Clearance }).clearance;
        token.username = (user as { username: string }).username;
        token.status = (user as { status: string }).status;
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string;
        session.user.role = token.role as Role;
        session.user.clearance = token.clearance as Clearance;
        session.user.username = token.username as string;
        session.user.status = token.status as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
