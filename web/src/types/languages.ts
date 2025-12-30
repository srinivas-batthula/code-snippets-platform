// Programming languages interface and constants
export interface ProgrammingLanguages {
    javascript: string;
    typescript: string;
    jsx: string;
    tsx: string;
    python: string;
    java: string;
    csharp: string;
    cpp: string;
    c: string;
    html: string;
    css: string;
    scss: string;
    json: string;
    markdown: string;
    sql: string;
    php: string;
    ruby: string;
    go: string;
    rust: string;
    kotlin: string;
    swift: string;
    dart: string;
    bash: string;
    powershell: string;
    yaml: string;
    xml: string;
    dockerfile: string;
    graphql: string;
    r: string;
    matlab: string;
}

// Array of popular programming languages
export const PROGRAMMING_LANGUAGES: string[] = [
    "javascript",
    "typescript",
    "jsx",
    "tsx",
    "python",
    "java",
    "csharp",
    "cpp",
    "c",
    "html",
    "css",
    "scss",
    "json",
    "markdown",
    "sql",
    "php",
    "ruby",
    "go",
    "rust",
    "kotlin",
    "swift",
    "dart",
    "bash",
    "powershell",
    "yaml",
    "xml",
    "dockerfile",
    "graphql",
    "r",
    "matlab",
];

// Language display names mapping
export const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    jsx: "JSX",
    tsx: "TSX",
    python: "Python",
    java: "Java",
    csharp: "C#",
    cpp: "C++",
    c: "C",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    json: "JSON",
    markdown: "Markdown",
    sql: "SQL",
    php: "PHP",
    ruby: "Ruby",
    go: "Go",
    rust: "Rust",
    kotlin: "Kotlin",
    swift: "Swift",
    dart: "Dart",
    bash: "Bash",
    powershell: "PowerShell",
    yaml: "YAML",
    xml: "XML",
    dockerfile: "Dockerfile",
    graphql: "GraphQL",
    r: "R",
    matlab: "MATLAB",
};

// Helper function to get display name for a language
export const getLanguageDisplayName = (language?: string | null): string => {
    if (!language) {
        return "";
    }

    const normalizedLanguage = language.toLowerCase();
    return (
        LANGUAGE_DISPLAY_NAMES[normalizedLanguage] ||
        language.charAt(0).toUpperCase() + language.slice(1)
    );
};
