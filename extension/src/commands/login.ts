// extension/src/commands/login.ts
import * as vscode from 'vscode';
import { ensureAuth } from '../utils/auth';


export function registerLogin(context: vscode.ExtensionContext) {
    const cmd = vscode.commands.registerCommand('codesnippets.login', async () => {
        const token = await ensureAuth(context);
    });
    context.subscriptions.push(cmd);
}
