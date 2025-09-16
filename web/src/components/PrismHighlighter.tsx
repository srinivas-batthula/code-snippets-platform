"use client";

import { useEffect, useRef, useState } from "react";
import { initializePrism, loadLanguage, getPrism } from "@/lib/prism-config";
import { Copy, Check } from "lucide-react";

interface PrismHighlighterProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  className?: string;
}

const PrismHighlighter: React.FC<PrismHighlighterProps> = ({
  code,
  language,
  showLineNumbers = false,
  showCopyButton = true,
  className = "",
}) => {
  const codeRef = useRef<HTMLElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackError) {
        console.error("Fallback copy failed:", fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

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
    <div className="relative rounded-lg overflow-hidden group">
      {/* Copy Button */}
      {showCopyButton && (
        <button
          onClick={handleCopyToClipboard}
          className="absolute top-3 right-3 z-10 p-2 rounded-md bg-gray-800/80 hover:bg-gray-700/90 border border-gray-600/50 hover:border-gray-500/70 transition-all duration-200 opacity-100 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          title={isCopied ? "Copied!" : "Copy to clipboard"}
          aria-label={
            isCopied ? "Copied to clipboard" : "Copy code to clipboard"
          }
        >
          {isCopied ? (
            <Check size={14} className=" text-gray-300" />
          ) : (
            <Copy size={14} className=" text-gray-300 hover:text-white" />
          )}
        </button>
      )}

      <pre className={combinedClassName}>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default PrismHighlighter;


// import { jsxCodeSample } from "@/codeSamples/jsx";
// import PrismHighlighter from "@/components/PrismHighlighter";
// import React from "react";

// const page = () => {
//   return (
//     <div className="max-w-2xl mx-auto p-4 space-y-6">
//       <h1 className="text-2xl font-bold mb-4">
//         PrismHighlighter with Copy Button
//       </h1>

//       {/* With copy button and line numbers */}
//       <div>
//         <h2 className="text-lg font-semibold mb-2">
//           With Copy Button & Line Numbers
//         </h2>
//         <PrismHighlighter
//           code={jsxCodeSample}
//           language="jsx"
//           showLineNumbers={true}
//           showCopyButton={true}
//         />
//       </div>

//       {/* Without copy button */}
//       <div>
//         <h2 className="text-lg font-semibold mb-2">Without Copy Button</h2>
//         <PrismHighlighter
//           code={jsxCodeSample}
//           language="jsx"
//           showLineNumbers={true}
//           showCopyButton={false}
//         />
//       </div>
//     </div>
//   );
// };

// export default page;
