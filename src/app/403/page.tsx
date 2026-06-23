import Link from "next/link";
import { ShieldX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 text-center">
      <div className="hairline-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10">
        <div className="alert-stripes mx-auto mb-5 flex size-16 items-center justify-center rounded-xl border border-alert/40">
          <ShieldX className="size-8 text-alert" />
        </div>
        <p className="label-mono mb-2 text-alert">Error 403 · Access Denied</p>
        <h1 className="text-2xl font-bold text-foreground">Insufficient Clearance</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Your current role does not grant access to this resource. This attempt has been logged.
        </p>
        <Link href="/dashboard" className={buttonVariants({ variant: "secondary", className: "mt-6" })}>
          Return to Dashboard
        </Link>
      </div>
    </main>
  );
}
