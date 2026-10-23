// Rate limiter — token bucket, in-memory, per provider.
// Used to enforce rate limits on AI calls (server-side only).

export class RateLimiter {
  private tokens: number;
  private last = Date.now();

  constructor(private readonly capacity: number, private readonly refillPerSec: number) {
    this.tokens = capacity;
  }

  tryConsume(): boolean {
    const now = Date.now();
    this.tokens = Math.min(
      this.capacity,
      this.tokens + ((now - this.last) / 1000) * this.refillPerSec,
    );
    this.last = now;
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

const limiters = new Map<string, RateLimiter>();

export function getLimiter(key: string): RateLimiter {
  let lim = limiters.get(key);
  if (!lim) {
    lim = new RateLimiter(10, 2); // 10 burst, 2/sec
    limiters.set(key, lim);
  }
  return lim;
}
