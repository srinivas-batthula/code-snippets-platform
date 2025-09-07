// src/panels/helloPanel.ts


export function getHelloPanelHtml(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Hello Panel</title>
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
            }
            button:hover {
                background: var(--accent-hover);
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>👋 Hello from VSCode Extension!</h1>
            <p>This is <strong>Srinivas Batthula</strong>, your extension developer.</p>
            <br></br>
        </div>
        
        <script>
        </script>
    </body>
    </html>
    `;
}
