"use client";

import { useEffect } from "react";

interface PrismHighlighterProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  className?: string;
}

const PrismHighlighter: React.FC<PrismHighlighterProps> = ({
  code,
  language,
  showLineNumbers = false,
  className = "",
}) => {
  useEffect(() => {
    // Dynamically import Prism to avoid SSR issues
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
                default:
                  console.warn(`Language ${language} not supported`);
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

          // Highlight all code blocks
          Prism.highlightAll();
        } catch (error) {
          console.error("Failed to load Prism:", error);
        }
      }
    };

    loadPrism();
  }, [code, language, showLineNumbers]);

  const lineNumberClass = showLineNumbers ? "line-numbers" : "";
  const combinedClassName =
    `language-${language} ${lineNumberClass} ${className}`.trim();

  return (
    <div className="relative">
      <pre className={combinedClassName}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

export default PrismHighlighter;
