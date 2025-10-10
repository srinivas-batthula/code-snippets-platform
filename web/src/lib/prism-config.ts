"use client";

// Global Prism configuration - loads once for the entire app
let prismInitialized = false;
let prismLoading = false;
let prismReadyPromise: Promise<void> | null = null;

export const initializePrism = (): Promise<void> => {
    if (prismInitialized) {
        return Promise.resolve();
    }

    if (prismLoading) {
        return prismReadyPromise!;
    }

    prismLoading = true;
    prismReadyPromise = new Promise(async (resolve) => {
        if (typeof window === "undefined") {
            resolve();
            return;
        }

        try {
            // CSS is now preloaded in layout.tsx to prevent FOUC on refresh

            // Load core Prism
            const Prism = (await import("prismjs")).default;

            // Pre-load common languages
            const languageLoaders = [
                await import("prismjs/components/prism-javascript.js" as any),
                await import("prismjs/components/prism-typescript.js" as any),
                await import("prismjs/components/prism-jsx.js" as any),
                await import("prismjs/components/prism-tsx.js" as any),
                await import("prismjs/components/prism-markup.js" as any), // for HTML
                await import("prismjs/components/prism-css.js" as any),
                await import("prismjs/components/prism-json.js" as any),
                await import("prismjs/components/prism-python.js" as any),
                await import("prismjs/components/prism-bash.js" as any),
            ];

            // Load line numbers plugin
            const pluginLoaders = [
                import(
                    "prismjs/plugins/line-numbers/prism-line-numbers.js" as any
                ),
            ];

            // Load all languages and plugins in parallel
            await Promise.allSettled([...languageLoaders, ...pluginLoaders]);

            prismInitialized = true;
            prismLoading = false;
            console.log("Prism.js initialized successfully");
            resolve();
        } catch (error) {
            console.error("Failed to initialize Prism:", error);
            prismLoading = false;
            resolve(); // Continue anyway
        }
    });

    return prismReadyPromise;
};

// Load additional language if needed
export const loadLanguage = async (language: string): Promise<void> => {
    if (typeof window === "undefined") return;

    try {
        const Prism = (await import("prismjs")).default;

        // Check if language is already loaded
        if (
            Prism.languages[language] ||
            Prism.languages[language === "html" ? "markup" : language]
        ) {
            return;
        }

        // Load specific language
        switch (language) {
            case "java":
                await import("prismjs/components/prism-java.js" as any);
                break;
            case "scss":
                await import("prismjs/components/prism-scss.js" as any);
                break;
            case "sql":
                await import("prismjs/components/prism-sql.js" as any);
                break;
            case "php":
                await import("prismjs/components/prism-php.js" as any);
                break;
            case "go":
                await import("prismjs/components/prism-go.js" as any);
                break;
            case "rust":
                await import("prismjs/components/prism-rust.js" as any);
                break;
            case "yaml":
                await import("prismjs/components/prism-yaml.js" as any);
                break;
            case "markdown":
                await import("prismjs/components/prism-markdown.js" as any);
                break;
            default:
                console.warn(
                    `Language ${language} not pre-loaded. Add it to loadLanguage function if needed.`,
                );
        }
    } catch (error) {
        console.warn(`Failed to load language ${language}:`, error);
    }
};

// Global Prism instance getter
export const getPrism = async () => {
    await initializePrism();
    return (await import("prismjs")).default;
};
