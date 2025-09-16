"use client";

import { useEffect, useRef } from "react";
import { initializePrism, loadLanguage, getPrism } from "@/lib/prism-config";

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
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const setupPrismHighlighting = async () => {
      if (typeof window !== "undefined") {
        try {
          // Initialize Prism globally (only happens once)
          await initializePrism();

          // Load the specific language if needed
          await loadLanguage(language);

          // Get the Prism instance
          const Prism = await getPrism();

          if (Prism && codeRef.current) {
            // Highlight this specific element
            Prism.highlightElement(codeRef.current);
          }
        } catch (error) {
          console.error("Failed to setup Prism highlighting:", error);
        }
      }
    };

    setupPrismHighlighting();
  }, [code, language, showLineNumbers]);

  const lineNumberClass = showLineNumbers ? "line-numbers" : "";
  const combinedClassName =
    `language-${language} ${lineNumberClass} ${className}`.trim();

  return (
    <div className="relative rounded-lg overflow-hidden">
      <pre className={combinedClassName}>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default PrismHighlighter;
