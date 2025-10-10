// extension/src/commands/login.ts
import * as vscode from 'vscode';
import { ensureAuth } from '../utils/auth';
import { log } from '../utils/logger';

export function registerLogin(context: vscode.ExtensionContext) {
    const cmd = vscode.commands.registerCommand('codesnippets.login', async () => {
        const token = await ensureAuth(context);
        // log(token ? `Token-Found of length: ${String(token.length)}` : 'No Token found!', 'info')
    });
    context.subscriptions.push(cmd);
}
