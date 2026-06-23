import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`forgot:${ip}`, { limit: 5, windowMs: 15 * 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 422 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  // Always respond identically to prevent account enumeration.
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires: new Date(Date.now() + 60 * 60_000),
      },
    });
    await audit({ userId: user.id, action: "auth.password_reset.requested", ip });
    // In production, dispatch an email here. The token is intentionally not returned.
    if (process.env.NODE_ENV === "development") {
      console.log(`[dev] Password reset link: /reset-password?token=${token}`);
    }
  }

  return NextResponse.json({
    ok: true,
    message: "If that email is registered, a reset link has been sent.",
  });
}
