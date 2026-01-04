// web/src/lib/redis.ts
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL!;

// Detect TLS automatically (Upstash/Cloud uses rediss://)
const isTLS = redisUrl.startsWith('rediss://');

export const redis = new Redis(redisUrl, {
    tls: isTLS ? {} : undefined,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 2,
    retryStrategy: (times) => {
        if (times > 2) return null; // stop retrying
        return 100; // retry after 100ms
    },
});

redis.on('connect', () => {
    console.log('[Redis] connected');
});

redis.on('error', (err) => {
    if (process.env.NODE_ENV === 'development') {
        console.warn('[Redis] connection error (ignored):', err.message);
    }
});
