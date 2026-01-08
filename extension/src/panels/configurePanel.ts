// src/panels/configurePanel.ts
import * as vscode from "vscode";

const config = vscode.workspace.getConfiguration("codesnippets");
const API_BASE = config.get<string>("apiBaseUrl")!;

export function getConfigurePanelHtml(): string {
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: "Inter", "Segoe UI", Tahoma, sans-serif;
      background-color: #0d0d0d;
      color: #e0e0e0;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    .container {
      background: #181818;
      padding: 2.5rem 3rem;
      border-radius: 14px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
      text-align: center;
      width: 380px;
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    h2 {
      font-size: 1.6rem;
      color: #fff;
      margin: 0;
      padding: 0;
    }

    p {
      font-size: 1rem;
      color: #aaa;
      padding: 0;
      margin-bottom: 2rem;
    }

    /* Progress Bar */
    .progress {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }

    .progress::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 3px;
      background: #333;
      transform: translateY(-50%);
      z-index: 1;
    }

    .progress-bar {
      position: absolute;
      top: 50%;
      left: 0;
      height: 5px;
      background: #007acc;
      z-index: 2;
      transform: translateY(-50%);
      width: 0;
      transition: width 0.4s ease;
    }

    .progress-step {
      background: #222;
      border: 2px solid #333;
      border-radius: 50%;
      width: 11px;
      height: 11px;
      z-index: 3;
      transition: all 0.3s ease;
    }

    .progress-step.active {
      background: #007acc;
      border-color: #007acc;
      transform: scale(1.1);
    }

    .step-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #aaa;
      margin-top: 0.2rem;
    }

    input[type="text"] {
      width: 100%;
      padding: 14px;
      border-radius: 8px;
      border: none;
      background: #262626;
      color: #e0e0e0;
      margin-top: 0.2rem;
      margin-bottom: 1.2rem;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    input[type="text"]:focus {
      outline: 2px solid #007acc;
      background-color: #202020;
    }

    button {
      width: 100%;
      padding: 12px;
      border-radius: 8px;
      border: none;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: #007acc;
      color: #fff;
      margin-bottom: 0.8rem;
    }

    .btn-primary:hover {
      background-color: #1091e6;
      transform: scale(1.01);
    }

    .btn-link {
      background: none;
      color: #ccc;
      font-size: 1.05rem;
    }

    .btn-link:hover {
      color: white;
      text-decoration: underline;
    }

    .message {
      margin-top: 1rem;
      font-size: 1.1rem;
      min-height: 16px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .message.show {
      opacity: 1;
    }

    .error {
      color: #ff4d4f;
    }

    .success {
      color: #4caf50;
    }

    @media (max-width: 450px) {
      .container {
        width: 90%;
        padding: 2rem 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Connect to <span style="color: #4ea1ff;">~SnipZen</span></h2>
    <p>Link your account to use SnipZen's features</p>

    <div class="progress">
      <div class="progress-bar" id="progress-bar"></div>
      <div class="progress-step active"></div>
      <div class="progress-step"></div>
      <div class="progress-step"></div>
    </div>

    <div class="step-labels">
      <span>Get Key</span>
      <span>Connect</span>
      <span>Complete</span>
    </div>

    <div id="step-content">
      <label style="display:block; text-align:left; font-size:1.1rem; margin-top:2.2rem; color: #fff; font-weight: 550;">API Key</label>
      <input id="key" type="text" placeholder="Paste your API key" />

      <button class="btn-primary" onclick="sendKey()">Connect Account</button>
      <button class="btn-link" onclick="openSite()">Get your <span style="text-decoration: underline;">API-Key</span> from here</button>
    </div>

    <div id="message" class="message"></div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const steps = document.querySelectorAll(".progress-step");
    const progressBar = document.getElementById("progress-bar");
    const messageEl = document.getElementById("message");
    let currentStep = 1;

    function updateProgress(step) {
      steps.forEach((circle, index) => {
        circle.classList.toggle("active", index < step);
      });
      const progressPercent = ((step - 1) / (steps.length - 1)) * 100;
      progressBar.style.width = progressPercent + "%";
    }

    function sendKey() {
      const keyInput = document.getElementById("key");
      const key = keyInput.value.trim();

      if (!key) {
        showMessage("Please enter a valid API key.", "error");
        return;
      }

      showMessage("Verifying key...", "");
      currentStep = 2;
      updateProgress(currentStep);

      vscode.postMessage({ type: "verify-key", value: key });
    }

    function openSite() {
      vscode.postMessage({ type: "open-site", value: "${API_BASE}/dashboard" });
    }

    function showMessage(text, type) {
      messageEl.textContent = text;
      messageEl.className = "message show " + (type || "");
    }
    // Handle postMessage back from extension to show result...
    window.addEventListener("message", (event) => {
      const { type, success } = event.data;

      if (type === "verify-key") {
        if (success) {
          currentStep = 3;
          updateProgress(currentStep);
          showMessage("API key saved successfully!", "success");

          setTimeout(() => {
            showMessage("🎉 Setup Complete!", "success");
          }, 1000);
        } else {
          currentStep = 1;
          updateProgress(currentStep);
          showMessage("Invalid API key, please try again.", "error");
        }
      }
    });

    // Initialize default state
    updateProgress(currentStep);
  </script>
</body>
</html>
    `;
}
