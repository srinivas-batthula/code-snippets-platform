// src/commands/importSnippet.ts
import * as vscode from 'vscode';
import { fetchSnippetById } from '../utils/snippet';
import { log } from '../utils/logger';


export async function registerImportSnippet(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('codesnippets.importSnippet', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            log('No active editor — Open a file first to insert the snippet!', 'error');
            return;
        }

        try {
            const id = await vscode.window.showInputBox({ prompt: 'Enter snippet `id` to import' });
            if (!id) { // user canceled input
                // log('User Cancelled the Import!', 'warn');
                return;
            }

            const res = await fetchSnippetById(id);
            if (!res.ok) {
                log(`❌ Failed to import snippet: ${res?.message || 'unknown'}`, 'warn');
                return;
            }

            const snippet = res.snippet;

            // you can add a 'header-comment' noting import source...
            const header = `/* ----- Snippet: '${snippet?.title}' (id: ${snippet?.id}) -----
    * Language: ${snippet?.language}
    * Publisher-Name: ${snippet?.publisherName}
    * Created On: ${new Date(snippet?.createdAt ?? '').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })}
    * Last Modified On: ${new Date(snippet?.updatedAt ?? '').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })}
*/\n`;
            const contentToInsert = `${header}${snippet?.code}\n\n\n`;

            await editor.edit(editBuilder => {  // Insert / Append the imported-Snippet at the Top of the file...
                const top = new vscode.Position(0, 0);
                editBuilder.insert(top, contentToInsert);
            });

            log(`✅ Imported Snippet '${snippet?.title}' into file '${editor.document.fileName}'!`, 'info');
        } catch (err: any) {
            log(`❌ Import error: ${err.message || 'unknown error'}`, 'error');
        }
    });
    context.subscriptions.push(disposable);
};
