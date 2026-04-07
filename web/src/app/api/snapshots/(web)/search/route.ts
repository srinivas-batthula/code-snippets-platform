import { NextResponse } from 'next/server';
import { snapshotsIndex } from '@/lib/algoliaSearch';

/**
 * Algolia-powered search for snapshots
 * Query params:
 * - search: search query string
 * - user: filter by publisher name
 * - page: pagination page (0-indexed)
 * - limit: results per page (max 100)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get('search') || '';
    const username = searchParams.get('user');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const page = parseInt(searchParams.get('page') || '0');

    // Build Algolia filter string
    let filterString: string | undefined = undefined;
    if (username) {
      filterString = `publisherName:"${username}"`;
    }

    const startTime = Date.now();
    const results = await snapshotsIndex.search(query, {
      page,
      hitsPerPage: limit,
      filters: filterString,
      sort: ['createdAt:desc'],
      attributesToRetrieve: [
        'objectID',
        'title',
        'description',
        'publisherName',
        'publisherId',
        'extensionsCount',
        'settingsCount',
        'keybindingsCount',
        'createdAt',
        'updatedAt',
      ],
    });
    const duration = Date.now() - startTime;

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
      meta: {
        searchTime: `${duration}ms`,
      },
    });
  } catch (error) {
    console.error('Algolia search error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Search failed',
        error: (error as any).message,
      },
      { status: 500 }
    );
  }
}
