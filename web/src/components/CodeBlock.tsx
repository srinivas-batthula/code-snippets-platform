"use client";

import { useState, useEffect, useRef } from "react";
import { initializePrism, loadLanguage, getPrism } from "@/lib/prism-config";

// Types
interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  maxHeight?: string;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  title,
  showLineNumbers = true,
  highlightLines = [],
  maxHeight = "400px",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const setupPrismHighlighting = async () => {
      if (typeof window !== "undefined") {
        try {
          // Initialize Prism globally (only happens once)
          await initializePrism();

          // Load the specific language if needed
          await loadLanguage(language);

          // Get the Prism instance and highlight this specific element
          const Prism = await getPrism();
          if (Prism && codeRef.current) {
            Prism.highlightElement(codeRef.current);
          }
        } catch (error) {
          console.error("Failed to setup Prism highlighting:", error);
        }
      }
    };

    setupPrismHighlighting();
  }, [code, language, showLineNumbers]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Re-highlight after copy to maintain syntax highlighting
      setTimeout(async () => {
        if (typeof window !== "undefined" && codeRef.current) {
          try {
            const Prism = await getPrism();
            if (Prism) {
              Prism.highlightElement(codeRef.current);
            }
          } catch (error) {
            console.error("Failed to re-highlight after copy:", error);
          }
        }
      }, 100);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const processCodeWithHighlights = (codeString: string) => {
    if (highlightLines.length === 0) return codeString;

    const lines = codeString.split("\n");
    return lines
      .map((line, index) => {
        const lineNumber = index + 1;
        const isHighlighted = highlightLines.includes(lineNumber);
        return isHighlighted
          ? `<mark class="highlighted-line">${line}</mark>`
          : line;
      })
      .join("\n");
  };

  const lineNumberClass = showLineNumbers ? "line-numbers" : "";
  const combinedClassName =
    `language-${language} ${lineNumberClass} ${className}`.trim();

  return (
    <div className="code-block-container border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {language}
            </span>
            <button
              onClick={handleCopy}
              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <div className="relative" style={{ maxHeight, overflowY: "auto" }}>
        <pre className={combinedClassName}>
          <code
            ref={codeRef}
            className={`language-${language}`}
            dangerouslySetInnerHTML={{
              __html: processCodeWithHighlights(code),
            }}
          />
        </pre>

        {!title && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 hover:opacity-100 transition-opacity"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      <style jsx>{`
        .highlighted-line {
          background-color: rgba(255, 255, 0, 0.2);
          display: block;
          margin: 0 -1rem;
          padding: 0 1rem;
          border-left: 3px solid #fbbf24;
        }
        .dark .highlighted-line {
          background-color: rgba(255, 255, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default CodeBlock;
