import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = rateLimit(`register:${ip}`, { limit: 5, windowMs: 15 * 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { username, email, name, password } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] },
  });
  if (existing) {
    // Avoid leaking which field collided.
    return NextResponse.json(
      { error: "An account with those details already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      name,
      passwordHash,
      status: "PENDING", // requires admin approval + email verification
      role: "PERSONNEL",
      clearance: "LEVEL_0",
    },
  });

  await audit({ userId: user.id, action: "auth.register", target: user.username, ip });

  return NextResponse.json({
    ok: true,
    message: "Account requested. Awaiting administrator approval.",
  });
}
