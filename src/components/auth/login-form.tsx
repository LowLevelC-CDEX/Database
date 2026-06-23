"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, User, KeyRound, AlertTriangle, Loader2, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/lib/validators";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";

  const [error, setError] = useState<string | null>(null);
  const [needs2fa, setNeeds2fa] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", totp: "", remember: false },
  });

  async function onSubmit(values: LoginInput) {
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
      totp: values.totp,
    });

    if (res?.error) {
      if (res.error === "2FA_REQUIRED") {
        setNeeds2fa(true);
        setError("Two-factor authentication required. Enter your code.");
        return;
      }
      const friendly: Record<string, string> = {
        CredentialsSignin: "Invalid username or password.",
      };
      setError(friendly[res.error] ?? res.error);
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10"
    >
      <div className="w-full max-w-md">
        {/* Clearance badge graphic */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="relative mb-4 flex size-16 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 shadow-glow">
            <ShieldCheck className="size-8 text-accent" />
            <span className="absolute -bottom-2 rounded border border-hairline/70 bg-charcoal px-1.5 py-0.5 font-mono text-[0.55rem] tracking-widest text-accent">
              SECURE
            </span>
          </div>
          <h1 className="font-mono text-lg font-bold tracking-[0.18em] text-foreground">
            SITE-80 &quot;JACOBY&quot;
          </h1>
          <p className="label-mono mt-1">Secure Access Terminal</p>
        </div>

        <div className="glass rounded-xl p-6 shadow-glass">
          {/* Classified warning */}
          <div className="stripes mb-5 flex items-start gap-2 rounded-md border border-caution/30 bg-caution/5 p-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-caution" />
            <p className="text-[0.7rem] leading-snug text-caution/90">
              <span className="font-semibold">CLASSIFIED SYSTEM.</span> Access restricted to
              authorized Foundation personnel. All activity is monitored and logged.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="username">Username or Email</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <Input
                  id="username"
                  autoComplete="username"
                  className="pl-9"
                  placeholder="e.g. researcher"
                  aria-invalid={!!errors.username}
                  {...register("username")}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-alert">{errors.username.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="mb-1.5 text-[0.66rem] text-accent hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className="pl-9"
                  placeholder="••••••••••"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-alert">{errors.password.message}</p>
              )}
            </div>

            {needs2fa && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <Label htmlFor="totp">Two-Factor Code</Label>
                <div className="relative">
                  <Fingerprint className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <Input
                    id="totp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="pl-9 tracking-[0.4em]"
                    placeholder="000000"
                    {...register("totp")}
                  />
                </div>
              </motion.div>
            )}

            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                className="size-4 rounded border-hairline bg-ink accent-accent"
                {...register("remember")}
              />
              Remember this device
            </label>

            {error && (
              <div
                role="alert"
                className="alert-stripes flex items-center gap-2 rounded-md border border-alert/40 bg-alert/5 px-3 py-2 text-xs text-alert"
              >
                <AlertTriangle className="size-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Authenticating…
                </>
              ) : (
                <>
                  <KeyRound className="size-4" /> Secure Login
                </>
              )}
            </Button>
          </form>

          <div className="mt-5 border-t border-hairline/40 pt-4 text-center">
            <p className="text-xs text-muted">
              Need access?{" "}
              <Link href="/register" className="text-accent hover:underline">
                Request an account
              </Link>
            </p>
          </div>
        </div>

        {/* Foundation legal warning */}
        <p className="mx-auto mt-5 max-w-sm text-center text-[0.6rem] leading-relaxed text-muted/60">
          WARNING: This is a restricted Foundation information system. Unauthorized access is
          prohibited under SCP Foundation Directive 80-J and may result in disciplinary action,
          amnestics administration, and prosecution. By proceeding you consent to monitoring.
        </p>
      </div>
    </motion.div>
  );
}
