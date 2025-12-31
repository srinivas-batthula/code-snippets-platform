// src/extension.ts
import * as vscode from 'vscode';
import { registerIntro } from './commands/intro';
import { registerLogin } from './commands/login';
import { registerLogout } from './commands/logout';
import { registerExportSnippet } from './commands/exportSnippet';
import { registerImportSnippet } from './commands/importSnippet';
import { registerExportSnapshot } from './commands/exportSnapshot';
import { registerImportSnapshot } from './commands/importSnapshot';
import { registerOpenSnapshotFiles } from './commands/openSnapshotFiles';
import { registerSearch } from './commands/search';
import uriHandler from './utils/handle_Uris';
import { ensureAuth } from './utils/auth';

// Central place to register all commands...
// This `extension.ts` is called to activate / deactivate the extension...
export function activate(context: vscode.ExtensionContext) {
    // To verify that If the User is Logged-In Or Not...
    ensureAuth(context);

    // Intro Starter WebView Panel
    registerIntro(context);

    // Auth cmds
    registerLogin(context);
    registerLogout(context);

    // Snippets cmds
    registerExportSnippet(context);
    registerImportSnippet(context);

    // Snapshots cmds
    registerExportSnapshot(context);
    registerImportSnapshot(context);
    registerOpenSnapshotFiles(context);

    // Search cmd
    registerSearch(context);

    // To handle redirect URI's from external sites...
    uriHandler();
};

export function deactivate() { };
