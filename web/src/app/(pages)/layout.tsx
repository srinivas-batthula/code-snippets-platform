// (pages)/layout.tsx
import { ReactNode } from "react";

export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* One Dark Pro Night Flat theme for Prism.js - only for pages that need syntax highlighting */}
      <style data-prism-theme="one-dark-pro-night-flat">{`
        /* One Dark Pro Night Flat Theme - Exact VS Code colors */
        code[class*="language-"],
        pre[class*="language-"] {
          color: #abb2bf;
          background: #16191d;
          font-size: 14px;
          text-align: left;
          white-space: pre;
          word-spacing: normal;
          word-break: normal;
          word-wrap: normal;
          line-height: 1.5;
          tab-size: 2;
          hyphens: none;
        }

        pre[class*="language-"] {
          padding: 1em;
          margin: 0 !important;
          overflow: auto;
          border-radius: 0.5rem;
        }

        :not(pre) > code[class*="language-"],
        pre[class*="language-"] {
          background: #16191d;
        }

        code[class*="language-"] {
          background: none !important;
        }

        /* Selection */
        pre[class*="language-"]::-moz-selection,
        pre[class*="language-"] ::-moz-selection,
        code[class*="language-"]::-moz-selection,
        code[class*="language-"] ::-moz-selection {
          text-shadow: none;
          background: #67769660;
        }

        pre[class*="language-"]::selection,
        pre[class*="language-"] ::selection,
        code[class*="language-"]::selection,
        code[class*="language-"] ::selection {
          text-shadow: none;
          background: #67769660;
        }

        /* Comments */
        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: #7f848e;
          font-style: italic;
        }

        /* Punctuation */
        .token.punctuation {
          color: #abb2bf;
        }

        /* Keywords */
        .token.keyword,
        .token.control,
        .token.atrule {
          color: #c678dd;
        }

        /* Strings */
        .token.string,
        .token.char,
        .token.attr-value,
        .token.builtin,
        .token.inserted {
          color: #98c379;
        }

        /* Numbers, booleans, constants */
        .token.number,
        .token.boolean,
        .token.constant,
        .token.symbol,
        .token.deleted {
          color: #d19a66;
        }

        /* Functions */
        .token.function,
        .token.method {
          color: #61afef;
        }

        /* Classes, types, namespaces */
        .token.class-name,
        .token.type-class,
        .token.namespace {
          color: #e5c07b;
        }

        /* Variables */
        .token.variable {
          color: #e06c75;
        }

        /* Properties, attributes */
        .token.property,
        .token.attr-name {
          color: #d19a66;
        }

        /* Operators */
        .token.operator,
        .token.entity,
        .token.url,
        .language-css .token.string,
        .style .token.string {
          color: #56b6c2;
        }

        /* Tags */
        .token.selector,
        .token.tag {
          color: #e06c75;
        }

        /* Regular expressions */
        .token.regex,
        .token.important {
          color: #e06c75;
        }

        /* Important, bold, italic */
        .token.important,
        .token.bold {
          font-weight: bold;
        }

        .token.italic {
          font-style: italic;
        }

        /* Entity */
        .token.entity {
          cursor: help;
        }

        /* JSON property names */
        .token.property.string {
          color: #e06c75;
        }

        /* CSS values */
        .token.value {
          color: #d19a66;
        }

        
      `}</style>

      {/* Load line numbers plugin CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.css"
      />

      {children}
    </>
  );
}
