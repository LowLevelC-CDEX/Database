"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Particles } from "./particles";
import { Scanlines } from "./scanlines";
import { ShieldCheck } from "lucide-react";

const STEPS = [
  "Initialize Database...",
  "Loading Personnel Registry...",
  "Loading Containment Files...",
  "Decrypting Secure Records...",
  "Connecting to Site-80...",
  "Verifying Clearance Database...",
  "Loading Intelligence Systems...",
  "System Ready.",
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepDelay = reduce ? 120 : 360;
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const tick = () => {
      if (i < STEPS.length) {
        const idx = i;
        setVisibleSteps((s) => [...s, STEPS[idx]]);
        setProgress(Math.round(((idx + 1) / STEPS.length) * 100));
        i++;
        timers.push(setTimeout(tick, stepDelay));
      } else {
        timers.push(
          setTimeout(() => {
            setDone(true);
            timers.push(setTimeout(onComplete, reduce ? 120 : 700));
          }, reduce ? 100 : 500),
        );
      }
    };
    timers.push(setTimeout(tick, stepDelay));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [visibleSteps]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink"
          role="status"
          aria-live="polite"
          aria-label="System initializing"
        >
          <div className="absolute inset-0">
            <Particles />
          </div>
          <Scanlines />
          <div className="hairline-grid pointer-events-none absolute inset-0 opacity-40" />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-lg px-6"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent shadow-glow">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="font-mono text-sm font-semibold tracking-[0.2em] text-foreground">
                  SCP FOUNDATION
                </p>
                <p className="label-mono text-accent/80">SITE-80 · &quot;JACOBY&quot;</p>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="glass h-44 overflow-hidden rounded-lg p-4 font-mono text-xs leading-relaxed"
            >
              {visibleSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-success">[ OK ]</span>
                  <span className={step === "System Ready." ? "text-accent" : "text-muted"}>
                    {step}
                  </span>
                </motion.div>
              ))}
              <span className="ml-[3.2rem] inline-block h-3.5 w-2 animate-blink bg-accent align-middle" />
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex justify-between font-mono text-[0.66rem] uppercase tracking-widest text-muted">
                <span>Loading secure systems</span>
                <span className="text-accent">{progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-panel-2">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent-soft to-accent"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.4 }}
                />
              </div>
            </div>

            <p className="mt-6 text-center font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted/60">
              Authorized Personnel Only · Activity Monitored
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
