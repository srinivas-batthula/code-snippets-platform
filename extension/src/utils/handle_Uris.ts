// src/utils/handle_Uris.ts
import * as vscode from 'vscode';
import { log } from './logger';

// External URI's handler...
export default function uriHandler() {
    vscode.window.registerUriHandler({
        handleUri(uri: vscode.Uri) {
            const path = uri.path || null; // e.g., "/redirect"
            const queryParams = new URLSearchParams(uri.query);

            if (path === '/intro') {     // handle redirect from Website... (vscode://srinivas-batthula.codesnippets/intro) /...
                vscode.commands.executeCommand("codesnippets.intro"); // / `Fallback` -> (vscode:extension/srinivas-batthula.codesnippets)...
            }
            else {
                log('Unknown URI route received!', 'warn');
            }
        }
    });
}
