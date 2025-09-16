export const jsxCodeSample = 
`
"use client"

import PrismHighlighter from "@/components/PrismHighlighter";
import { useEffect, useState } from "react";

const SimpleHighlighterExample = () => {
  const simpleCode = \`

  
  // Simple JavaScript function
function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);


\`;

 const [mounted, setMounted] = useState(false);
  const [prismReady, setPrismReady] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Initialize Prism.js properly
    const initPrism = async () => {
      if (typeof window !== "undefined") {
        try {
          // Load CSS if not already loaded
          if (!document.querySelector('link[href*="prism-tomorrow.css"]')) {
            const themeLink = document.createElement("link");
            themeLink.rel = "stylesheet";
            themeLink.href =
              "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.css";
            document.head.appendChild(themeLink);
          }

          if (!document.querySelector('link[href*="line-numbers.css"]')) {
            const lineNumbersLink = document.createElement("link");
            lineNumbersLink.rel = "stylesheet";
            lineNumbersLink.href =
              "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.css";
            document.head.appendChild(lineNumbersLink);
          }

          setPrismReady(true);
        } catch (error) {
          console.error("Failed to initialize Prism:", error);
          setPrismReady(true);
        }
      }
    };

    initPrism();
  }, []);

  if (!mounted || !prismReady) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Simple Highlighter (No Copy Button)
      </h2>
      <PrismHighlighter
        code={simpleCode}
        language="jsx"
        showLineNumbers={true}
      />
    </div>
    \`hello coders \`
  );
};

export default SimpleHighlighterExample;



`