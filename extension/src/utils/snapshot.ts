// extension/src/utils/snapshot.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import { exec } from 'child_process';
import { log } from './logger';

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

// @helper for Installing-Extensions...
// export async function installExtensions(requiredExtensions: string[]) {
//     // Dev-Host guard (Skip installs in Dev-Env)...
//     if (vscode.env.appHost === 'extensionDevelopmentHost') {
//         log(
//             'Skipping extension installation in Extension Dev Host (F5). ' +
//             'This will work correctly in real VS Code.',
//             'warn'
//         );
//         return { newInstalls: [], skipped: requiredExtensions.length };
//     }

//     // Get currently installed extensions
//     const installed = vscode.extensions.all.map(ext => ext.id.toLowerCase());

//     // Filter out already installed
//     const toInstall = requiredExtensions.filter(ext => !installed.includes(ext.toLowerCase()));

//     const newlyInstalled: string[] = [];

//     try {
//         for (const ext of toInstall) {
//             // Use VSCode internal API...
//             await vscode.commands.executeCommand(
//                 'workbench.extensions.installExtension',
//                 ext
//             );

//             newlyInstalled.push(ext); // track successful installs
//         }

//         return {
//             newInstalls: newlyInstalled,
//             skipped: requiredExtensions.length - newlyInstalled.length
//         };
//     }
//     catch (err: any) {
//         log(
//             `Extension install failed. Rolling back ${newlyInstalled.length} extension(s)...`,
//             'error'
//         );

//         // Rollback is tricky via API → best effort uninstall
//         for (const ext of newlyInstalled.reverse()) {
//             try {
//                 await vscode.commands.executeCommand(
//                     'workbench.extensions.uninstallExtension',
//                     ext
//                 );
//             } catch {
//                 log(`Rollback failed for extension: ${ext}`, 'warn');
//             }
//         }

//         throw new Error(
//             `Snapshot import Failed during extension installation,
// Rollback attempted.`
//         );
//     }
// }


// @helper for Installing-Extensions (Parallel + Controlled-Concurrency)...
export async function installExtensions(requiredExtensions: string[]) {
    // Dev-Host guard (Skip installs in Dev-Env)...
    if (vscode.env.appHost === 'extensionDevelopmentHost') {
        log(
            'Skipping extension installation in Extension Dev Host (F5). ' +
            'This will work correctly in real VS Code.',
            'warn'
        );
        return { newInstalls: [], skipped: requiredExtensions.length };
    }

    // Get currently installed extensions
    const installed = vscode.extensions.all.map(ext => ext.id.toLowerCase());

    // Filter out already installed
    const toInstall = requiredExtensions.filter(ext => !installed.includes(ext.toLowerCase()));

    const newlyInstalled: string[] = [];

    // Concurrency limit (avoid overwhelming VSCode / network)
    const CONCURRENCY_LIMIT = 3;

    // @helper: process installs in batches (parallel inside each batch)...
    async function installBatch(batch: string[]) {

        // Run installs in parallel within batch
        const results = await Promise.allSettled(
            batch.map(async (ext) => {
                try {
                    // Use VSCode internal API
                    await vscode.commands.executeCommand(
                        'workbench.extensions.installExtension',
                        ext
                    );

                    return { ext, success: true };
                } catch (err) {
                    return { ext, success: false, err };
                }
            })
        );

        // Process results
        for (const res of results) {
            if (res.status === 'fulfilled' && res.value.success) {
                newlyInstalled.push(res.value.ext);
            } else {
                const failedExt = res.status === 'fulfilled'
                    ? res.value.ext
                    : 'unknown';

                throw new Error(`Failed to install extension: ${failedExt}`);
            }
        }
    }

    try {
        // Split extensions into batches...
        for (let i = 0; i < toInstall.length; i += CONCURRENCY_LIMIT) {
            const batch = toInstall.slice(i, i + CONCURRENCY_LIMIT);

            // Install Extensions batch-wise in parallel
            await installBatch(batch);
        }

        return {
            newInstalls: newlyInstalled,
            skipped: requiredExtensions.length - newlyInstalled.length
        };
    }
    catch (err: any) {
        log(
            `Extension install failed. Rolling back ${newlyInstalled.length} extension(s)...`,
            'error'
        );

        // Rollback (best effort uninstall in reverse order)
        for (const ext of newlyInstalled.reverse()) {
            try {
                await vscode.commands.executeCommand(
                    'workbench.extensions.uninstallExtension',
                    ext
                );
            } catch {
                log(`Rollback failed for extension: ${ext}`, 'warn');
            }
        }

        throw new Error(
            `Snapshot import Failed during extension installation,
Rollback attempted.`
        );
    }
}

export async function mergeSettings(newSettings: Record<string, any>, settingsPath: string) {
    try {
        backupFile(settingsPath);
    } catch (err) {
        console.warn("[SnipZen] Backup failed:", err);
    }

    const config = vscode.workspace.getConfiguration();

    let successCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const [key, value] of Object.entries(newSettings)) {
        try {
            // Validate key
            if (!key || typeof key !== "string") {
                console.warn(`[SnipZen] Invalid key skipped: ${key}`);
                skippedCount++;
                continue;
            }

            // Check if 'setting' is registered
            const inspected = config.inspect(key);
            if (!inspected) {
                console.warn(
                    `[SnipZen] Unregistered setting skipped: ${key}`
                );
                skippedCount++;
                continue;
            }

            // Only add if truly undefined (important fix)
            const existing = config.get(key);
            if (existing !== undefined) {
                skippedCount++;
                continue;
            }

            await config.update(
                key,
                value,
                vscode.ConfigurationTarget.Global
            );
            successCount++;
        } catch (err: any) {
            failedCount++;

            console.error(
                `[SnipZen] Failed to apply setting: ${key}`,
                err
            );
            // Continue loop no matter what
            continue;
        }
    }

    return {
        count: successCount,
        skippedCount,
        failedCount,
    };
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
