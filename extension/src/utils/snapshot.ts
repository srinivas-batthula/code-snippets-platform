// extension/src/utils/snapshot.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import { exec } from 'child_process';
import { log } from './logger';
import { getDevHostExtensionsDir } from './vscodePaths';

const config = vscode.workspace.getConfiguration("codesnippets");
const API_BASE = config.get<string>('apiBaseUrl')!;

// @helper Export-Snapshot...
export async function uploadSnapshot({ settings, keybindings, extensions, title, token }: {
    settings: string;
    keybindings: string;
    extensions: string[];
    title: string;
    token: string;
}): Promise<{ ok: boolean, message: string, id?: string, url?: string }> {
    try {
        const fetch = (await import('node-fetch')).default; // dynamic import for node-fetch to support ESM/CJS interop

        const resp = await fetch(`${API_BASE}/api/snapshots/export`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                title,
                settings,
                keybindings,
                extensions,
            }),
        });

        const res = await resp.json() as { ok: boolean, message: string, id?: string, url?: string };
        return res;
    } catch (err) {
        return { ok: false, message: (err as any).message || 'Failed to Upload Snapshot!' };
    }
}

// @helper Fetch-Snapshot...
export async function fetchSnapshotById(id: string): Promise<{ ok: boolean, message?: string, snapshot?: Record<string, string> }> {
    try {
        const fetch = (await import('node-fetch')).default;

        const resp = await fetch(`${API_BASE}/api/snapshots/import/${id}`);

        const res = await resp.json() as { ok: boolean, message?: string, snapshot?: Record<string, any> };
        return res;
    }
    catch (err) {
        return { ok: false, message: (err as any).message || 'Failed to Import Snapshot!' };
    }
}

// @helper for Installing-Extensions & Merging Settings, Keybindings...
export async function installExtensions(requiredExtensions: string[]) {
    const extensionsDir = getDevHostExtensionsDir();
    if (extensionsDir) {
        log('Running in Dev-Host VSCode: Snapshot will detect Only extensions installed in Test-Env!', 'info');
    }

    // Get currently installed extensions
    const installed = vscode.extensions.all.map(ext => ext.id.toLowerCase());

    // Filter out already installed
    const toInstall = requiredExtensions.filter(ext => !installed.includes(ext.toLowerCase()));

    for (const ext of toInstall) {
        await new Promise((resolve, reject) => {
            const cmd = extensionsDir
                ? `code --extensions-dir "${extensionsDir}" --install-extension ${ext}`
                : `code --install-extension ${ext}`;

            exec(cmd, (err) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    return { newInstalls: toInstall, skipped: requiredExtensions.length - toInstall.length };
}

export async function mergeSettings(newSettings: Record<string, any>, settingsPath: string) {
    backupFile(settingsPath);

    let current: Record<string, any> = {};
    try {
        current = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } catch {
        current = {};
    }

    let updated = false, count = 0;
    for (const [key, value] of Object.entries(newSettings)) {
        if (!(key in current)) {   // Only add if not present
            current[key] = value;
            updated = true;
            count++;
        }
    }

    if (updated) {
        fs.writeFileSync(settingsPath, JSON.stringify(current, null, 4));
    }
    return { count };
}

export async function mergeKeybindings(newKeybindings: any[], keybindingsPath: string) {
    backupFile(keybindingsPath);

    let current: any[] = [], count = 0;
    try {
        current = JSON.parse(fs.readFileSync(keybindingsPath, 'utf-8'));
    } catch {
        current = [];
    }

    const existing = new Set(current.map(kb => JSON.stringify(kb)));

    const merged = [...current];
    for (const kb of newKeybindings) {
        const str = JSON.stringify(kb);
        if (!existing.has(str)) {
            merged.push(kb);
            count++;
        }
    }
    fs.writeFileSync(keybindingsPath, JSON.stringify(merged, null, 4));
    return { count };
}

function backupFile(filePath: string) {
    if (fs.existsSync(filePath)) {
        const backupPath = `${filePath}.bak`;
        fs.copyFileSync(filePath, backupPath);
        // console.log(`Backup created at: ${backupPath}`);
    }
}
