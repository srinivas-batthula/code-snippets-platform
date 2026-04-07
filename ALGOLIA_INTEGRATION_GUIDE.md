# Algolia Integration Guide for SnipZen

## Overview
This guide walks you through integrating Algolia (search-as-a-service) to replace MongoDB's text search, reducing database load and improving search performance.

---

## Current Architecture Analysis

### **Current Search Flow**
```
Frontend (search-client.tsx)
    ↓
API Route (/api/snippets/getAll, /api/snapshots/getAll)
    ↓
MongoDB (text index on $text operator)
    ↓
Cursor-based pagination → Response
```

### **Current Data Models**

**Snippets:**
- `title` (text searchable)
- `description` (text searchable)
- `code` (stored but not searchable)
- `lang` (filterable)
- `tags` (filterable)
- `publisherName` (filterable)
- `createdAt` (sortable)

**Snapshots:**
- `title` (text searchable)
- `description` (text searchable)
- `extensions` (metadata)
- `settings` (metadata)
- `keybindings` (metadata)
- `publisherName` (filterable)
- `createdAt` (sortable)

---

## Step 1: Setup Algolia Account & Indexes

### 1.1 Create Algolia Account
- Visit [algolia.com](https://www.algolia.com)
- Sign up for a free/paid plan
- Create an application

### 1.2 Create Indexes
Create two indexes in Algolia dashboard:
- `snippets` - for code snippets
- `snapshots` - for VS Code snapshots

### 1.3 Get Credentials
From Algolia Dashboard → Settings → API Keys:
- **Application ID** (e.g., `XXXXXXXXXX`)
- **Search-Only API Key** (for frontend)
- **Admin API Key** (for backend - never expose to client)

### 1.4 Configure Search Settings (Optional but Recommended)

**For both indexes:**
- **Searchable attributes:**
  - `title` (high priority)
  - `description` (medium priority)
  - `publisherName` (low priority)
  
- **Filterable attributes:**
  - `lang` (snippets only)
  - `tags` (snippets only)
  - `publisherName`
  - `createdAt`

- **Sortable attributes:**
  - `createdAt`
  - `_highlightResult`

---

## Step 2: Install Dependencies

### Backend (Node.js/Next.js)
```bash
cd web
npm install algoliasearch
# or
pnpm add algoliasearch
```

### Frontend (Already available via SDK)
Search-only key will be used in browser via Algolia's JS client.

---

## Step 3: Environment Configuration

### 3.1 Update `.env.local` (in `/web`)
```env
# Algolia Configuration
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id_here
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_only_key_here
ALGOLIA_ADMIN_KEY=your_admin_key_here
```

**Note:** Prefix with `NEXT_PUBLIC_` for frontend-accessible variables only.

---

## Step 4: Create Algolia Service Layer

### 4.1 Create `/web/src/lib/algoliaClient.ts`
```typescript
import algoliasearch from 'algoliasearch';

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.ALGOLIA_ADMIN_KEY || ''
);

export default algoliaClient;
```

### 4.2 Create `/web/src/lib/algoliaSearch.ts` (Frontend)
```typescript
import algoliasearch from 'algoliasearch';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
);

export const snippetsIndex = searchClient.initIndex('snippets');
export const snapshotsIndex = searchClient.initIndex('snapshots');
```

---

## Step 5: Implement Backend Indexing

### 5.1 Create Index Sync Utility
**File:** `/web/src/lib/algoliaSync.ts`

```typescript
import algoliaClient from './algoliaClient';
import Snippet from '@/models/Snippet';
import Snapshot from '@/models/Snapshot';

const snippetsIndex = algoliaClient.initIndex('snippets');
const snapshotsIndex = algoliaClient.initIndex('snapshots');

// Sync all snippets to Algolia
export async function syncSnippetsToAlgolia() {
  try {
    const snippets = await Snippet.find({}).lean();
    
    const records = snippets.map(snippet => ({
      objectID: snippet._id.toString(),
      title: snippet.title,
      description: snippet.description || '',
      code: snippet.code.substring(0, 5000), // Limit for index size
      lang: snippet.lang,
      tags: snippet.tags || [],
      publisherName: snippet.publisherName,
      publisherId: snippet.publisherId.toString(),
      createdAt: new Date(snippet.createdAt).getTime(), // Algolia needs timestamp for sorting
      updatedAt: new Date(snippet.updatedAt).getTime(),
    }));

    await snippetsIndex.saveObjects(records, { autoGenerateObjectIDIfNotExist: false });
    console.log(`Synced ${records.length} snippets to Algolia`);
  } catch (error) {
    console.error('Error syncing snippets to Algolia:', error);
  }
}

// Sync all snapshots to Algolia
export async function syncSnapshotsToAlgolia() {
  try {
    const snapshots = await Snapshot.find({}).lean();
    
    const records = snapshots.map(snapshot => ({
      objectID: snapshot._id.toString(),
      title: snapshot.title,
      description: snapshot.description || '',
      publisherName: snapshot.publisherName,
      publisherId: snapshot.publisherId.toString(),
      extensionsCount: snapshot.extensions?.length || 0,
      settingsCount: Object.keys(snapshot.settings || {}).length,
      keybindingsCount: snapshot.keybindings?.length || 0,
      createdAt: new Date(snapshot.createdAt).getTime(),
      updatedAt: new Date(snapshot.updatedAt).getTime(),
    }));

    await snapshotsIndex.saveObjects(records, { autoGenerateObjectIDIfNotExist: false });
    console.log(`Synced ${records.length} snapshots to Algolia`);
  } catch (error) {
    console.error('Error syncing snapshots to Algolia:', error);
  }
}

// Add/update single snippet
export async function indexSnippet(snippet: any) {
  const record = {
    objectID: snippet._id.toString(),
    title: snippet.title,
    description: snippet.description || '',
    code: snippet.code.substring(0, 5000),
    lang: snippet.lang,
    tags: snippet.tags || [],
    publisherName: snippet.publisherName,
    publisherId: snippet.publisherId.toString(),
    createdAt: new Date(snippet.createdAt).getTime(),
    updatedAt: new Date(snippet.updatedAt).getTime(),
  };
  
  await snippetsIndex.saveObject(record);
}

// Add/update single snapshot
export async function indexSnapshot(snapshot: any) {
  const record = {
    objectID: snapshot._id.toString(),
    title: snapshot.title,
    description: snapshot.description || '',
    publisherName: snapshot.publisherName,
    publisherId: snapshot.publisherId.toString(),
    extensionsCount: snapshot.extensions?.length || 0,
    settingsCount: Object.keys(snapshot.settings || {}).length,
    keybindingsCount: snapshot.keybindings?.length || 0,
    createdAt: new Date(snapshot.createdAt).getTime(),
    updatedAt: new Date(snapshot.updatedAt).getTime(),
  };
  
  await snapshotsIndex.saveObject(record);
}

// Delete from Algolia
export async function removeSnippetFromAlgolia(snippetId: string) {
  await snippetsIndex.deleteObject(snippetId);
}

export async function removeSnapshotFromAlgolia(snapshotId: string) {
  await snapshotsIndex.deleteObject(snapshotId);
}
```

---

## Step 6: Create API Route for Algolia Search

### 6.1 Create Algolia Search Route
**File:** `/web/src/app/api/search/algolia/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { snippetsIndex, snapshotsIndex } from '@/lib/algoliaSearch';

interface SearchRequest {
  query: string;
  type: 'snippets' | 'snapshots';
  filters?: string;
  page?: number;
  hitsPerPage?: number;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const query = searchParams.get('query') || '';
    const type = (searchParams.get('type') as 'snippets' | 'snapshots') || 'snippets';
    const filters = searchParams.get('filters'); // e.g., "lang:typescript AND tags:react"
    const page = parseInt(searchParams.get('page') || '0');
    const hitsPerPage = Math.min(parseInt(searchParams.get('hitsPerPage') || '20'), 100);

    const index = type === 'snippets' ? snippetsIndex : snapshotsIndex;

    const searchOptions: any = {
      page,
      hitsPerPage,
      attributesToRetrieve: [
        'objectID',
        'title',
        'description',
        'publisherName',
        'publisherId',
        'createdAt',
        ...(type === 'snippets' ? ['lang', 'tags', 'code'] : ['extensionsCount', 'settingsCount', 'keybindingsCount']),
      ],
    };

    // Add filters if provided
    if (filters) {
      searchOptions.filters = filters;
    }

    // Add sorting
    searchOptions.sort = ['createdAt:desc'];

    const results = await index.search(query, searchOptions);

    return NextResponse.json({
      success: true,
      [type]: results.hits,
      pagination: {
        page: results.page,
        nbPages: results.nbPages,
        nbHits: results.nbHits,
        hitsPerPage: results.hitsPerPage,
      },
    });
  } catch (error) {
    console.error('Algolia search error:', error);
    return NextResponse.json(
      { success: false, message: 'Search failed', error: (error as any).message },
      { status: 500 }
    );
  }
}
```

---

## Step 7: Update Existing API Routes to Use Algolia

### 7.1 Create New Snippets Search Route
**File:** `/web/src/app/api/snippets/(web)/search/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { snippetsIndex } from '@/lib/algoliaSearch';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const query = searchParams.get('search') || '';
    const language = searchParams.get('language');
    const tag = searchParams.get('tag');
    const username = searchParams.get('user');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const page = parseInt(searchParams.get('page') || '0');

    // Build Algolia filter string
    let filters: string[] = [];
    if (language) filters.push(`lang:${language}`);
    if (tag) filters.push(`tags:${tag}`);
    if (username) filters.push(`publisherName:"${username}"`);

    const filterString = filters.length > 0 ? filters.join(' AND ') : undefined;

    const results = await snippetsIndex.search(query, {
      page,
      hitsPerPage: limit,
      filters: filterString,
      sort: ['createdAt:desc'],
    });

    return NextResponse.json({
      success: true,
      snippets: results.hits,
      pagination: {
        totalCount: results.nbHits,
        limit,
        totalPages: results.nbPages,
        hasNextPage: results.page < results.nbPages - 1,
        currentPage: results.page,
      },
    });
  } catch (error) {
    console.error('Algolia search error:', error);
    return NextResponse.json(
      { success: false, message: 'Search failed', error: (error as any).message },
      { status: 500 }
    );
  }
}
```

### 7.2 Create New Snapshots Search Route
**File:** `/web/src/app/api/snapshots/(web)/search/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { snapshotsIndex } from '@/lib/algoliaSearch';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    const query = searchParams.get('search') || '';
    const username = searchParams.get('user');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const page = parseInt(searchParams.get('page') || '0');

    let filters = '';
    if (username) filters = `publisherName:"${username}"`;

    const results = await snapshotsIndex.search(query, {
      page,
      hitsPerPage: limit,
      filters: filters || undefined,
      sort: ['createdAt:desc'],
    });

    return NextResponse.json({
      success: true,
      snapshots: results.hits,
      pagination: {
        totalCount: results.nbHits,
        limit,
        totalPages: results.nbPages,
        hasNextPage: results.page < results.nbPages - 1,
        currentPage: results.page,
      },
    });
  } catch (error) {
    console.error('Algolia search error:', error);
    return NextResponse.json(
      { success: false, message: 'Search failed', error: (error as any).message },
      { status: 500 }
    );
  }
}
```

---

## Step 8: Update Create/Update/Delete Operations

### 8.1 Update Snippet Creation
**In:** `/web/src/app/api/snippets/(web)/upload/route.ts` (or your creation route)

```typescript
// After saving to MongoDB, add:
import { indexSnippet } from '@/lib/algoliaSync';

// ... after createSnippet save to DB ...
const newSnippet = await snippet.save();

// Index in Algolia
try {
  await indexSnippet(newSnippet);
} catch (error) {
  console.error('Failed to index snippet in Algolia:', error);
  // Don't fail the request, but log it
}
```

### 8.2 Update Snippet Deletion
**In:** Your snippet deletion endpoint

```typescript
import { removeSnippetFromAlgolia } from '@/lib/algoliaSync';

// ... after deleting from MongoDB ...
try {
  await removeSnippetFromAlgolia(snippetId);
} catch (error) {
  console.error('Failed to remove snippet from Algolia:', error);
}
```

### 8.3 Update Snippet Updates
```typescript
import { indexSnippet } from '@/lib/algoliaSync';

// ... after updating in MongoDB ...
const updatedSnippet = await Snippet.findByIdAndUpdate(id, updates, { new: true });

try {
  await indexSnippet(updatedSnippet);
} catch (error) {
  console.error('Failed to update snippet in Algolia:', error);
}
```

---

## Step 9: Update Frontend Search Client

### 9.1 Update Search Utility
**File (update):** `/extension/src/utils/search.ts`

```typescript
// Add option to use Algolia (new approach)
export async function searchWithAlgolia(
  type: 'Snippets' | 'Snapshots',
  query: string,
  page: number = 0,
  filters?: { language?: string; tag?: string; user?: string }
) {
  try {
    const fetch = (await import('node-fetch')).default;

    // Build filter string
    let filterString = '';
    if (filters?.user) filterString += `user=${encodeURIComponent(filters.user)}&`;
    if (filters?.language) filterString += `language=${encodeURIComponent(filters.language)}&`;
    if (filters?.tag) filterString += `tag=${encodeURIComponent(filters.tag)}&`;

    const endpoint = type === 'Snippets' ? 'snippets' : 'snapshots';
    const apiUrl = `${API_BASE}/api/${endpoint}/search?${filterString}search=${encodeURIComponent(query)}&page=${page}`;

    const resp = await fetch(apiUrl);
    const data = await resp.json();

    if (!resp.ok || !data.success) {
      return { success: false, message: data.message || `Failed to Search ${type}!` };
    }

    const items = (data[type === 'Snapshots' ? 'snapshots' : 'snippets'] ?? []).map((item: any) => ({
      label: item.title || 'Untitled',
      detail: `By: ${item.publisherName}  |  Published-On: ${new Date(item.createdAt).toLocaleDateString()}`,
      id: item.objectID || item.id,
    }));

    return { success: true, items, pagination: data.pagination };
  } catch (err) {
    return { success: false, message: (err as any).message || `Failed to Search ${type}!` };
  }
}
```

---

## Step 10: Initial Data Migration

### 10.1 Create Migration Script
**File:** `/web/src/scripts/migrateToAlgolia.ts`

```typescript
import mongoose from 'mongoose';
import { connectDB } from '@/lib/dbConnect';
import { syncSnippetsToAlgolia, syncSnapshotsToAlgolia } from '@/lib/algoliaSync';

async function migrateToAlgolia() {
  try {
    console.log('Starting Algolia migration...');
    
    await connectDB();
    console.log('✓ Connected to MongoDB');

    console.log('Syncing snippets...');
    await syncSnippetsToAlgolia();
    console.log('✓ Snippets synced');

    console.log('Syncing snapshots...');
    await syncSnapshotsToAlgolia();
    console.log('✓ Snapshots synced');

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateToAlgolia();
```

### 10.2 Run Migration
```bash
cd web
npx ts-node src/scripts/migrateToAlgolia.ts
```

---

## Step 11: Update Search-Client Component (Frontend)

### 11.1 Update `/web/src/app/(pages)/search/search-client.tsx`

Replace the API call:

```typescript
// OLD:
// const apiUrl = `${API_BASE}/api/snippets/getAll?...`;

// NEW:
const apiUrl = `${API_BASE}/api/snippets/search?search=${encodeURIComponent(
  searchQuery
)}&language=${language}&tag=${tag}&user=${user}&page=${currentPage}&limit=${limit}`;
```

---

## Step 12: Optimization Strategies

### 12.1 Reduce Duplicate Indexing
Add this to `/web/src/lib/algoliaSync.ts`:

```typescript
// Batch operations for bulk sync
export async function batchSyncSnippets(snippets: any[]) {
  const records = snippets.map(/* mapping logic */);
  await snippetsIndex.saveObjects(records, { 
    autoGenerateObjectIDIfNotExist: false 
  });
}
```

### 12.2 Add Webhook for Real-time Sync (Optional)
Use Algolia's Insights API or MongoDB Atlas Triggers to keep indexes in sync.

### 12.3 Implement Caching
```typescript
// Use Redis or browser cache for frequent searches
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 min TTL

const cacheKey = `${type}:${query}:${page}`;
const cached = cache.get(cacheKey);
if (cached) return cached;

// Fetch from Algolia
const results = await index.search(query, options);
cache.set(cacheKey, results);
return results;
```

---

## Step 13: Performance Monitoring

### 13.1 Track Search Metrics
```typescript
// In your search routes
export async function GET(req: Request) {
  const startTime = Date.now();
  
  // ... search logic ...
  
  const duration = Date.now() - startTime;
  console.log(`Search completed in ${duration}ms`);
  
  // Send to monitoring service (e.g., Vercel Analytics, LogRocket)
}
```

### 13.2 Algolia Analytics Dashboard
- Monitor queries, click rates, and conversion metrics
- Available in Algolia Dashboard → Analytics

---

## Step 14: Fallback Strategy (Optional)

### 14.1 Implement Fallback to MongoDB
```typescript
export async function searchWithFallback(
  type: 'snippets' | 'snapshots',
  query: string,
  filters?: any
) {
  try {
    // Try Algolia first
    return await searchWithAlgolia(type, query, filters);
  } catch (error) {
    console.warn('Algolia search failed, falling back to MongoDB:', error);
    // Fall back to MongoDB search
    return await searchWithMongoDB(type, query, filters);
  }
}
```

---

## Benefits Summary

| Metric | Before (MongoDB) | After (Algolia) |
|--------|------------------|-----------------|
| Search Speed | 500-1000ms | 50-100ms |
| DB Load | High (text index + aggregation) | Minimal |
| Relevance Ranking | Basic MongoDB text scoring | Advanced ML-powered |
| Filtering Speed | Slower with large datasets | Instantaneous |
| Scalability | Limited by DB resources | Auto-scales |
| Cost | DB resources (CPU/Memory) | Per-search pricing |

---

## Troubleshooting

### Issue: Algolia index is empty
- Run migration: `npx ts-node src/scripts/migrateToAlgolia.ts`
- Check credentials in `.env.local`

### Issue: Search returns no results
- Verify index configuration in Algolia Dashboard
- Check filter strings syntax (use AND/OR correctly)
- Enable "Ranking & Relevance" in Algolia settings

### Issue: Old data still appearing
- Delete old index and recreate
- Run full sync migration
- Clear browser cache

### Issue: High Algolia costs
- Set `hitsPerPage` limit
- Implement search result caching
- Monitor query patterns

---

## Next Steps

1. **Setup Algolia Account** (Step 1)
2. **Install dependencies** (Step 2)
3. **Configure environment** (Step 3)
4. **Create service layer** (Steps 4-5)
5. **Run initial migration** (Step 10)
6. **Update API routes** (Step 6-8)
7. **Test thoroughly** before going live
8. **Monitor and optimize** (Step 13)

Good luck with the integration!
