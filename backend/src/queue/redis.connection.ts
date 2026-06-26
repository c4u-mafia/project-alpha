import type { RedisOptions } from 'ioredis';

/**
 * Builds the ioredis connection options BullMQ uses for every queue/worker.
 *
 * `maxRetriesPerRequest: null` is REQUIRED by BullMQ workers — without it,
 * blocking commands (BRPOPLPUSH) throw once Redis hiccups. See BullMQ docs.
 */
export function buildRedisConnection(): RedisOptions & { url?: string } {
  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error(
      'REDIS_URL is not set. BullMQ queues need a Redis connection.',
    );
  }

  // ioredis accepts a URL via the `path`-less first arg, but BullMQ wants an
  // options object. Parse the URL into options so TLS (rediss://) is honored.
  const parsed = new URL(url);
  const isTls = parsed.protocol === 'rediss:';

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 6379,
    username: parsed.username || undefined,
    password: parsed.password || undefined,
    db: parsed.pathname && parsed.pathname.length > 1
      ? Number(parsed.pathname.slice(1))
      : 0,
    ...(isTls ? { tls: {} } : {}),
    maxRetriesPerRequest: null,
  };
}
