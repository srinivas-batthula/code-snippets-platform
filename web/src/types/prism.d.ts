declare module "prismjs" {
    interface Prism {
        highlight(text: string, grammar: any, language: string): string;
        highlightAll(): void;
        highlightAllUnder(container: Element): void;
        highlightElement(element: Element): void;
        tokenize(text: string, grammar: any): Token[];
        languages: { [key: string]: any };
        plugins: { [key: string]: any };
        util: {
            encode(tokens: Token[]): Token[];
            type(obj: any): string;
            objId(obj: any): string;
            clone(obj: any): any;
        };
    }

    interface Token {
        type: string;
        content: string | Token[];
        alias?: string | string[];
        matchedStr?: string;
        greedy?: boolean;
        pattern?: RegExp;
        lookbehind?: boolean;
        inside?: any;
    }

    interface Environment {
        element: Element;
        language: string;
        grammar: any;
        code: string;
    }

    const Prism: Prism;
    export = Prism;
}

declare module "prismjs/themes/*";
declare module "prismjs/components/*";
declare module "prismjs/plugins/*";

// Extend window interface for global Prism
declare global {
    interface Window {
        Prism: import("prismjs");
    }
}

export {};
