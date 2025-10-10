// src/utils/vscodePaths.ts
import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';

export function getDevHostExtensionsDir(): string | null {
    const userDataDir = vscode.env.appRoot; // Returns path to VSCode installation
    // If we detect dev-host launch with .vscode-test, we can read process.argv
    const testExtArg = process.argv.find(arg => arg.startsWith('--extensions-dir='));
    if (testExtArg) {
        return testExtArg.split('=')[1];
    }
    return null; // null means real VSCode
}

function getDefaultUserDir(): string {
    const home = os.homedir();
    const platform = process.platform;

    if (platform === "win32") { // Windows
        return path.join(process.env.APPDATA || path.join(home, "AppData", "Roaming"), "Code", "User");
    } else if (platform === "darwin") { // MacOS
        return path.join(home, "Library", "Application Support", "Code", "User");
    } else { // Linux
        return path.join(home, ".config", "Code", "User");
    }
}

export function getUserSettingsPath(): string {
    // const devDir = getDevHostUserDir();
    const baseDir = getDefaultUserDir();
    return path.join(baseDir, "settings.json");
}

export function getUserKeybindingsPath(): string {
    const baseDir = getDefaultUserDir();
    return path.join(baseDir, "keybindings.json");
}
