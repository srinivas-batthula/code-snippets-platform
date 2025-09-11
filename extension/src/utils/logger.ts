// src/utils/logger.ts
import * as vscode from 'vscode';

const config = vscode.workspace.getConfiguration("codesnippets");
const EXTENSION_NAME = config.get<string>("extensionName")!;

export function log(message: string, type: "info" | "warn" | "error" = "info") {
    if (type === "warn")
        vscode.window.showWarningMessage(`[-${EXTENSION_NAME}]: ${message}`);
    else if (type === "error")
        vscode.window.showErrorMessage(`[-${EXTENSION_NAME}]: ${message}`);
    else
        vscode.window.showInformationMessage(`[-${EXTENSION_NAME}]: ${message}`);

}
