/**
 * Example: How to integrate Algolia indexing into existing endpoints
 * This shows how to add Algolia indexing to your data operations
 * WITHOUT breaking existing functionality
 */

// ============================================
// EXAMPLE 1: Update Snippet Creation
// ============================================
// In your snippet creation endpoint (e.g., /api/snippets/(web)/upload/route.ts)

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import Snippet from '@/models/Snippet';
import { indexSnippet } from '@/lib/algoliaSync'; // NEW: Import Algolia function

export async function POST(req: Request) {
  try {
    await connectDB();

    // ... your existing validation code ...

    const snippetData = {
      title: /* ... */,
      description: /* ... */,
      code: /* ... */,
      lang: /* ... */,
      tags: /* ... */,
      publisherId: /* ... */,
      publisherName: /* ... */,
    };

    const newSnippet = new Snippet(snippetData);
    await newSnippet.save();

    // NEW: Index in Algolia (fire and forget - don't block response)
    try {
      await indexSnippet(newSnippet);
      console.log('✓ Snippet indexed in Algolia');
    } catch (error) {
      console.error('⚠️ Failed to index snippet in Algolia (non-critical):', error);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      snippet: newSnippet,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as any).message },
      { status: 500 }
    );
  }
}

// ============================================
// EXAMPLE 2: Update Snippet Edit/Update
// ============================================
// In your snippet update endpoint

import { indexSnippet } from '@/lib/algoliaSync'; // NEW

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = await params;
    const updates = await req.json();

    // Update in MongoDB
    const updatedSnippet = await Snippet.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedSnippet) {
      return NextResponse.json(
        { success: false, message: 'Snippet not found' },
        { status: 404 }
      );
    }

    // NEW: Update Algolia index
    try {
      await indexSnippet(updatedSnippet);
      console.log('✓ Snippet updated in Algolia');
    } catch (error) {
      console.error('⚠️ Failed to update snippet in Algolia (non-critical):', error);
    }

    return NextResponse.json({
      success: true,
      snippet: updatedSnippet,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as any).message },
      { status: 500 }
    );
  }
}

// ============================================
// EXAMPLE 3: Update Snippet Delete
// ============================================
// In your snippet delete endpoint

import { removeSnippetFromAlgolia } from '@/lib/algoliaSync'; // NEW

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { id } = await params;

    const snippet = await Snippet.findByIdAndDelete(id);

    if (!snippet) {
      return NextResponse.json(
        { success: false, message: 'Snippet not found' },
        { status: 404 }
      );
    }

    // NEW: Remove from Algolia index
    try {
      await removeSnippetFromAlgolia(id);
      console.log('✓ Snippet removed from Algolia');
    } catch (error) {
      console.error('⚠️ Failed to remove snippet from Algolia (non-critical):', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Snippet deleted',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: (error as any).message },
      { status: 500 }
    );
  }
}

// ============================================
// EXAMPLE 4: Apply same pattern to Snapshots
// ============================================

import { indexSnapshot, removeSnapshotFromAlgolia } from '@/lib/algoliaSync';
import Snapshot from '@/models/Snapshot';

// For snapshot creation:
const newSnapshot = new Snapshot(snapshotData);
await newSnapshot.save();
try {
  await indexSnapshot(newSnapshot);
} catch (error) {
  console.error('⚠️ Failed to index snapshot in Algolia:', error);
}

// For snapshot update:
const updatedSnapshot = await Snapshot.findByIdAndUpdate(id, updates, { new: true });
try {
  await indexSnapshot(updatedSnapshot);
} catch (error) {
  console.error('⚠️ Failed to update snapshot in Algolia:', error);
}

// For snapshot delete:
const snapshot = await Snapshot.findByIdAndDelete(id);
try {
  await removeSnapshotFromAlgolia(id);
} catch (error) {
  console.error('⚠️ Failed to remove snapshot from Algolia:', error);
}

// ============================================
// EXAMPLE 5: Update Frontend Search Component
// ============================================
// In search-client.tsx

export function SearchClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [language, setLanguage] = useState('');
  const [tag, setTag] = useState('');

  const performSearch = async () => {
    try {
      // NEW: Call Algolia search endpoint instead of /getAll
      const params = new URLSearchParams({
        search: searchQuery,
        ...(language && { language }),
        ...(tag && { tag }),
        limit: '20',
      });

      const response = await fetch(
        `/api/snippets/search?${params.toString()}`
      );

      const data = await response.json();
      if (data.success) {
        // data.snippets now contains results from Algolia
        setResults(data.snippets);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    // ... your component JSX ...
  );
}

// ============================================
// EXAMPLE 6: Error Handling Pattern
// ============================================

async function upsertWithAlgolia(snippet: any) {
  const result = {
    mongoSuccess: false,
    algoliaSuccess: false,
    errors: [] as string[],
  };

  try {
    // Save to MongoDB
    await snippet.save();
    result.mongoSuccess = true;
  } catch (error) {
    result.errors.push(`MongoDB error: ${(error as any).message}`);
    return result;
  }

  try {
    // Index in Algolia (best effort)
    await indexSnippet(snippet);
    result.algoliaSuccess = true;
  } catch (error) {
    // Log but don't fail - Algolia is optional for app functionality
    result.errors.push(`Algolia error: ${(error as any).message}`);
    console.error('Non-critical Algolia error:', error);
  }

  return result;
}

// ============================================
// KEY PRINCIPLES
// ============================================

/**
 * 1. ALWAYS update MongoDB first
 *    - MongoDB is your source of truth
 *    - Algolia is for search performance only
 *
 * 2. Algolia updates are "best effort"
 *    - If Algolia fails, don't fail the user request
 *    - Log the error for debugging
 *    - User can still use MongoDB for search (fallback)
 *
 * 3. Use try-catch for Algolia operations
 *    - Don't let Algolia errors break your API
 *    - Always provide graceful degradation
 *
 * 4. Use async/await properly
 *    - Don't block user requests on Algolia indexing
 *    - Could use background jobs (BullMQ, Celery) for large scale
 *
 * 5. Test both systems together
 *    - Verify MongoDB and Algolia stay in sync
 *    - Test failover scenarios
 *    - Monitor both systems
 */
