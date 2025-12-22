export function readCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "expiresAt" in parsed) {
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) return null;
      return parsed.value as T;
    }
    return parsed as T;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, value: T, ttlMs?: number): void {
  if (typeof window === "undefined") return;
  try {
    const entry = ttlMs ? { value, expiresAt: Date.now() + ttlMs } : value;
    window.localStorage.setItem(key, JSON.stringify(entry));
  } catch {}
}

export function prefetchImages(urls: string[]): void {
  if (typeof window === "undefined") return;
  urls.forEach((u) => {
    if (!u) return;
    const img = new Image();
    img.src = u;
  });
}
