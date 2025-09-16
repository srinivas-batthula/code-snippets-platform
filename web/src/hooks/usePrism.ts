"use client";

import { useEffect, useState } from "react";

interface UsePrismOptions {
    theme?:
        | "default"
        | "dark"
        | "tomorrow"
        | "okaidia"
        | "twilight"
        | "coy"
        | "solarizedlight";
    plugins?: string[];
}

const THEME_URLS = {
    default:
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css",
    dark: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-dark.min.css",
    tomorrow:
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css",
    okaidia:
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-okaidia.min.css",
    twilight:
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-twilight.min.css",
    coy: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-coy.min.css",
    solarizedlight:
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-solarizedlight.min.css",
};

const LANGUAGE_URLS: Record<string, string> = {
    javascript:
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js",
    typescript:
        "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js",
    jsx: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-jsx.min.js",
    tsx: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-tsx.min.js",
    python: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js",
    java: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-java.min.js",
    css: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js",
    scss: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-scss.min.js",
    json: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js",
    bash: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js",
    sql: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-sql.min.js",
    go: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-go.min.js",
    rust: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-rust.min.js",
    php: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-php.min.js",
};

const PLUGIN_URLS: Record<string, { js?: string; css?: string }> = {
    "line-numbers": {
        js: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js",
        css: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css",
    },
    "copy-to-clipboard": {
        js: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js",
    },
    toolbar: {
        js: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.js",
        css: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.css",
    },
    "highlight-keywords": {
        js: "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/highlight-keywords/prism-highlight-keywords.min.js",
    },
};

export const usePrism = ({
    theme = "tomorrow",
    plugins = [],
}: UsePrismOptions = {}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadedLanguages, setLoadedLanguages] = useState<Set<string>>(
        new Set(),
    );

    // Load core Prism and theme
    useEffect(() => {
        const loadCore = async () => {
            // Load theme CSS
            if (!document.querySelector(`link[data-prism-theme="${theme}"]`)) {
                const themeLink = document.createElement("link");
                themeLink.rel = "stylesheet";
                themeLink.href = THEME_URLS[theme];
                themeLink.setAttribute("data-prism-theme", theme);
                document.head.appendChild(themeLink);
            }

            // Load core Prism JS if not already loaded
            if (typeof window !== "undefined" && !(window as any).Prism) {
                const script = document.createElement("script");
                script.src =
                    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
                script.onload = () => {
                    // Load plugins
                    plugins.forEach(async (plugin) => {
                        const pluginConfig = PLUGIN_URLS[plugin];
                        if (pluginConfig) {
                            // Load plugin CSS
                            if (pluginConfig.css) {
                                const pluginCss =
                                    document.createElement("link");
                                pluginCss.rel = "stylesheet";
                                pluginCss.href = pluginConfig.css;
                                document.head.appendChild(pluginCss);
                            }
                            // Load plugin JS
                            if (pluginConfig.js) {
                                const pluginScript =
                                    document.createElement("script");
                                pluginScript.src = pluginConfig.js;
                                document.head.appendChild(pluginScript);
                            }
                        }
                    });
                    setIsLoaded(true);
                };
                document.head.appendChild(script);
            } else {
                setIsLoaded(true);
            }
        };

        loadCore();
    }, [theme, plugins]);

    const loadLanguage = async (language: string): Promise<void> => {
        if (loadedLanguages.has(language) || !LANGUAGE_URLS[language]) {
            return;
        }

        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = LANGUAGE_URLS[language];
            script.onload = () => {
                setLoadedLanguages((prev) => new Set([...prev, language]));
                resolve();
            };
            script.onerror = () => {
                console.warn(`Failed to load language: ${language}`);
                resolve();
            };
            document.head.appendChild(script);
        });
    };

    const highlightElement = (element: HTMLElement) => {
        if (isLoaded && (window as any).Prism) {
            (window as any).Prism.highlightElement(element);
        }
    };

    const highlightAll = () => {
        if (isLoaded && (window as any).Prism) {
            (window as any).Prism.highlightAll();
        }
    };

    return {
        isLoaded,
        loadLanguage,
        highlightElement,
        highlightAll,
        loadedLanguages: Array.from(loadedLanguages),
    };
};
