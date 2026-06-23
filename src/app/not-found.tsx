import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main-content" className="relative flex min-h-screen flex-col items-center justify-center bg-ink px-4 text-center">
      <div className="hairline-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative z-10">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-xl border border-hairline/60 bg-panel-2 text-muted">
          <FileQuestion className="size-8" />
        </div>
        <p className="label-mono mb-2 text-muted">Error 404 · Record Not Found</p>
        <h1 className="text-2xl font-bold text-foreground">File Does Not Exist</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">The requested record could not be located in the database, or has been redacted.</p>
        <Link href="/dashboard" className={buttonVariants({ variant: "secondary", className: "mt-6" })}>
          Return to Dashboard
        </Link>
      </div>
    </main>
  );
}
