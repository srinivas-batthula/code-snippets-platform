# Algolia Integration Implementation Checklist

## Phase 1: Setup & Configuration
- [ ] Create Algolia account at https://www.algolia.com
- [ ] Create two indexes: `snippets` and `snapshots`
- [ ] Get Application ID and API Keys
- [ ] Add credentials to `.env.local`:
  ```
  NEXT_PUBLIC_ALGOLIA_APP_ID=...
  NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=...
  ALGOLIA_ADMIN_KEY=...
  ```

## Phase 2: Dependencies & Files
- [ ] Install: `pnpm add algoliasearch`
- [ ] Create `/web/src/lib/algoliaClient.ts`
- [ ] Create `/web/src/lib/algoliaSearch.ts`
- [ ] Create `/web/src/lib/algoliaSync.ts`
- [ ] Create `/web/src/app/api/snippets/(web)/search/route.ts`
- [ ] Create `/web/src/app/api/snapshots/(web)/search/route.ts`
- [ ] Create `/web/src/scripts/migrateToAlgolia.ts`

## Phase 3: Initial Data Migration
- [ ] Run migration script:
  ```bash
  cd web
  npx ts-node src/scripts/migrateToAlgolia.ts
  ```
- [ ] Verify data in Algolia Dashboard
- [ ] Check snippet/snapshot counts match MongoDB

## Phase 4: Update Data Operations
- [ ] Update snippet creation endpoint to call `indexSnippet()`
- [ ] Update snippet update endpoint to call `indexSnippet()`
- [ ] Update snippet delete endpoint to call `removeSnippetFromAlgolia()`
- [ ] Update snapshot creation endpoint to call `indexSnapshot()`
- [ ] Update snapshot update endpoint to call `indexSnapshot()`
- [ ] Update snapshot delete endpoint to call `removeSnapshotFromAlgolia()`

### Example: Update snippet upload endpoint
```typescript
import { indexSnippet } from '@/lib/algoliaSync';

// After saving to MongoDB:
try {
  await indexSnippet(newSnippet);
} catch (error) {
  console.error('Failed to index in Algolia (non-critical):', error);
}
```

## Phase 5: Update Frontend Search
- [ ] Update search-client.tsx to use new `/search` endpoints
- [ ] Test search functionality in UI
- [ ] Verify filters (language, tags, user) work correctly
- [ ] Check pagination works

## Phase 6: Update Extension Search
- [ ] Update `/extension/src/utils/search.ts` to use Algolia endpoints
- [ ] Test command palette search in VS Code
- [ ] Verify results are returned faster

## Phase 7: Testing & Optimization
- [ ] Performance test: Compare search times (before vs after)
- [ ] Load test: Run multiple concurrent searches
- [ ] Edge cases:
  - [ ] Empty search query
  - [ ] Special characters in search
  - [ ] Large result sets
  - [ ] Non-existent filters
- [ ] Monitor Algolia Dashboard for query patterns
- [ ] Check for any errors in logs

## Phase 8: Deployment
- [ ] Set environment variables in production
- [ ] Run migration on production database
- [ ] Monitor search performance
- [ ] Set up alerts for failed indexes
- [ ] Document Algolia setup in README

## Phase 9: Cleanup (Optional)
- [ ] Remove old MongoDB text indexes if no longer needed
- [ ] Remove old getAll endpoints once Algolia is stable
- [ ] Archive old search utility code

## Phase 10: Maintenance
- [ ] Set up daily/weekly Algolia sync job (if needed)
- [ ] Monitor Algolia usage and costs
- [ ] Keep search configuration updated
- [ ] Update documentation

## Monitoring & Metrics

### Before Integration
- Search response time: ~500-1000ms (MongoDB text search)
- Database CPU usage: High during search peaks
- Concurrent search limit: ~50-100
- Cost: Included in DB hosting

### After Integration
- Search response time: ~50-100ms (Algolia)
- Database CPU usage: Minimal (no search load)
- Concurrent search limit: Unlimited (Algolia handles)
- Cost: Pay per search operation

### Expected Improvements
- 5-10x faster search response
- 80%+ reduction in database load
- Better search relevance
- Improved user experience

## Troubleshooting Guide

### Issue: "No credentials provided"
**Solution:** Check `.env.local` has all three vars:
- `NEXT_PUBLIC_ALGOLIA_APP_ID`
- `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`
- `ALGOLIA_ADMIN_KEY`

### Issue: "Search returns 0 results"
**Solution:**
1. Check Algolia Dashboard - verify indexes aren't empty
2. Check index settings - searchable/filterable attributes
3. Test with simple query in Algolia Dashboard
4. Verify MongoDB data was properly migrated

### Issue: "Migration script fails"
**Solution:**
1. Check MongoDB connection: `mongodb+srv://...`
2. Check Algolia admin key (not search-only)
3. Verify indexes exist in Algolia Dashboard
4. Check network/firewall allows Algolia API

### Issue: "Filter not working"
**Solution:**
1. Verify attribute is marked "filterable" in Algolia
2. Check filter syntax: `lang:typescript AND tags:react`
3. Verify data contains the filter values
4. Use Algolia Dashboard to test filter

### Issue: "High Algolia costs"
**Solution:**
1. Implement result caching (cache 10 min)
2. Limit `hitsPerPage` to 20-50
3. Monitor query patterns in Algolia Analytics
4. Optimize frontend debouncing on search input
5. Consider monthly plan vs pay-per-query

## Additional Resources
- Algolia Documentation: https://www.algolia.com/doc/
- Next.js Integration: https://www.algolia.com/doc/framework-integration/nextjs/
- Algolia API Reference: https://www.algolia.com/doc/api-reference/
- Filter Syntax: https://www.algolia.com/doc/api-reference/api-parameters/filters/

## Support
For issues with:
- **Algolia**: Check Algolia Dashboard Analytics
- **NextAuth**: Check NextAuth documentation
- **MongoDB**: Check MongoDB Atlas logs
- **General**: Review error logs in `/web/.next/`
