// src/utils/vscodePaths.ts
import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';

export function getDevHostExtensionsDir(): string | null {
    // Detect dev-host launch with --extensions-dir
    const testExtArg = process.argv.find(arg => arg.startsWith('--extensions-dir='));
    if (testExtArg) {
        return testExtArg.split('=')[1];
    }
    return null; // null means real VSCode
}

/**
 * use VSCode's `globalStorageUri` as base reference
 */
function getDefaultUserDir(): string {
    try {
        const globalStorage = vscode.env.appRoot;

        if (!globalStorage) {
            throw new Error("appRoot not available");
        }
        return globalStorage;
    } catch {
        // fallback
        const home = os.homedir();
        return path.join(home, ".config", "Code", "User");
    }
}

/**
 * Settings should be modified via VSCode API, not file paths.
 */
export function getUserSettingsPath(): string {
    const baseDir = getDefaultUserDir();
    return path.join(baseDir, "User", "settings.json");
}

export function getUserKeybindingsPath(): string {
    const baseDir = getDefaultUserDir();
    return path.join(baseDir, "User", "keybindings.json");
}
