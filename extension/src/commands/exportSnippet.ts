// src/commands/exportSnippet.ts
import * as vscode from 'vscode';
import { uploadSnippet } from '../utils/snippet';
import { ensureAuth } from '../utils/auth';
import { log } from '../utils/logger';

const MAX_SNIPPET_SIZE = 10_000; // characters (10KB approx)


export async function registerExportSnippet(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('codesnippets.exportSnippet', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            log('No active editor — please open a file and select code.', 'error');
            return;
        }

        const selectedCode = editor.document.getText(editor.selection);
        if (!selectedCode || selectedCode.trim().length === 0) {
            log('Please select some code to export!', 'error');
            return;
        }

        if (selectedCode.length > MAX_SNIPPET_SIZE) {   // Don't Allow Too-large Snippets...
            log(`Snippet too large! Max allowed size is ${MAX_SNIPPET_SIZE} characters.`, 'warn');
            return;
        }

        // Step 1: Prompt for title
        const title = await vscode.window.showInputBox({
            prompt: 'Enter a title for this snippet',
            placeHolder: 'e.g: binarySearch() in JavaScript',
            ignoreFocusOut: true,
            validateInput(value) {
                if (!value || value.trim().length === 0) return 'Title is required!';
                if (value.length > 100) return 'Title too long (max 100 characters)!';
                return null;
            },
        });

        if (!title) { // user canceled input
            log('User Cancelled the Upload!', 'warn');
            return;
        }

        try {
            // Step 2: Ensure auth
            const token = await ensureAuth(context);
            if (!token) return;

            // Step 3: Upload to API (via helper)...
            const res = await uploadSnippet({
                code: selectedCode,
                title,
                language: editor.document.languageId.toString(),
                token,
            });

            if (res.ok && res.id) {
                await vscode.env.clipboard.writeText(res.id);   // copy `id` to 'clipboard'...

                const open = 'Open Snippet on Website';
                const action = await vscode.window.showInformationMessage(`✅ Snippet uploaded! ID copied to clipboard: ${res.id}`, open);
                if (action === open && res.url) {               // Open 'newly-created Snippet' directly from VSCode...
                    vscode.env.openExternal(vscode.Uri.parse(res.url));
                }
                // log(`✅ Snippet uploaded! ID copied to clipboard: ${res.id}`, 'info');
            } else {
                log(`❌ Upload failed: ${res.message}`, 'warn');
            }
        } catch (err: any) {
            log(`❌ Upload error: ${err.message || 'unknown error'}`, 'error');
        }
    });
    context.subscriptions.push(disposable);
};
