// src/commands/importSnippet.ts
import * as vscode from 'vscode';
import { fetchSnippetById } from '../utils/snippet';
import { log } from '../utils/logger';

export async function registerImportSnippet(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('codesnippets.importSnippet', async (args?: { id?: string }) => {
        try {
            let id = args?.id;  // Default value of `id`...
            if (!id) {
                id = await vscode.window.showInputBox({ prompt: 'Enter snippet `id` to import' });
                if (!id) return; // user canceled input
            }

            const res = await fetchSnippetById(id);
            if (!res.ok || !res.snippet) {
                log(`Failed to import snippet: ${res?.message || 'unknown'}`, 'warn');
                return;
            }

            const snippet = res.snippet;
            const header = buildHeaderComment(snippet);
            const contentToInsert = `${header}${snippet?.code}\n\n\n`;

            const editor = vscode.window.activeTextEditor;

            // 1: Editor exists → Append at Top of file
            if (editor) {
                await editor.edit(editBuilder => {
                    const top = new vscode.Position(0, 0);
                    editBuilder.insert(top, contentToInsert);
                });
                // log(`Imported Snippet '${snippet?.title}' into file '${editor.document.fileName}'!`, 'info');
                return;
            }

            // 2: No editor → create New file based on language
            const doc = await vscode.workspace.openTextDocument({
                language: snippet?.language || 'plaintext',
                content: contentToInsert
            });
            await vscode.window.showTextDocument(doc, { preview: false });

            // log(`Imported Snippet '${snippet?.title}' into a new file!`, 'info');
        } catch (err: any) {
            log(`Snippet Import error: ${err.message || 'unknown error'}`, 'error');
        }
    });
    context.subscriptions.push(disposable);
};


function buildHeaderComment(snippet: any): string {
    const meta = [
        `Snippet: '${snippet?.title}' (id: ${snippet?.id})`,
        `Language: ${snippet?.language}`,
        `Publisher-Name: ${snippet?.publisherName}`,
        `Created On: ${new Date(snippet?.createdAt ?? '').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })}`,
        `Last Modified On: ${new Date(snippet?.updatedAt ?? '').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })}`,
    ];

    const lang = (snippet?.language || '').toLowerCase();

    // hash-style comments
    if (['python', 'py', 'shellscript', 'bash', 'sh', 'yaml', 'yml'].includes(lang)) {
        return meta.map(line => `# ${line}`).join('\n') + '\n\n';
    }

    // HTML comments
    if (['html', 'xml'].includes(lang)) {
        return `<!--\n${meta.map(l => `  ${l}`).join('\n')}\n-->\n\n`;
    }

    // default block comments (js, ts, java, c, cpp, etc.)
    return `/*\n${meta.map(l => ` * ${l}`).join('\n')}\n */\n\n`;
}
