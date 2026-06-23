// In-memory sliding-window rate limiter.
// Suitable for single-instance / dev. Swap for Redis in a clustered deploy.

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function rateLimit(
  key: string,
  { limit = 10, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count++;
  return { allowed: true, remaining: limit - bucket.count, retryAfterMs: 0 };
}

// Periodically clean expired buckets to avoid unbounded growth.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store.entries()) {
      if (bucket.resetAt < now) store.delete(key);
    }
  }, 5 * 60_000).unref?.();
}
