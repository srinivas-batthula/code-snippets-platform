// extension/src/utils/snippet.ts
import * as vscode from 'vscode';

const config = vscode.workspace.getConfiguration("codesnippets");
const API_BASE = config.get<string>('apiBaseUrl')!;

// @helper Export-Snippet...
export async function uploadSnippet({ code, title, language, token }: {
    code: string;
    title: string;
    language: string;
    token: string;
}): Promise<{ ok: boolean, message: string, id?: string, url?: string }> {
    try {
        const fetch = (await import('node-fetch')).default; // dynamic import for node-fetch to support ESM/CJS interop

        const resp = await fetch(`${API_BASE}/api/snippets/export`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                code,
                title,
                language,
            }),
        });

        const res = await resp.json() as { ok: boolean, message: string, id?: string, url?: string };
        return res;
    }
    catch (err) {
        return { ok: false, message: (err as any).message || 'Failed to Upload!' };
    }
};

// @helper Fetch-Snippet...
export async function fetchSnippetById(id: string): Promise<{ ok: boolean, message?: string, snippet?: Record<string, string> }> {
    try {
        const fetch = (await import('node-fetch')).default;

        const resp = await fetch(`${API_BASE}/api/snippets/import/${id}`);

        const res = await resp.json() as { ok: boolean, message?: string, snippet?: Record<string, string> };
        return res;
    }
    catch (err) {
        return { ok: false, message: (err as any).message || 'Failed to Import!' };
    }
}
