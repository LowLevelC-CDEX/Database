"use client";

import { Suspense, useState, useCallback } from "react";
import { BootSequence } from "@/components/boot/boot-sequence";
import { LoginForm } from "@/components/auth/login-form";
import { LoginBackdrop } from "@/components/auth/login-backdrop";

export function LoginExperience() {
  const [booted, setBooted] = useState(false);
  const handleComplete = useCallback(() => setBooted(true), []);

  return (
    <main id="main-content" className="relative min-h-screen overflow-hidden bg-ink">
      <LoginBackdrop />
      {!booted && <BootSequence onComplete={handleComplete} />}
      {booted && (
        <Suspense>
          <LoginForm />
        </Suspense>
      )}
    </main>
  );
}
