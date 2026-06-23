import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-hairline/70 bg-ink/60 px-3 py-2 text-sm text-foreground",
        "placeholder:text-muted/60 transition-colors",
        "focus-visible:outline-none focus-visible:border-accent/70 focus-visible:ring-2 focus-visible:ring-accent/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[96px] w-full rounded-md border border-hairline/70 bg-ink/60 px-3 py-2 text-sm text-foreground",
      "placeholder:text-muted/60 transition-colors resize-y",
      "focus-visible:outline-none focus-visible:border-accent/70 focus-visible:ring-2 focus-visible:ring-accent/30",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("label-mono mb-1.5 block", className)}
    {...props}
  />
));
Label.displayName = "Label";

const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-hairline/70 bg-ink/60 px-3 py-2 text-sm text-foreground",
      "focus-visible:outline-none focus-visible:border-accent/70 focus-visible:ring-2 focus-visible:ring-accent/30",
      "disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-charcoal",
      className,
    )}
    {...props}
  />
));
Select.displayName = "Select";

export { Input, Textarea, Label, Select };
