// extension/src/utils/search.ts
import * as vscode from 'vscode';

const config = vscode.workspace.getConfiguration("codesnippets");
const API_BASE = config.get<string>('apiBaseUrl')!;

// @helper Fetch-Snippet...
export async function search(type: 'Snippets' | 'Snapshots', query: string, cursor: string | null): Promise<{ success: boolean, message?: string, items?: Record<string, any>[], pagination?: Record<string, any> }> {
    try {
        const fetch = (await import('node-fetch')).default; // dynamic import of `fetch`...

        // Build Search-Queries respective to Backend-API's...
        const queryParams = parseSearchQuery(query, cursor);

        // Prepare API URL
        const apiUrl = (type === 'Snippets') ? `${API_BASE}/api/snippets/getAll?${queryParams}` : `${API_BASE}/api/snapshots/getAll?${queryParams}`;

        // Fetch results
        const resp = await fetch(apiUrl);
        const data = await resp.json() as { success: boolean, message?: string, snippets?: Record<string, any>[], snapshots?: Record<string, any>[], pagination?: Record<string, any> };
        if (!resp.ok || !data.success) {
            return { success: false, message: data.message || `Failed to Search ${type}!` };
        }

        const items = (data[type === 'Snapshots' ? 'snapshots' : 'snippets'] ?? []).map((item: any) => ({
            label: item.title || 'Untitled',
            detail: `By: ${item.publisherName}  |  Published-On: ${new Date(item.createdAt).toLocaleDateString()}`,
            id: item.id
        }));

        return { success: true, items, pagination: data.pagination };
    }
    catch (err) {
        return { success: false, message: (err as any).message || `Failed to Search ${type}!` };
    }
}

// Helper: Parse query string into structured params
function parseSearchQuery(query: string, cursor: string | null): string {
    const idMatch = query.match(/id:([^\s]+)/);
    const userMatch = query.match(/user:([^\s]+)/);
    const langMatch = query.match(/lang:([^\s]+)/);
    const tagMatch = query.match(/tag:([^\s]+)/);

    const id = idMatch?.[1];
    const user = userMatch?.[1];
    const lang = langMatch?.[1];
    const tag = tagMatch?.[1];

    // Remove parsed parts from original query
    const cleanedQuery = query
        .replace(/id:([^\s]+)/, '')
        .replace(/user:[^\s]+/, '')
        .replace(/lang:[^\s]+/, '')
        .replace(/tag:[^\s]+/, '')
        .trim();

    const params = new URLSearchParams();

    if (cursor) params.append('cursor', cursor);
    if (id) params.append('id', id);
    if (user) params.append('user', user);
    if (lang) params.append('lang', lang);
    if (tag) params.append('tag', tag);
    if (cleanedQuery) params.append('search', cleanedQuery);

    return params.toString(); // Returns full 'query-string' like:-> user=alice&lang=ts&search=free text...
}
