// src/commands/helloWorld.ts
import * as vscode from 'vscode';
import { getHelloPanelHtml } from '../panels/helloPanel';
import { log } from '../utils/logger';

export function registerHelloWorld(context: vscode.ExtensionContext) {
    const command = vscode.commands.registerCommand(
        'codesnippets.helloWorld',
        () => {
            const panel = vscode.window.createWebviewPanel(
                'helloWorld',
                'Hello Panel',
                vscode.ViewColumn.One,
                { enableScripts: true }
            );
            panel.webview.html = getHelloPanelHtml();
            log('Opened Hello Panel : CodeSnippets');

            panel.webview.onDidReceiveMessage(
                message => {
                    vscode.commands.executeCommand(`codesnippets.${message.command}`);
                },
                undefined,
                context.subscriptions
            );
        }
    );
    context.subscriptions.push(command);
}
