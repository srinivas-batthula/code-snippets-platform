// src/extension.ts
import * as vscode from 'vscode';
import { registerIntro } from './commands/intro';
import { registerLogin } from './commands/login';
import { registerLogout } from './commands/logout';
import uriHandler from './utils/handle_Uris';
import * as dotenv from 'dotenv';
dotenv.config();


// Central place to register all commands...
// This `extension.ts` is called to activate / deactivate the extension...
export function activate(context: vscode.ExtensionContext) {
    registerIntro(context);
    registerLogin(context);
    registerLogout(context);

    uriHandler();   // To handle redirect URI's from external sites...
};

export function deactivate() { };
