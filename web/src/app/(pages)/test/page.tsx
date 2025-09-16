"use client";

import React, { useState, useEffect, useRef } from "react";
import PrismHighlighter from "@/components/PrismHighlighter";

const TestPage = () => {
  // const [mounted, setMounted] = useState(false);
  // const [prismReady, setPrismReady] = useState(false);

  // useEffect(() => {
  //   setMounted(true);

  //   // Initialize Prism.js properly
  //   const initPrism = async () => {
  //     if (typeof window !== "undefined") {
  //       try {
  //         // Load CSS if not already loaded
  //         if (!document.querySelector('link[href*="prism-tomorrow.css"]')) {
  //           const themeLink = document.createElement("link");
  //           themeLink.rel = "stylesheet";
  //           themeLink.href =
  //             "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.css";
  //           document.head.appendChild(themeLink);
  //         }

  //         if (!document.querySelector('link[href*="line-numbers.css"]')) {
  //           const lineNumbersLink = document.createElement("link");
  //           lineNumbersLink.rel = "stylesheet";
  //           lineNumbersLink.href =
  //             "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.css";
  //           document.head.appendChild(lineNumbersLink);
  //         }

  //         setPrismReady(true);
  //       } catch (error) {
  //         console.error("Failed to initialize Prism:", error);
  //         setPrismReady(true);
  //       }
  //     }
  //   };

  //   initPrism();
  // }, []);

  // if (!mounted || !prismReady) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       Loading...
  //     </div>
  //   );
  // } //TODO:  default theme

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Prism.js Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testing HTML rendering, copy functionality, and highlight
            persistence
          </p>
        </div>

        <div className="space-y-8">
          <AdvancedCodeExample />
          <SimpleHighlighterExample />
          <HtmlRenderingExample />
        </div>
      </div>
    </div>
  );
};

// Enhanced CodeBlock with proper re-highlighting
const AdvancedCodeExample = () => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const yourCode = `import React, { useState, useEffect } from 'react';

interface Props {
  message: string;
  isVisible?: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isVisible = true }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component mounted');
  }, []);

  const handleClick = () => {
    setCount(prev => prev + 1);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="component-container">
      <h2>{message}</h2>
      <p>Count: {count}</p>
      <button onClick={handleClick}>
        Increment
      </button>
    </div>
  );
};

export default MyComponent;`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yourCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Re-highlight after copy
      setTimeout(async () => {
        if (typeof window !== "undefined") {
          try {
            const Prism = (await import("prismjs")).default;
            if (codeRef.current) {
              Prism.highlightElement(codeRef.current);
            } else {
              Prism.highlightAll();
            }
          } catch (error) {
            console.error("Re-highlight failed:", error);
          }
        }
      }, 100);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    const highlight = async () => {
      if (typeof window !== "undefined") {
        try {
          const Prism = (await import("prismjs")).default;

          // Load TypeScript support
          if (!Prism.languages.typescript) {
            await import("prismjs/components/prism-typescript.js" as any);
          }

          // Load line numbers plugin
          try {
            await import(
              "prismjs/plugins/line-numbers/prism-line-numbers.js" as any
            );
          } catch (e) {
            console.warn("Line numbers plugin failed to load");
          }

          if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
          }
        } catch (error) {
          console.error("Highlighting failed:", error);
        }
      }
    };

    highlight();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b dark:bg-gray-700 dark:border-gray-600">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Advanced TypeScript Component
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            TypeScript
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <div
        className="relative"
        style={{ maxHeight: "500px", overflowY: "auto" }}
      >
        <pre className="language-typescript line-numbers">
          <code ref={codeRef} className="language-typescript">
            {/* {yourCode} */}
            {`import React, { useState, useEffect } from 'react';

interface Props {
  message: string;
  isVisible?: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isVisible = true }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component mounted');
  }, []);

  const handleClick = () => {
    setCount(prev => prev + 1);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="component-container">
      <h2>{message}</h2>
      <p>Count: {count}</p>
      <button onClick={handleClick}>
        Increment
      </button>
    </div>
  );
};

export default MyComponent;`}
          </code>
        </pre>
      </div>
    </div>
  );
};

// Simple highlighter example
const SimpleHighlighterExample = () => {
  const simpleCode = `// Simple JavaScript function
function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);`;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Simple Highlighter (No Copy Button)
      </h2>
      <PrismHighlighter
        code={simpleCode}
        language="javascript"
        showLineNumbers={true}
      />
    </div>
  );
};

// HTML rendering example
const HtmlRenderingExample = () => {
  const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .highlight {
            background: yellow;
            padding: 2px 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to HTML Highlighting</h1>
        <p>This demonstrates <span class="highlight">proper HTML rendering</span> with Prism.js</p>
        
        <form id="contact-form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            
            <button type="submit">Submit</button>
        </form>
        
        <script>
            document.getElementById('contact-form').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Form submitted!');
            });
        </script>
    </div>
</body>
</html>`;

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        HTML Code Rendering Test
      </h2>
      <AdvancedCodeBlock
        code={htmlCode}
        language="html"
        title="Complete HTML Document"
        showLineNumbers={true}
        maxHeight="600px"
      />
    </div>
  );
};

// Enhanced CodeBlock component that maintains highlighting
const AdvancedCodeBlock: React.FC<{
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}> = ({
  code,
  language,
  title,
  showLineNumbers = true,
  maxHeight = "400px",
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Re-highlight after copy with proper delay
      setTimeout(async () => {
        if (typeof window !== "undefined") {
          try {
            const Prism = (await import("prismjs")).default;

            // Ensure HTML/markup language is loaded
            if (language === "html" && !Prism.languages.html) {
              await import("prismjs/components/prism-markup.js" as any);
            }

            if (codeRef.current) {
              // Re-highlight this specific element
              Prism.highlightElement(codeRef.current);
            }
          } catch (error) {
            console.error("Re-highlight failed:", error);
          }
        }
      }, 150);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    const highlight = async () => {
      if (typeof window !== "undefined") {
        try {
          const Prism = (await import("prismjs")).default;

          // Load language if needed
          if (language === "html" && !Prism.languages.html) {
            await import("prismjs/components/prism-markup.js" as any);
          }

          // Load line numbers plugin
          if (showLineNumbers) {
            try {
              await import(
                "prismjs/plugins/line-numbers/prism-line-numbers.js" as any
              );
            } catch (e) {
              console.warn("Line numbers plugin failed to load");
            }
          }

          if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
          }
        } catch (error) {
          console.error("Highlighting failed:", error);
        }
      }
    };

    highlight();
  }, [language, showLineNumbers]);

  const lineNumberClass = showLineNumbers ? "line-numbers" : "";
  const combinedClassName = `language-${language} ${lineNumberClass}`.trim();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {language}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <div className="relative" style={{ maxHeight, overflowY: "auto" }}>
        <pre className={combinedClassName}>
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default TestPage;
