import algoliasearch from 'algoliasearch';

// Frontend client for search operations (read-only)
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
);

export const snippetsIndex = searchClient.initIndex('snippets');
export const snapshotsIndex = searchClient.initIndex('snapshots');
