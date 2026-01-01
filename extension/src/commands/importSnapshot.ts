// src/commands/importSnapshot.ts
import * as vscode from 'vscode';
import { fetchSnapshotById, installExtensions, mergeSettings, mergeKeybindings } from '../utils/snapshot';
import { getUserSettingsPath, getUserKeybindingsPath } from '../utils/vscodePaths';
import { log } from '../utils/logger';

export async function registerImportSnapshot(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('codesnippets.importSnapshot',
        async (args?: { id?: string }) => {
            try {
                // 1: Prompt user for Snapshot ID
                let id = args?.id; // Default value of `id`...
                if (!id) {
                    id = await vscode.window.showInputBox({
                        prompt: 'Enter snapshot `id` to import'
                    });
                    if (!id) return; // user canceled input
                }

                const res = await fetchSnapshotById(id);
                if (!res.ok || !res.snapshot) {
                    log(`Failed to import snapshot: ${res.message || 'unknown error'}`, 'warn');
                    return;
                }
                const snapshot = res.snapshot;

                // Show Snapshot Preview...
                const previewMsg = `
                    Snapshot: ${snapshot.title}

                    Extensions: ${snapshot.extensions?.length || 0}
                    Settings: ${Object.keys(snapshot.settings || {}).length}
                    Keybindings: ${snapshot.keybindings?.length || 0}
                `;
                const proceed = await vscode.window.showInformationMessage(
                    previewMsg,
                    { modal: true },
                    'Continue',
                    'Cancel'
                );
                if (proceed !== 'Continue') return;

                // User Preferences to Setup...
                const options = await vscode.window.showQuickPick(
                    [
                        { label: 'Install Extensions', picked: true },
                        { label: 'Merge Settings', picked: true },
                        { label: 'Merge Keybindings', picked: true }
                    ],
                    {
                        canPickMany: true,
                        title: 'Select snapshot import options to Setup'
                    }
                );
                if (!options) return;

                log(`Installing your new setup...
                        This may take a moment, Please Wait!`, 'info');

                const shouldInstallExtensions = options.some(o => o.label === 'Install Extensions');
                const shouldMergeSettings = options.some(o => o.label === 'Merge Settings');
                const shouldMergeKeybindings = options.some(o => o.label === 'Merge Keybindings');

                // PROGRESS BAR STARTS HERE...
                await vscode.window.withProgress(
                    {
                        location: vscode.ProgressLocation.Notification,
                        title: `Importing Snapshot: ${snapshot.title}`,
                        cancellable: false
                    },
                    async (progress) => {

                        progress.report({ message: 'Preparing snapshot...', increment: 10 });

                        let newExts: number = 0, skippedExts: number = 0;

                        // 2: Install Only Missing Extensions...
                        if (shouldInstallExtensions && Array.isArray(snapshot.extensions) && snapshot.extensions.length > 0) {
                            progress.report({ message: 'Installing extensions...', increment: 30 });

                            const { newInstalls, skipped } = await installExtensions(snapshot.extensions);
                            newExts = newInstalls.length || 0;
                            skippedExts = skipped || 0;
                        } else {
                            progress.report({ increment: 30 });
                        }

                        // 3: Merge settings.json
                        let newSettings: number = 0;
                        const settingsPath = getUserSettingsPath();
                        if (shouldMergeSettings && snapshot.settings && typeof snapshot.settings === 'object') {
                            progress.report({ message: 'Merging settings...', increment: 30 });

                            const { count } = await mergeSettings(snapshot.settings, settingsPath);
                            newSettings = count;
                        } else {
                            progress.report({ increment: 30 });
                        }

                        // 4: Merge keybindings.json
                        let newKeybindings: number = 0;
                        const keybindingsPath = getUserKeybindingsPath();
                        if (shouldMergeKeybindings && snapshot.keybindings && Array.isArray(snapshot.keybindings)) {
                            progress.report({ message: 'Merging keybindings...', increment: 20 });

                            const { count } = await mergeKeybindings(snapshot.keybindings, keybindingsPath);
                            newKeybindings = count;
                        } else {
                            progress.report({ increment: 20 });
                        }

                        progress.report({ message: 'Finalizing...', increment: 10 });

                        // 5. Final Log-Message for 'user'...
                        log(`Snapshot '${snapshot.title}' imported successfully!\nInstalled ${newExts} new extension(s),\nMerged 'settings.json' & 'keybindings.json with ${newSettings + newKeybindings} new value(s)!'`, 'info');
                    }
                );
            } catch (err: any) {
                log(`Snapshot Import error: ${err.message || 'unknown error'}`, 'error');
            }
        }
    );
    context.subscriptions.push(disposable);
};
