/**
 * Type definitions for Monaco Editor component
 */

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

export interface LanguageOption {
    value: SupportedLanguage;
    label: string;
}

/**
 * Monaco Editor Component Examples:
 *
 * Basic usage:
 * ```tsx
 * import MonacoEditor from '@/components/MonacoEditor';
 *
 * <MonacoEditor />
 * ```
 *
 * With props:
 * ```tsx
 * <MonacoEditor
 *   initialLanguage="typescript"
 *   initialCode="console.log('Hello World!');"
 *   height="400px"
 *   onCodeChange={(code) => console.log(code)}
 *   readOnly={false}
 * />
 * ```
 *
 * Custom styling:
 * ```tsx
 * <MonacoEditor
 *   className="my-custom-class"
 *   showLanguageSelector={false}
 *   showFontControls={false}
 *   themeName="prismTheme"
 * />
 * ```
 */
