// web/src/lib/redis.ts
import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL!, {
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
