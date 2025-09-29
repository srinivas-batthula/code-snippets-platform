// src/commands/logout.ts
import * as vscode from 'vscode';
import { log } from '../utils/logger';

const config = vscode.workspace.getConfiguration("codesnippets");
const SECRET_KEY = config.get<string>('secretKey')!;


export function registerLogout(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand('codesnippets.logout', async () => {
        await context.secrets.delete(SECRET_KEY);   // Delete `API-KEY` of the user...
        await context.globalState.update('username', undefined);    // Also delete 'username' from state...
        log('Logged Out Successfully!', 'info');
    });

    context.subscriptions.push(command);
}
