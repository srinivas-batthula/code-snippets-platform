// extension/src/utils/auth.ts
import * as vscode from 'vscode';
import { log } from './logger';

const config = vscode.workspace.getConfiguration("codesnippets");
const API_BASE = config.get<string>('apiBaseUrl')!;
const SECRET_KEY = config.get<string>('secretKey')!; // key to store backend JWT in VSCode SecretStorage


// ensureAuth(context): obtains JWT and stores in context.secrets (SecretStorage)
export async function ensureAuth(context: vscode.ExtensionContext) {
    try {
        const fetch = (await import('node-fetch')).default; // dynamic import for node-fetch to support ESM/CJS interop

        // 1. check SecretStorage for existing JWT......
        const stored = await context.secrets.get(SECRET_KEY);
        if (stored) { // already authenticated
            // log(`You're already Logged-In (JWT length: ${stored?.length || 0})`, 'info');
            return stored;
        }

        // 2. call web API `/auth/start` to get authUrl + state...
        const startRes = await fetch(`${API_BASE}/api/auth/start`);
        if (!startRes.ok) throw new Error('auth start failed!');
        const { authUrl, state } = await startRes.json() as { authUrl: string; state: string };

        // 3. open external browser for user to complete GitHub login
        vscode.env.openExternal(vscode.Uri.parse(authUrl));
        log('Complete GitHub sign-in in the opened browser!', "info");

        // 4. poll `/auth/status` until token is available or timeout
        const maxRetries = 60; // poll ~2 minutes...
        for (let i = 0; i < maxRetries; i++) {
            await new Promise((r) => setTimeout(r, 2000)); // delay 2-secs between polls
            try {
                const st = await fetch(`${API_BASE}/api/auth/status?state=${state}`);
                if (!st.ok) continue;

                const sj = await st.json() as { ok: boolean, token?: string, username?: string, message: string };
                if (sj.ok && sj.token) {
                    await context.secrets.store(SECRET_KEY, sj.token);  // store JWT securely in SecretStorage and return it
                    await context.globalState.update('username', sj.username);
                    log('Login successful (JWT length: ' + (sj.token?.length || 0) + ')', "info");
                    return sj.token;
                }
            } catch (e) {
                // ignore and retry
            }
        }
        // if reached here => timeout
        throw new Error('Authentication timed out!');
    }
    catch (err) {
        log(`Login Failed -> ${err instanceof Error ? err.message : String(err)}`, "error");
        return "";
    }
}
