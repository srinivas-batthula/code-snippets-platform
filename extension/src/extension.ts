// src/extension.ts
import * as vscode from 'vscode';
import { registerHelloWorld } from './commands/helloWorld';
import * as dotenv from 'dotenv';
dotenv.config();


// Central place to register all commands...
// This `extension.ts` is called to activate / deactivate the extension...
export function activate(context: vscode.ExtensionContext) {
    registerHelloWorld(context);
};

export function deactivate() { };
