import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LoginBackdrop } from "./login-backdrop";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main id="main-content" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 py-10">
      <LoginBackdrop />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href="/login" className="mb-4 flex size-14 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 shadow-glow">
            <ShieldCheck className="size-7 text-accent" />
          </Link>
          <h1 className="font-mono text-lg font-bold tracking-[0.16em] text-foreground">{title}</h1>
          {subtitle && <p className="label-mono mt-1">{subtitle}</p>}
        </div>
        <div className="glass rounded-xl p-6 shadow-glass">{children}</div>
        {footer && <div className="mt-5 text-center text-xs text-muted">{footer}</div>}
      </div>
    </main>
  );
}
