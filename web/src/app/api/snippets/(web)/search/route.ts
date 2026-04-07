import { NextResponse } from 'next/server';
import { snippetsIndex } from '@/lib/algoliaSearch';

/**
 * Algolia-powered search for snippets
 * Query params:
 * - search: search query string
 * - language: filter by programming language
 * - tag: filter by tag
 * - user: filter by publisher name
 * - page: pagination page (0-indexed)
 * - limit: results per page (max 100)
 */
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
    const filters: string[] = [];
    if (language) {
      filters.push(`lang:${language}`);
    }
    if (tag) {
      filters.push(`tags:${tag}`);
    }
    if (username) {
      filters.push(`publisherName:"${username}"`);
    }

    const filterString = filters.length > 0 ? filters.join(' AND ') : undefined;

    const startTime = Date.now();
    const results = await snippetsIndex.search(query, {
      page,
      hitsPerPage: limit,
      filters: filterString,
      sort: ['createdAt:desc'],
      attributesToRetrieve: [
        'objectID',
        'title',
        'description',
        'lang',
        'tags',
        'publisherName',
        'publisherId',
        'createdAt',
        'updatedAt',
      ],
    });
    const duration = Date.now() - startTime;

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
