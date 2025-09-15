// src/extension.ts
import * as vscode from 'vscode';
import { registerIntro } from './commands/intro';
import { registerLogin } from './commands/login';
import { registerLogout } from './commands/logout';
import { registerExportSnippet } from './commands/exportSnippet';
import { registerImportSnippet } from './commands/importSnippet';
import uriHandler from './utils/handle_Uris';
import * as dotenv from 'dotenv';
dotenv.config();


// Central place to register all commands...
// This `extension.ts` is called to activate / deactivate the extension...
export function activate(context: vscode.ExtensionContext) {
    // Intro Starter WebView Panel
    registerIntro(context);

    // Login & Logout cmds
    registerLogin(context);
    registerLogout(context);

    // Snippets cmds
    registerExportSnippet(context);
    registerImportSnippet(context);

    uriHandler();   // To handle redirect URI's from external sites...
};

export function deactivate() { };
