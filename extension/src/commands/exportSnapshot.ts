import * as vscode from 'vscode';
import { uploadSnapshot } from '../utils/snapshot';
import { ensureAuth } from '../utils/auth';
import { log } from '../utils/logger';
import { getUserSettingsPath, getUserKeybindingsPath } from '../utils/vscodePaths';
import * as fs from 'fs';

// Limits (same as API validation)...
const MAX_EXTENSIONS_COUNT = 200;
const MAX_SNAPSHOT_SIZE = 100_000; // ~100KB

export async function registerExportSnapshot(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('codesnippets.exportSnapshot', async () => {
        try {
            // 1: Ensure Auth
            const tokenRes = await ensureAuth(context);
            if (!tokenRes) return;
            const token = String(tokenRes);

            // 2: Collect settings.json
            const settingsPath = getUserSettingsPath();
            const settingsContent = fs.existsSync(settingsPath) ? JSON.parse(fs.readFileSync(settingsPath, 'utf8')) : {};

            // 3: Collect keybindings.json
            const keybindingsPath = getUserKeybindingsPath();
            const keybindingsContent = fs.existsSync(keybindingsPath) ? JSON.parse(fs.readFileSync(keybindingsPath, 'utf8')) : [];

            // 4. Collect All Installed Extensions...
            const extensions = vscode.extensions.all.map(ext => ext.id) as string[];

            // 5: Check Snapshot / Extensions size limits...
            const snapshotSize = JSON.stringify({ settingsContent, keybindingsContent }).length;
            if (snapshotSize > MAX_SNAPSHOT_SIZE) {
                log(`Snapshot too large! Max allowed size is ${MAX_SNAPSHOT_SIZE} characters!`, 'warn');
                return;
            }
            if (extensions.length > MAX_EXTENSIONS_COUNT) {
                log(`Too many extensions! Max allowed is ${MAX_EXTENSIONS_COUNT}!`, 'warn');
                return;
            }

            // 6: Prompt for snapshot title
            const title = await vscode.window.showInputBox({
                prompt: 'Enter a title for this Snapshot',
                placeHolder: 'e.g: My Web Dev Environment',
                ignoreFocusOut: true,
                validateInput(value) {
                    if (!value || value.trim().length === 0) return 'Title is required!';
                    if (value.length > 100) return 'Title too long (max 100 chars)!';
                    return null;
                },
            });
            if (!title) { // user canceled input
                return;
            }

            // 7: Upload to API (via helper)...
            const res = await uploadSnapshot({
                settings: settingsContent,
                keybindings: keybindingsContent,
                extensions,
                title,
                token,
            });

            // 8. Handle Upload...
            if (res.ok && res.id) {
                await vscode.env.clipboard.writeText(res.id); // copy snapshot id to clipboard...

                const open = 'Open Snapshot on Website';
                const action = await vscode.window.showInformationMessage(`Snapshot uploaded! ID copied to clipboard: ${res.id}`, open);
                if (action === open && res.url) {
                    vscode.env.openExternal(vscode.Uri.parse(res.url));
                }
                // log(`Snapshot uploaded successfully with ID: ${res.id}`, 'info');
            } else {
                log(`Upload failed: ${res.message}`, 'warn');
            }
        } catch (err: any) {
            log(`Export Snapshot Error: ${err.message || 'unknown error'}`, 'error');
        }
    });
    context.subscriptions.push(disposable);
}
