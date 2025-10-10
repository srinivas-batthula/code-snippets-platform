import * as vscode from 'vscode';
import { getIntroPanelHtml } from '../panels/introPanel';
import { log } from '../utils/logger';

const config = vscode.workspace.getConfiguration("codesnippets");
const API_BASE = config.get<string>('apiBaseUrl')!;

export function registerIntro(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand(
        'codesnippets.intro',
        () => {
            // Fetch username from global storage
            const storedUsername = context.globalState.get<string>('username');
            const username = storedUsername || 'User';

            const panel = vscode.window.createWebviewPanel(
                'intro',
                'Intro Starter',
                vscode.ViewColumn.One,
                { enableScripts: true }
            );

            panel.webview.html = getIntroPanelHtml(username);
            // log(`Opened Intro Panel for ${username}`, 'info');

            // Handle button clicks inside webview...
            panel.webview.onDidReceiveMessage(
                message => {
                    if (message.type === 'cmd') {
                        const cmd = `codesnippets.${message.command}`;
                        vscode.commands.executeCommand(cmd);
                        if (message.command === 'logout') {
                            setTimeout(() => {
                                vscode.commands.executeCommand("codesnippets.intro");
                                panel.dispose();
                            }, 2000);
                        }
                    }
                    else if (message.type === 'url') {
                        vscode.env.openExternal(vscode.Uri.parse(message.url || API_BASE));
                    }
                },
                undefined,
                context.subscriptions
            );
        }
    );

    context.subscriptions.push(command);
}
