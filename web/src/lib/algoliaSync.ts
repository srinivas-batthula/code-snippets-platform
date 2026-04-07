import algoliaClient from './algoliaClient';
import Snippet from '@/models/Snippet';
import Snapshot from '@/models/Snapshot';

const snippetsIndex = algoliaClient.initIndex('snippets');
const snapshotsIndex = algoliaClient.initIndex('snapshots');

/**
 * Sync all snippets from MongoDB to Algolia
 * Used for initial migration or full re-indexing
 */
export async function syncSnippetsToAlgolia() {
  try {
    const snippets = await Snippet.find({}).lean();
    
    const records = snippets.map((snippet: any) => ({
      objectID: snippet._id.toString(),
      title: snippet.title,
      description: snippet.description || '',
      code: snippet.code.substring(0, 5000), // Limit for index size
      lang: snippet.lang,
      tags: snippet.tags || [],
      publisherName: snippet.publisherName,
      publisherId: snippet.publisherId.toString(),
      createdAt: new Date(snippet.createdAt).getTime(),
      updatedAt: new Date(snippet.updatedAt).getTime(),
    }));

    if (records.length === 0) {
      console.log('No snippets to sync');
      return;
    }

    await snippetsIndex.saveObjects(records, { autoGenerateObjectIDIfNotExist: false });
    console.log(`✓ Synced ${records.length} snippets to Algolia`);
    return records.length;
  } catch (error) {
    console.error('Error syncing snippets to Algolia:', error);
    throw error;
  }
}

/**
 * Sync all snapshots from MongoDB to Algolia
 * Used for initial migration or full re-indexing
 */
export async function syncSnapshotsToAlgolia() {
  try {
    const snapshots = await Snapshot.find({}).lean();
    
    const records = snapshots.map((snapshot: any) => ({
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

    if (records.length === 0) {
      console.log('No snapshots to sync');
      return;
    }

    await snapshotsIndex.saveObjects(records, { autoGenerateObjectIDIfNotExist: false });
    console.log(`✓ Synced ${records.length} snapshots to Algolia`);
    return records.length;
  } catch (error) {
    console.error('Error syncing snapshots to Algolia:', error);
    throw error;
  }
}

/**
 * Index a single snippet (called after create/update)
 */
export async function indexSnippet(snippet: any) {
  try {
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
    console.log(`✓ Indexed snippet: ${snippet._id}`);
  } catch (error) {
    console.error('Error indexing snippet:', error);
    throw error;
  }
}

/**
 * Index a single snapshot (called after create/update)
 */
export async function indexSnapshot(snapshot: any) {
  try {
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
    console.log(`✓ Indexed snapshot: ${snapshot._id}`);
  } catch (error) {
    console.error('Error indexing snapshot:', error);
    throw error;
  }
}

/**
 * Remove snippet from Algolia index
 */
export async function removeSnippetFromAlgolia(snippetId: string) {
  try {
    await snippetsIndex.deleteObject(snippetId);
    console.log(`✓ Removed snippet from Algolia: ${snippetId}`);
  } catch (error) {
    console.error('Error removing snippet from Algolia:', error);
    throw error;
  }
}

/**
 * Remove snapshot from Algolia index
 */
export async function removeSnapshotFromAlgolia(snapshotId: string) {
  try {
    await snapshotsIndex.deleteObject(snapshotId);
    console.log(`✓ Removed snapshot from Algolia: ${snapshotId}`);
  } catch (error) {
    console.error('Error removing snapshot from Algolia:', error);
    throw error;
  }
}

/**
 * Batch sync multiple snippets
 */
export async function batchSyncSnippets(snippets: any[]) {
  try {
    const records = snippets.map((snippet: any) => ({
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
    }));

    await snippetsIndex.saveObjects(records, { autoGenerateObjectIDIfNotExist: false });
    console.log(`✓ Batch synced ${records.length} snippets to Algolia`);
  } catch (error) {
    console.error('Error batch syncing snippets:', error);
    throw error;
  }
}

/**
 * Batch sync multiple snapshots
 */
export async function batchSyncSnapshots(snapshots: any[]) {
  try {
    const records = snapshots.map((snapshot: any) => ({
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
    console.log(`✓ Batch synced ${records.length} snapshots to Algolia`);
  } catch (error) {
    console.error('Error batch syncing snapshots:', error);
    throw error;
  }
}
