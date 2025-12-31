// src/panels/introPanel.ts
import * as vscode from 'vscode';

const config = vscode.workspace.getConfiguration("codesnippets");
const API_BASE = config.get<string>('apiBaseUrl')!;

export function getIntroPanelHtml(username: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Intro Panel</title>
    <style>
      :root {
        --bg: #1e1e1e;
        --card-bg: #252526;
        --text: #f3f3f3;
        --accent: #4ea1ff;
        --accent-hover: #69b6ff;
        --border: #3a3a3a;
      }
      body {
        font-family: 'Segoe UI', Tahoma, sans-serif;
        background: var(--bg);
        color: var(--text);
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 12px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        padding: 2rem 3rem;
        text-align: center;
        max-width: 600px;
        width: 90%;
        animation: fadeIn 0.6s ease-in-out;
      }
      h1 {
        color: var(--accent);
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      p {
        font-size: 1.1rem;
        color: #ccc;
        margin-bottom: 1.5rem;
      }
      button {
        background: var(--accent);
        border: none;
        color: var(--bg);
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s ease;
        margin: 5px;
      }
      button:hover {
        background: var(--accent-hover);
      }
      .cmd-list {
        margin-top: 1rem;
      }
      .footer-text {
        margin-top: 2rem;
        color: #888;
        font-size: 0.9rem;
        animation: fadeIn 0.8s ease-in-out 0.2s forwards;
        opacity: 0;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .dropdown {
        position: relative;
        display: inline-block;
      }
      .dropdown-content {
        display: none;
        position: absolute;
        background-color: var(--card-bg);
        border: 1px solid var(--border);
        min-width: 250px;
        text-align: left;
        padding: 10px;
        border-radius: 8px;
        z-index: 1;
        font-size: 0.9rem;
        color: #ccc;
      }
      .dropdown-content strong {
        color: var(--accent);
      }
      .dropdown.show .dropdown-content {
        display: block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Hello, ${username}!</h1>
      <p>Welcome to <strong onclick="sendUrl('${API_BASE}')" style="text-decoration: underline; cursor: pointer;">CodeSnippets</strong>.</p>

      <div class="cmd-list">
        <h2>Quick Commands</h2>
        
        <!-- Auth -->
        <button onclick="sendCommand('login')">Login</button>
        <button onclick="sendCommand('logout')">Logout</button>
        <br/><br/>

        <!-- Search Snippets & Snapshots -->
        <button onclick="sendCommand('search')">Search Snippets / Snapshots</button>
        <br/><br/>

        <!-- Snapshots -->
        <button onclick="sendCommand('importSnapshot')">Import Snapshot</button>
        <button onclick="sendCommand('exportSnapshot')">Export Snapshot</button>
        <button onclick="sendCommand('openSnapshotFiles')">Open Snapshot Files</button>
        <br/><br/>

        <!-- Snippets -->
        <div class="dropdown" id="exportDropdown">
          <button onclick="toggleDropdown('exportDropdown')">Export Snippet</button>
          <div class="dropdown-content">
            <strong>To Export a Snippet:</strong><br/>
            1. Select code in editor<br/>
            2. Right click → <em>'Export Selected Code as Snippet : CodeSnippets'</em><br/>
            3. Snippet is uploaded to the cloud!
          </div>
        </div>

        <button onclick="sendCommand('importSnippet')">Import Snippet</button>
        <br/><br/>

      </div>

      <p class="footer-text">~ Support Team <strong style="color: #4ea1ff;">-CodeSnippets</strong></p>
    </div>

    <script>
      const vscode = acquireVsCodeApi();

      function sendCommand(command) {
        vscode.postMessage({ command, type: "cmd" });
      }

      function sendUrl(url) {
        vscode.postMessage({ url, type: "url" });
      }

      function toggleDropdown(id) {
        const dropdowns = document.querySelectorAll(".dropdown");
        dropdowns.forEach(d => {
          if (d.id === id) {
            d.classList.toggle("show");
          } else {
            d.classList.remove("show");
          }
        });
      }

      // Auto-close if clicked outside
      window.addEventListener("click", function(e) {
        if (!e.target.closest(".dropdown")) {
          document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("show"));
        }
      });
    </script>
  </body>
  </html>
  `;
}
