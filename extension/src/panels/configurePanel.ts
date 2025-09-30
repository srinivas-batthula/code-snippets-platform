// src/panels/configurePanel.ts
import * as vscode from 'vscode';

const config = vscode.workspace.getConfiguration("codesnippets");
const API_BASE = config.get<string>('apiBaseUrl')!;

export function getConfigurePanelHtml(): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #1e1e1e;
                    color: #d4d4d4;
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                h2 {
                    margin-bottom: 1rem;
                }

                input[type="text"] {
                    width: 300px;
                    padding: 10px;
                    font-size: 14px;
                    border-radius: 4px;
                    border: 1px solid #555;
                    background-color: #2d2d2d;
                    color: #d4d4d4;
                    margin-bottom: 1rem;
                }

                .btn {
                    padding: 10px 20px;
                    margin: 5px;
                    font-size: 14px;
                    cursor: pointer;
                    border: none;
                    border-radius: 4px;
                    transition: background-color 0.2s ease;
                }

                .btn-primary {
                    background-color: #0e639c;
                    color: white;
                }

                .btn-primary:hover {
                    background-color: #1177bb;
                }

                .btn-secondary {
                    background-color: #333;
                    color: #ccc;
                }

                .btn-secondary:hover {
                    background-color: #444;
                }

                .message {
                    margin-top: 1rem;
                    font-size: 13px;
                }

                .error {
                    color: #f14c4c;
                }

                .success {
                    color: #4caf50;
                }
            </style>
        </head>
        <body>
            <h2>🔑 Configure Your API Key</h2>
            <input id="key" type="text" placeholder="Paste your API key here..." />
            <div>
                <button class="btn btn-primary" onclick="sendKey()">Configure</button>
                <button style="text-decoration: underline;" class="btn btn-secondary" onclick="openSite()">Click here to generate API-Key!</button>
            </div>
            <div id="message" class="message"></div>

            <script>
                const vscode = acquireVsCodeApi();

                function sendKey() {
                    const keyInput = document.getElementById("key");
                    const messageEl = document.getElementById("message");
                    const key = keyInput.value.trim();

                    if (!key) {
                        messageEl.textContent = "Please enter a valid API key.";
                        messageEl.className = "message error";
                        return;
                    }

                    vscode.postMessage({ type: "verify-key", value: key });
                    messageEl.textContent = "Verifying key...";
                    messageEl.className = "message";
                }

                function openSite() {
                    vscode.postMessage({ type: "open-site", value: "${API_BASE}/dashboard" });
                }

                // Handle postMessage back from extension to show result...
                window.addEventListener("message", event => {
                    const messageEl = document.getElementById("message");
                    const { type, success } = event.data;
                    
                    if (type === "verify-key") {
                        if (success) {
                            messageEl.textContent = "✅ API key Saved successfully!";
                            messageEl.className = "message success";
                        } else {
                            messageEl.textContent = "❌ Invalid API key, Please provide a valid key!";
                            messageEl.className = "message error";
                        }
                    }
                });
            </script>
        </body>
        </html>
    `;
}
