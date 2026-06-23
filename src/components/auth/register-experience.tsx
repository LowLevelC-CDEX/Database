"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, UserPlus, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { passwordStrength } from "@/lib/password";

export function RegisterExperience() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const pw = watch("password") ?? "";
  const strength = passwordStrength(pw);
  const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][strength];

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setServerError(data.error ?? "Registration failed.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <AuthShell title="REQUEST SUBMITTED" subtitle="Pending Clearance Review">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="mb-3 size-10 text-success" />
          <p className="text-sm text-foreground">Your access request has been logged.</p>
          <p className="mt-2 text-xs text-muted">
            An administrator must approve your account and assign clearance before you can sign in.
          </p>
          <Link href="/login" className={buttonVariants({ className: "mt-5 w-full" })}>
            Return to Login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="REQUEST ACCESS"
      subtitle="Personnel Onboarding"
      footer={
        <>
          Already cleared?{" "}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="Jane Doe" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-alert">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="jdoe" {...register("username")} />
          {errors.username && <p className="mt-1 text-xs text-alert">{errors.username.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="jane@example.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-alert">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••••" {...register("password")} />
          {pw && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i < strength
                        ? strength <= 1
                          ? "bg-alert"
                          : strength <= 2
                            ? "bg-caution"
                            : "bg-success"
                        : "bg-panel-2"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-[0.66rem] text-muted">Strength: {strengthLabel}</p>
            </div>
          )}
          {errors.password && <p className="mt-1 text-xs text-alert">{errors.password.message}</p>}
        </div>

        {serverError && (
          <div role="alert" className="rounded-md border border-alert/40 bg-alert/5 px-3 py-2 text-xs text-alert">
            {serverError}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
          Submit Request
        </Button>
        <p className="text-center text-[0.62rem] text-muted/70">
          Accounts require administrator approval and email verification before activation.
        </p>
      </form>
    </AuthShell>
  );
}
