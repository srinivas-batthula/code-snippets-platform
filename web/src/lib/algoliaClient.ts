import algoliasearch from 'algoliasearch';

// Backend admin client for indexing operations
const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.ALGOLIA_ADMIN_KEY || ''
);

export default algoliaClient;
