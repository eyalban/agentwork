const windows = new Map<string, { count: number; resetAt: number }>();

const LIMIT = 60;
const WINDOW_MS = 60_000;

export function rateLimit(key: string, limit: number = LIMIT, windowMs: number = WINDOW_MS): boolean {
  const now = Date.now();
  const record = windows.get(key);

  if (!record || now > record.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}
