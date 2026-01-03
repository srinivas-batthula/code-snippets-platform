// web/src/utils/redis.ts
import crypto from 'crypto';

const MAX_CACHE_ITEMS = 15;
const CACHE_TTL_SECONDS = 60;
const CACHE_INDEX_KEY = 'snippets:search:index';


export async function setSearchCache(redis: any, cacheKey: string, data: any) {
    try {
        const now = Date.now();

        // 1. Save actual cached data...
        await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(data));

        // 2. Add key to index with timestamp (To track Insertion-Order)
        await redis.zadd(CACHE_INDEX_KEY, now, cacheKey);

        // Set / refresh TTL for index key
        await redis.expire(CACHE_INDEX_KEY, CACHE_TTL_SECONDS);

        // 3. Enforce max size
        const size = await redis.zcard(CACHE_INDEX_KEY);

        // 4. Remove oldest entries, If it exceeds MAX_CACHE_ITEMS
        if (size > MAX_CACHE_ITEMS) {
            const excess = size - MAX_CACHE_ITEMS;
            const oldKeys = await redis.zrange(CACHE_INDEX_KEY, 0, excess - 1);

            if (oldKeys.length) {
                await redis.del(...oldKeys);    // Delete cached entries
                await redis.zrem(CACHE_INDEX_KEY, ...oldKeys);  // Remove from indexes
            }
        }
    }
    catch (err) {
        return;
    }
}

export async function getSearchCache(redis: any, cacheKey: string) {
    try {
        const cached = await redis.get(cacheKey);
        return cached ? JSON.parse(cached) : null;
    }
    catch (err) {
        return null;
    }
}

export function getSearchCacheKey(type: 'snippets' | 'snapshots', req: Request): string {
    const url = new URL(req.url);

    // Full query string (cursor, search, user, etc.)
    const queryString = url.searchParams.toString();

    // Stable hash to keep Redis keys short & safe
    const hash = crypto
        .createHash('sha1')
        .update(queryString)
        .digest('hex');

    // Final cache key (used in both STRING + ZSET index)
    return `snippets:search:${type}:${hash}`;
}
