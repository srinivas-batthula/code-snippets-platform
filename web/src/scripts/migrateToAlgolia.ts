/**
 * Migration script to sync all existing data from MongoDB to Algolia
 * Run once during initial setup: npx ts-node src/scripts/migrateToAlgolia.ts
 */

import mongoose from 'mongoose';
import { connectDB } from '@/lib/dbConnect';
import { syncSnippetsToAlgolia, syncSnapshotsToAlgolia } from '@/lib/algoliaSync';

async function migrateToAlgolia() {
  try {
    console.log('🚀 Starting Algolia migration...\n');

    // Connect to MongoDB
    console.log('📦 Connecting to MongoDB...');
    await connectDB();
    console.log('✓ Connected to MongoDB\n');

    // Sync snippets
    console.log('📝 Syncing snippets to Algolia...');
    const snippetCount = (await syncSnippetsToAlgolia()) || 0;
    console.log('✓ Snippets synced\n');

    // Sync snapshots
    console.log('📸 Syncing snapshots to Algolia...');
    const snapshotCount = (await syncSnapshotsToAlgolia()) || 0;
    console.log('✓ Snapshots synced\n');

    // Summary
    console.log('✅ Migration complete!');
    console.log(`   - Snippets indexed: ${snippetCount}`);
    console.log(`   - Snapshots indexed: ${snapshotCount}`);
    console.log('\nYou can now use Algolia search in your application!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('\nTroubleshooting tips:');
    console.error('1. Check your MongoDB connection string');
    console.error('2. Verify Algolia credentials in .env.local');
    console.error('3. Ensure NEXT_PUBLIC_ALGOLIA_APP_ID and ALGOLIA_ADMIN_KEY are set');
    process.exit(1);
  }
}

// Run migration
migrateToAlgolia();
