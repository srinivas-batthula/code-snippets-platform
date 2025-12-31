// src/commands/search.ts
import * as vscode from 'vscode';
import { search } from '../utils/search';
import { log } from '../utils/logger';

export async function registerSearch(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('codesnippets.search', async () => {
        try {
            // Ask whether to search snippets or snapshots...
            const type = await vscode.window.showQuickPick(['Snippets', 'Snapshots'], {
                placeHolder: 'Select what you want to search...',
                ignoreFocusOut: true
            }) as 'Snippets' | 'Snapshots';
            if (!type) return; // user canceled

            // Ask for search text (query)
            const searchQuery = await vscode.window.showInputBox({
                prompt: `Enter search text for ${type}`,
                placeHolder: (type === 'Snippets') ? "e.g: React-fetch snippet user:srinivas lang:javascript" : "e.g: React Dev-Env snapshot user:srinivas",
                ignoreFocusOut: true
            });
            if (!searchQuery || searchQuery.trim() === '') return;

            // Paginated Results Loop...
            let cursor: string | null = null;
            let allItems: Record<string, any>[] = [];
            let totalCount: number = 0;

            while (true) {
                // fetch with cursor
                const result = await search(type, searchQuery, cursor);

                if (!result || !result.success || !result.items || !result.pagination) {
                    log(result.message ?? `Failed to Search ${type}!`, 'warn');
                    return;
                }
                if (result.items.length === 0) {
                    log(`No ${type} found for "${searchQuery}"`, 'warn');
                    return;
                }

                allItems = [...allItems, ...result.items]; // All Items of all Pages...
                if (!cursor) {          // Only Update `totalCount` for the 1st time (page-1)...
                    totalCount = result.pagination.totalCount;
                }

                // add "Load more" btn if available for pagination...
                const quickPickItems = [
                    ...allItems,
                    ...(result.pagination?.hasNextPage
                        ? [{ label: "🔽 Load more results...", detail: "", id: "__load_more__" }]
                        : [])
                ];

                // Show results in QuickPick-View...
                const selected = await vscode.window.showQuickPick(quickPickItems.map((item) => ({
                    label: item.label,
                    detail: item.detail,
                    id: item.id
                })),
                    {
                        placeHolder: `"${totalCount}" Search results for "${searchQuery}"`,
                        ignoreFocusOut: true
                    }
                );
                
                if (!selected) return;

                if (selected.id === "__load_more__") {
                    cursor = result.pagination?.nextCursor || null;
                    continue; // fetch 'next page'...
                }

                // Trigger 'Import Command' for selected item...
                const cmd = (type === 'Snapshots') ? 'codesnippets.importSnapshot' : 'codesnippets.importSnippet';
                vscode.commands.executeCommand(cmd, { id: selected.id });
                break;      // 'Stop' this `Loop` completely, If user selects any specific 'Snippet / Snapshot'...
            }
        } catch (err: any) {
            log(`Search Failed: ${err.message || 'unknown error'}`, 'error');
        }
    });
    context.subscriptions.push(disposable);
}
