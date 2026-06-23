"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/validators";

type FormInput = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordExperience() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: FormInput) {
    await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSent(true);
  }

  return (
    <AuthShell
      title="ACCOUNT RECOVERY"
      subtitle="Credential Reset"
      footer={
        <Link href="/login" className="text-accent hover:underline">
          Back to login
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="mb-3 size-10 text-success" />
          <p className="text-sm text-foreground">Check your inbox.</p>
          <p className="mt-2 text-xs text-muted">
            If that email is registered, a secure reset link has been dispatched.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <p className="text-xs text-muted">
            Enter your registered email and we will send a secure password reset link.
          </p>
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <Input id="email" type="email" className="pl-9" placeholder="jane@example.com" {...register("email")} />
            </div>
            {errors.email && <p className="mt-1 text-xs text-alert">{errors.email.message}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
            Send Reset Link
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
