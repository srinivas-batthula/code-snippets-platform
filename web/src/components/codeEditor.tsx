"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePrism } from "@/hooks/usePrism";

interface CodeEditorProps {
  initialCode?: string;
  language: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
  theme?:
    | "default"
    | "dark"
    | "tomorrow"
    | "okaidia"
    | "twilight"
    | "coy"
    | "solarizedlight";
  height?: string;
  showLineNumbers?: boolean;
  placeholder?: string;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = "",
  language,
  onChange,
  readOnly = false,
  theme = "tomorrow",
  height = "300px",
  showLineNumbers = true,
  placeholder = "Enter your code here...",
  className = "",
}) => {
  const [code, setCode] = useState(initialCode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const { isLoaded, loadLanguage, highlightAll } = usePrism({
    theme,
    plugins: ["line-numbers", "toolbar", "copy-to-clipboard"],
  });

  // Load language when component mounts or language changes
  useEffect(() => {
    if (isLoaded) {
      loadLanguage(language);
    }
  }, [isLoaded, language, loadLanguage]);

  // Highlight code whenever it changes
  useEffect(() => {
    if (isLoaded && preRef.current) {
      const timer = setTimeout(() => {
        highlightAll();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [code, isLoaded, highlightAll]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange?.(newCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      onChange?.(newCode);

      // Set cursor position after the inserted tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const syncScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const lineNumberClass = showLineNumbers ? "line-numbers" : "";

  return (
    <div
      className={`code-editor-container relative border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700 ${className}`}
    >
      <div className="relative" style={{ height }}>
        {/* Syntax highlighted background */}
        <pre
          ref={preRef}
          className={`absolute inset-0 m-0 p-4 overflow-auto font-mono text-sm leading-relaxed pointer-events-none ${lineNumberClass}`}
          style={{
            background: "transparent",
            color: "transparent",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
        >
          <code className={`language-${language}`}>{code || placeholder}</code>
        </pre>

        {/* Editable textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`
            absolute inset-0 w-full h-full p-4 m-0
            font-mono text-sm leading-relaxed
            bg-transparent resize-none outline-none
            ${readOnly ? "cursor-default" : "cursor-text"}
            ${showLineNumbers ? "pl-16" : "pl-4"}
          `}
          style={{
            color: readOnly ? "transparent" : "inherit",
            caretColor: readOnly ? "transparent" : "auto",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
          spellCheck={false}
        />
      </div>

      {/* Language indicator */}
      <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-75">
        {language.toUpperCase()}
      </div>
    </div>
  );
};

export default CodeEditor;
