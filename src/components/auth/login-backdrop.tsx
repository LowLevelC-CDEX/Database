"use client";

import { motion } from "framer-motion";
import { Scanlines } from "@/components/boot/scanlines";

// Animated blueprint / lighting backdrop for auth screens.
export function LoginBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-ink" />
      <div className="hairline-grid absolute inset-0 opacity-50" />

      {/* Blueprint concentric rings */}
      <svg
        className="absolute -right-40 top-1/2 h-[120vh] w-[120vh] -translate-y-1/2 text-accent/20"
        viewBox="0 0 800 800"
        fill="none"
      >
        {[120, 220, 320, 380].map((r) => (
          <circle key={r} cx="400" cy="400" r={r} stroke="currentColor" strokeWidth="0.6" strokeDasharray="3 6" />
        ))}
        <line x1="0" y1="400" x2="800" y2="400" stroke="currentColor" strokeWidth="0.5" />
        <line x1="400" y1="0" x2="400" y2="800" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      {/* Soft moving light */}
      <motion.div
        className="absolute left-1/4 top-0 h-[60vh] w-[60vh] rounded-full bg-accent/10 blur-[120px]"
        animate={{ x: [0, 80, 0], y: [0, 40, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 h-[50vh] w-[50vh] rounded-full bg-accent-soft/10 blur-[120px]"
        animate={{ x: [0, -60, 0], y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <Scanlines className="opacity-60" />
    </div>
  );
}
