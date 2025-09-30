// extension/src/utils/auth.ts
import * as vscode from 'vscode';
import { log } from './logger';
import { getConfigurePanelHtml } from '../panels/configurePanel';

const config = vscode.workspace.getConfiguration("codesnippets");
const API_BASE = config.get<string>('apiBaseUrl')!;
const SECRET_KEY = config.get<string>('secretKey')!; // key to store backend JWT in VSCode SecretStorage


// ensureAuth(context): obtains Token and stores in context.secrets (SecretStorage)
export async function ensureAuth(context: vscode.ExtensionContext): Promise<string | undefined> {
    // 1. check SecretStorage for existing Token......
    const stored = await context.secrets.get(SECRET_KEY);
    if (stored) { // already authenticated, return the token...
        // log(`You're already Logged-In (Token length: ${stored?.length || 0})`, 'info');
        return stored;
    }

    // 2. Or Else,, If no token found, then Open `Configure-Webview-Panel`...
    return new Promise((resolve) => {
        const panel = vscode.window.createWebviewPanel(
            'login',
            'Configure API-Key',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getConfigurePanelHtml();

        // Handle button clicks inside webview-panel...
        panel.webview.onDidReceiveMessage(
            async (message: { type: string, value: string }) => {
                if (message.type === 'verify-key') {
                    const result = await verifyToken(message.value, context);
                    if (result) {     // If `result === true`, then return 'token'...
                        panel.webview.postMessage({ type: 'verify-key', success: true });
                        resolve(message.value);
                        setTimeout(() => {
                            vscode.commands.executeCommand("codesnippets.intro");
                            panel.dispose();
                        }, 2000);
                    } else {
                        panel.webview.postMessage({ type: 'verify-key', success: false });
                        resolve(undefined);
                    }
                }
                else if (message.type === 'open-site') {
                    vscode.env.openExternal(vscode.Uri.parse(message.value || API_BASE));
                }
            },
            undefined,
            context.subscriptions
        );
    });
}

export async function verifyToken(token: string, context: vscode.ExtensionContext) {
    const fetch = (await import('node-fetch')).default; // dynamic import for node-fetch to support ESM/CJS interop

    if (!token || token.trim().length === 0) {
        log("Please enter Valid Token to Verify!", "warn");
        return false;
    }

    try {
        const res = await fetch(`${API_BASE}/api/auth/verify-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
        });
        const data = await res.json() as { ok: boolean, message: string, username?: string, token?: string };
        if (!res.ok || !data.ok) throw new Error('Auth-Token validation failed!');

        await context.secrets.store(SECRET_KEY, token);  // store Token securely in SecretStorage and return it
        await context.globalState.update('username', data.username);
        log(`Login Successful, Welcome ${data.username}!`, "info");
        return true;
    } catch (err: any) {
        log(`Login Failed -> ${err instanceof Error ? err.message : String(err)}`, "error");
        return false;
    }
}
