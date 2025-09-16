"use client";

import { useState, useEffect, useRef } from "react";

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
    const loadPrism = async () => {
      if (typeof window !== "undefined") {
        try {
          const Prism = (await import("prismjs")).default;

          // Import specific language if not already loaded
          if (!Prism.languages[language]) {
            try {
              switch (language) {
                case "javascript":
                  await import("prismjs/components/prism-javascript.js" as any);
                  break;
                case "typescript":
                  await import("prismjs/components/prism-typescript.js" as any);
                  break;
                case "jsx":
                  await import("prismjs/components/prism-jsx.js" as any);
                  break;
                case "tsx":
                  await import("prismjs/components/prism-tsx.js" as any);
                  break;
                case "python":
                  await import("prismjs/components/prism-python.js" as any);
                  break;
                case "java":
                  await import("prismjs/components/prism-java.js" as any);
                  break;
                case "css":
                  await import("prismjs/components/prism-css.js" as any);
                  break;
                case "scss":
                  await import("prismjs/components/prism-scss.js" as any);
                  break;
                case "json":
                  await import("prismjs/components/prism-json.js" as any);
                  break;
                case "bash":
                  await import("prismjs/components/prism-bash.js" as any);
                  break;
                case "sql":
                  await import("prismjs/components/prism-sql.js" as any);
                  break;
                case "html":
                case "markup":
                  await import("prismjs/components/prism-markup.js" as any);
                  break;
              }
            } catch (error) {
              console.warn(`Failed to load language ${language}:`, error);
            }
          }

          // Import plugins if needed
          if (showLineNumbers) {
            try {
              await import(
                "prismjs/plugins/line-numbers/prism-line-numbers.js" as any
              );
            } catch (error) {
              console.warn("Failed to load line numbers plugin:", error);
            }
          }

          // Highlight this specific element
          if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
          }
        } catch (error) {
          console.error("Failed to load Prism:", error);
        }
      }
    };

    loadPrism();
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
            const Prism = (await import("prismjs")).default;
            Prism.highlightElement(codeRef.current);
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
