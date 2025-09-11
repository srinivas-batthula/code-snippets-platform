// src/utils/handle_Uris.ts
import * as vscode from 'vscode';
import { log } from './logger';

// External URI's handler...
export default function uriHandler() {
    vscode.window.registerUriHandler({
        handleUri(uri: vscode.Uri) {
            const path = uri.path || null; // e.g., "/redirect"
            const queryParams = new URLSearchParams(uri.query);

            if (path === '/redirect') {     // handle redirect after OAuth...
                const state = queryParams.get('state') || null;
                log(`Redirected-OAuth with state: ${state}`, 'info');
            }
            else {
                log('Unknown URI route received!', 'warn');
            }
        }
    });
}
