"use client";
import { JSX, useEffect, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";

interface LanguageOption {
  value: SupportedLanguage;
  label: string;
}

export type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "tsx"
  | "jsx"
  | "python"
  | "java"
  | "csharp"
  | "cpp"
  | "html"
  | "css"
  | "json"
  | "markdown";

export interface MonacoEditorProps {
  /** Initial language for the editor */
  initialLanguage?: SupportedLanguage;
  /** Initial code content */
  initialCode?: string;
  /** Initial font size */
  initialFontSize?: number;
  /** Editor height */
  height?: string;
  /** Whether to show language selector */
  showLanguageSelector?: boolean;
  /** Whether to show font size controls */
  showFontControls?: boolean;
  /** Custom theme name */
  themeName?: string;
  /** Callback when code changes */
  onCodeChange?: (code: string) => void;
  /** Callback when language changes */
  onLanguageChange?: (language: SupportedLanguage) => void;
  /** Custom CSS class for the container */
  className?: string;
  /** Whether editor is read-only */
  readOnly?: boolean;
}

export default function MonacoEditor({
  initialLanguage = "javascript",
  initialCode,
  initialFontSize = 14,
  height = "600px",
  showLanguageSelector = true,
  showFontControls = true,
  themeName = "prismTheme",
  onCodeChange,
  onLanguageChange,
  className = "",
  readOnly = false,
}: MonacoEditorProps): JSX.Element {
  // Helper functions
  const getDefaultCode = (lang: SupportedLanguage): string => {
    const samples: Record<SupportedLanguage, string> = {
      javascript: `// JavaScript Example\nconst greeting = 'Hello World!';\nfunction sayHello(name) {\n  return \`Hello, \${name}!\`;\n}\nconsole.log(sayHello('Developer'));`,
      typescript: `// TypeScript Example\ninterface User {\n  name: string;\n  age: number;\n}\n\nconst user: User = {\n  name: 'John Doe',\n  age: 30\n};\n\nfunction greetUser(user: User): string {\n  return \`Hello, \${user.name}! You are \${user.age} years old.\`;\n}\n\nconsole.log(greetUser(user));`,
      tsx: `// TSX Example\nimport React, { useState } from 'react';\n\ninterface Props {\n  initialCount?: number;\n}\n\nconst Counter: React.FC<Props> = ({ initialCount = 0 }) => {\n  const [count, setCount] = useState<number>(initialCount);\n\n  return (\n    <div className="counter">\n      <h1>Count: {count}</h1>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n};\n\nexport default Counter;`,
      jsx: `// JSX Example\nimport React, { useState } from 'react';\n\nconst Counter = ({ initialCount = 0 }) => {\n  const [count, setCount] = useState(initialCount);\n\n  return (\n    <div className="counter">\n      <h1>Count: {count}</h1>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n};\n\nexport default Counter;`,
      python: `# Python Example\ndef greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nif __name__ == "__main__":\n    message = greet("World")\n    print(message)`,
      java: `// Java Example\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
      csharp: `// C# Example\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}`,
      cpp: `// C++ Example\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}`,
      html: `<!-- HTML Example -->\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>`,
      css: `/* CSS Example */\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #16191d;\n    color: #abb2bf;\n}\n\nh1 {\n    color: #61afef;\n}`,
      json: `{\n  "name": "example",\n  "version": "1.0.0",\n  "description": "A sample JSON file",\n  "keywords": ["json", "example"],\n  "author": "Developer"\n}`,
      markdown: `# Markdown Example\n\nThis is a **bold** text and this is *italic*.\n\n## Code Block\n\n\`\`\`javascript\nconsole.log('Hello World!');\n\`\`\`\n\n- List item 1\n- List item 2`,
    };
    return samples[lang] || "// Type your code here";
  };

  // Map our custom language types to Monaco's supported languages
  const getMonacoLanguage = (lang: SupportedLanguage): string => {
    const languageMap: Record<SupportedLanguage, string> = {
      javascript: "javascript",
      typescript: "typescript",
      jsx: "javascript",
      tsx: "typescript",
      python: "python",
      java: "java",
      csharp: "csharp",
      cpp: "cpp",
      html: "html",
      css: "css",
      json: "json",
      markdown: "markdown",
    };
    return languageMap[lang] || "javascript";
  };

  // State
  const monaco = useMonaco();
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [code, setCode] = useState<string>(
    initialCode || getDefaultCode(initialLanguage),
  );
  const [fontSize, setFontSize] = useState<number>(initialFontSize);

  useEffect(() => {
    if (monaco) {
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        allowJs: true,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        strict: false,
        skipLibCheck: true,
      });

      // Configure JavaScript compiler options
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        allowJs: true,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
      });

      // Disable diagnostics (error squiggles) for TypeScript and JavaScript
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
        noSuggestionDiagnostics: true,
      });

      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
        noSuggestionDiagnostics: true,
      });

      // Add React type definitions
      const reactTypes = `
        declare module 'react' {
          export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
            type: T;
            props: P;
            key: Key | null;
          }
          export type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<P, any>);
          export type Key = string | number;
          export class Component<P = {}, S = {}> {}
          export function createElement<P extends {}>(
            type: string | JSXElementConstructor<P>,
            props?: P | null,
            ...children: ReactNode[]
          ): ReactElement<P>;
          export type ReactNode = ReactElement | string | number | boolean | null | undefined;
        }
        declare global {
          namespace JSX {
            interface Element extends React.ReactElement<any, any> {}
            interface IntrinsicElements {
              [elemName: string]: any;
            }
          }
        }
      `;

      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        reactTypes,
        "ts:react.d.ts",
      );

      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        reactTypes,
        "ts:react.d.ts",
      );

      monaco.editor.defineTheme("prismTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          // Comments
          { token: "comment", foreground: "7f848e", fontStyle: "italic" },
          { token: "comment.block", foreground: "7f848e", fontStyle: "italic" },
          { token: "comment.line", foreground: "7f848e", fontStyle: "italic" },

          // Keywords
          { token: "keyword", foreground: "c678dd" },
          { token: "keyword.control", foreground: "c678dd" },
          { token: "keyword.operator", foreground: "56b6c2" },

          // Strings
          { token: "string", foreground: "98c379" },
          { token: "string.quoted", foreground: "98c379" },
          { token: "string.template", foreground: "98c379" },

          // Numbers and constants
          { token: "number", foreground: "d19a66" },
          { token: "constant", foreground: "d19a66" },
          { token: "constant.numeric", foreground: "d19a66" },
          { token: "constant.language.boolean", foreground: "d19a66" },

          // Functions
          { token: "function", foreground: "61afef" },
          { token: "entity.name.function", foreground: "61afef" },
          { token: "support.function", foreground: "61afef" },

          // Variables and identifiers
          { token: "variable", foreground: "e06c75" },
          { token: "identifier", foreground: "e06c75" },
          { token: "entity.name.variable", foreground: "e06c75" },

          // Types and classes
          { token: "type", foreground: "e5c07b" },
          { token: "entity.name.type", foreground: "e5c07b" },
          { token: "entity.name.class", foreground: "e5c07b" },
          { token: "support.class", foreground: "e5c07b" },

          // Properties and attributes
          { token: "property", foreground: "d19a66" },
          { token: "entity.name.tag", foreground: "e06c75" },
          { token: "entity.other.attribute-name", foreground: "d19a66" },

          // Operators
          { token: "operator", foreground: "56b6c2" },
          { token: "punctuation", foreground: "abb2bf" },

          // Regular expressions
          { token: "regexp", foreground: "e06c75" },

          // JSX/TSX specific
          { token: "tag", foreground: "e06c75" },
          { token: "tag.name", foreground: "e06c75" },
          { token: "attribute.name", foreground: "d19a66" },
          { token: "attribute.value", foreground: "98c379" },

          // Markdown specific
          { token: "markup.heading", foreground: "e06c75" },
          { token: "markup.bold", foreground: "d19a66", fontStyle: "bold" },
          { token: "markup.italic", foreground: "c678dd", fontStyle: "italic" },
          { token: "markup.quote", foreground: "7f848e", fontStyle: "italic" },
          { token: "markup.underline.link", foreground: "61afef" },
        ],
        colors: {
          "editor.background": "#16191d",
          "editor.foreground": "#abb2bf",
          "editorLineNumber.foreground": "#636d83",
          "editorLineNumber.activeForeground": "#abb2bf",
          "editor.selectionBackground": "#67769660",
          "editor.selectionHighlightBackground": "#67769630",
          "editor.findMatchBackground": "#67769660",
          "editor.findMatchHighlightBackground": "#67769630",
          "editorCursor.foreground": "#abb2bf",
          "editor.lineHighlightBackground": "#1e2227",
          "editorIndentGuide.background": "#3c3f43",
          "editorIndentGuide.activeBackground": "#636d83",
          "editorBracketMatch.background": "#67769660",
          "editorBracketMatch.border": "#677696",
        },
      });

      // Set the theme
      monaco.editor.setTheme(themeName);
    }
  }, [monaco, themeName]);

  const increaseFontSize = (): void => {
    setFontSize((prev) => Math.min(prev + 2, 32));
  };

  const decreaseFontSize = (): void => {
    setFontSize((prev) => Math.max(prev - 2, 8));
  };

  const resetFontSize = (): void => {
    setFontSize(14);
  };

  const languageOptions: LanguageOption[] = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "jsx", label: "JSX" },
    { value: "tsx", label: "TSX" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "json", label: "JSON" },
    { value: "markdown", label: "Markdown" },
  ];

  const handleLanguageChange = (newLanguage: SupportedLanguage): void => {
    setLanguage(newLanguage);
    const newCode = getDefaultCode(newLanguage);
    setCode(newCode);
    onLanguageChange?.(newLanguage);
    onCodeChange?.(newCode);
  };

  const handleEditorChange = (value: string | undefined): void => {
    const newCode = value || "";
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  return (
    <div
      className={`flex flex-col gap-4 p-4 bg-gray-900 min-h-screen ${className}`}
    >
      {(showLanguageSelector || showFontControls) && (
        <div className="flex items-center justify-between">
          {showLanguageSelector && (
            <div className="flex items-center gap-4">
              <label className="text-white font-medium">Language:</label>
              <select
                value={language}
                onChange={(e) =>
                  handleLanguageChange(e.target.value as SupportedLanguage)
                }
                className="px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languageOptions.map((option, index) => (
                  <option key={`${option.value}-${index}`} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showFontControls && (
            <div className="flex items-center gap-3">
              <span className="text-white font-medium">Font Size:</span>
              <button
                onClick={decreaseFontSize}
                className="px-3 py-1 bg-gray-800 text-white border border-gray-700 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={fontSize <= 8}
              >
                A-
              </button>
              <span className="text-white bg-gray-800 px-3 py-1 rounded border border-gray-700 min-w-[3rem] text-center">
                {fontSize}
              </span>
              <button
                onClick={increaseFontSize}
                className="px-3 py-1 bg-gray-800 text-white border border-gray-700 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={fontSize >= 32}
              >
                A+
              </button>
              <button
                onClick={resetFontSize}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}

      <div className="border border-gray-700 rounded-lg overflow-hidden">
        <Editor
          height={height}
          language={getMonacoLanguage(language)}
          value={code}
          onChange={handleEditorChange}
          theme={themeName}
          options={{
            fontSize: fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: "on",
            lineNumbers: "on",
            renderWhitespace: "selection",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            readOnly: readOnly,
            suggest: {
              snippetsPreventQuickSuggestions: false,
            },
            
          }}
        />
      </div>
    </div>
  );
}
