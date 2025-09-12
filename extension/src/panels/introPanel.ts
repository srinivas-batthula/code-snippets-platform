// src/panels/introPanel.ts

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
        max-width: 500px;
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
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Hello, ${username}!</h1>
      <p>Welcome to <strong>CodeSnippets</strong>.</p>

      <div class="cmd-list">
        <h3>Quick Commands</h3>
        
        <button onclick="sendCommand('login')">Login</button>
        <button onclick="sendCommand('logout')">Logout</button>
      </div>

      <p class="footer-text">~ Team CodeSnippets</p>
    </div>

    <script>
      const vscode = acquireVsCodeApi();

      function sendCommand(command) {
        vscode.postMessage({ command, type: "cmd" });
      }
    </script>
  </body>
  </html>
  `;
}
