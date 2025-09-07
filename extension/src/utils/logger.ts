// src/utils/logger.ts
import * as vscode from 'vscode';

export function log(message: string) {
    vscode.window.showInformationMessage(`[-Log]: ${message}`);
}
