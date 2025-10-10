// src/commands/openSnapshotFiles.ts
import * as vscode from 'vscode';
import { getUserSettingsPath, getUserKeybindingsPath } from '../utils/vscodePaths';
import { log } from '../utils/logger';

export async function registerOpenSnapshotFiles(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('codesnippets.openSnapshotFiles', async () => {
        try {
            const options = ['Open settings.json', 'Open keybindings.json', 'Open settings.json.bak -backup file', 'Open keybindings.json.bak -backup file'];
            const choice = await vscode.window.showQuickPick(options, { placeHolder: 'Select file to Open' });
            if (!choice) return; // user canceled

            let filePath = '';
            switch (choice) {
                case 'Open settings.json':
                    filePath = getUserSettingsPath();
                    break;
                case 'Open keybindings.json':
                    filePath = getUserKeybindingsPath();
                    break;
                case 'Open settings.json.bak':
                    filePath = `${getUserSettingsPath()}.bak`;
                    break;
                case 'Open keybindings.json.bak':
                    filePath = `${getUserKeybindingsPath()}.bak`;
                    break;
            }
            // Open the file in VSCode editor
            const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
            await vscode.window.showTextDocument(doc);
            log(`Opened file: ${filePath}`, 'info');
        } catch (err: any) {
            log(`❌ Failed to open file: ${err.message || 'unknown error'}`, 'error');
        }
    });
    context.subscriptions.push(disposable);
}
