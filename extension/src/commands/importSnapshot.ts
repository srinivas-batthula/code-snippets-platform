// src/commands/importSnapshot.ts
import * as vscode from 'vscode';
import { fetchSnapshotById, installExtensions, mergeSettings, mergeKeybindings } from '../utils/snapshot';
import { getUserSettingsPath, getUserKeybindingsPath } from '../utils/vscodePaths';
import { log } from '../utils/logger';

export async function registerImportSnapshot(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('codesnippets.importSnapshot', async (args?: { id?: string }) => {
        try {
            // 1: Prompt user for Snapshot ID
            let id = args?.id;  // Default value of `id`...
            if (!id) {
                id = await vscode.window.showInputBox({ prompt: 'Enter snapshot `id` to import' });
                if (!id) return; // user canceled input
            }

            const res = await fetchSnapshotById(id);
            if (!res.ok || !res.snapshot) {
                log(`Failed to import snapshot: ${res.message || 'unknown error'}`, 'warn');
                return;
            }

            const snapshot = res.snapshot;

            let newExts: number = 0, skippedExts: number = 0;    // Newly installed & Skipped Extensions Count...
            // 2: Install Only Missing Extensions...
            if (Array.isArray(snapshot.extensions) && snapshot.extensions.length > 0) {
                const { newInstalls, skipped } = await installExtensions(snapshot.extensions);
                newExts = newInstalls.length || 0;
                skippedExts = skipped || 0;
                // log(`Installed ${newInstalls.length} new extension(s), skipped ${skipped}!`, 'info');
            }

            // 3: Merge settings.json
            let newSettings: number = 0;
            const settingsPath = getUserSettingsPath();
            if (snapshot.settings && typeof snapshot.settings === 'object') {
                const { count } = await mergeSettings(snapshot.settings, settingsPath);
                newSettings = count;
                // log(`Settings merged successfully!`, 'info');
            }

            // 4: Merge keybindings.json
            let newKeybindings: number = 0;
            const keybindingsPath = getUserKeybindingsPath();
            if (snapshot.keybindings && Array.isArray(snapshot.keybindings)) {
                const { count } = await mergeKeybindings(snapshot.keybindings, keybindingsPath);
                newKeybindings = count;
                // log(`Keybindings merged successfully!`, 'info');
            }

            // 5. Final Log-Message for 'user'...
            log(`Snapshot '${snapshot.title}' imported successfully!\nInstalled ${newExts} new extension(s),\nMerged 'settings.json' & 'keybindings.json with ${newSettings + newKeybindings} new value(s)!'`, 'info');
        } catch (err: any) {
            log(`Snapshot Import error: ${err.message || 'unknown error'}`, 'error');
        }
    });
    context.subscriptions.push(disposable);
};
