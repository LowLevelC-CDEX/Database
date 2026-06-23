import { NextResponse, type NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { can, type Permission } from "@/lib/rbac";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Returns the session user or throws an ApiError (caught by withApi).
export async function requireApiPermission(permission: Permission) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new ApiError(401, "Unauthorized");
  if (!can(session.user.role, permission)) throw new ApiError(403, "Forbidden");
  return session.user;
}

export async function getApiUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

// Wraps a handler with consistent error handling + JSON responses.
export function withApi<T>(handler: (req: NextRequest, ctx: T) => Promise<NextResponse>) {
  return async (req: NextRequest, ctx: T) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      console.error("[api] unhandled error", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}

export function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
