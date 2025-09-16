"use client";

import React, { useState, useEffect } from "react";
import PrismHighlighter from "@/components/PrismHighlighterFixed";
import CodeBlock from "@/components/CodeBlock";

const PrismDemo = () => {
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const examples = [
    {
      title: "JavaScript Function",
      language: "javascript",
      code: `// Advanced JavaScript function with closures
function createCounter(initialValue = 0) {
  let count = initialValue;
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count,
    reset: () => { count = initialValue; return count; }
  };
}

const counter = createCounter(5);
console.log(counter.increment()); // 6
console.log(counter.getValue());  // 6`,
    },
    {
      title: "TypeScript Interface",
      language: "typescript",
      code: `// TypeScript interfaces and generics
interface User<T = {}> {
  id: number;
  name: string;
  email: string;
  metadata?: T;
}

interface AdminUser extends User<{ permissions: string[] }> {
  isAdmin: true;
  lastLogin: Date;
}

class UserService<T extends User> {
  private users: T[] = [];
  
  addUser(user: T): void {
    this.users.push(user);
  }
  
  findById(id: number): T | undefined {
    return this.users.find(user => user.id === id);
  }
  
  getAll(): readonly T[] {
    return [...this.users];
  }
}`,
    },
    {
      title: "Python Class",
      language: "python",
      code: `from typing import List, Optional, Dict
import json
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    email: str
    is_active: bool = True
    
    def to_json(self) -> str:
        return json.dumps(self.__dict__)
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'User':
        return cls(**data)

# Usage example
user = User(1, "John Doe", "john@example.com")
json_data = user.to_json()
print(json_data)`,
    },
    {
      title: "CSS with Modern Features",
      language: "css",
      code: `/* Modern CSS with custom properties and container queries */
:root {
  --primary-color: hsl(220 70% 50%);
  --secondary-color: hsl(280 60% 60%);
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.card {
  background: linear-gradient(
    135deg, 
    var(--primary-color), 
    var(--secondary-color)
  );
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow);
  container-type: inline-size;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

@container (max-width: 300px) {
  .card {
    padding: 1rem;
    border-radius: 8px;
  }
}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <style jsx global>{`
        /* Prism.js Tomorrow Night Theme */
        .token.comment,
        .token.block-comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: #999;
        }

        .token.punctuation {
          color: #ccc;
        }

        .token.tag,
        .token.attr-name,
        .token.namespace,
        .token.deleted {
          color: #e2777a;
        }

        .token.function-name {
          color: #6196cc;
        }

        .token.boolean,
        .token.number,
        .token.function {
          color: #f08d49;
        }

        .token.property,
        .token.class-name,
        .token.constant,
        .token.symbol {
          color: #f8c555;
        }

        .token.selector,
        .token.important,
        .token.atrule,
        .token.keyword,
        .token.builtin {
          color: #cc99cd;
        }

        .token.string,
        .token.char,
        .token.attr-value,
        .token.regex,
        .token.variable {
          color: #7ec699;
        }

        .token.operator,
        .token.entity,
        .token.url {
          color: #67cdcc;
        }

        /* Line numbers */
        .line-numbers {
          position: relative;
          padding-left: 3.8em;
          counter-reset: linenumber;
        }

        .line-numbers > code {
          position: relative;
          white-space: inherit;
        }

        .line-numbers .line-numbers-rows {
          position: absolute;
          pointer-events: none;
          top: 0;
          font-size: 100%;
          left: -3.8em;
          width: 3em;
          letter-spacing: -1px;
          border-right: 1px solid #999;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .line-numbers-rows > span {
          display: block;
          counter-increment: linenumber;
        }

        .line-numbers-rows > span:before {
          content: counter(linenumber);
          color: #999;
          display: block;
          padding-right: 0.8em;
          text-align: right;
        }

        /* Custom styles */
        pre[class*="language-"] {
          background: #2d2d2d;
          color: #ccc;
          font-family: "Fira Code", "Consolas", "Monaco", "Courier New",
            monospace;
          font-size: 0.875rem;
          line-height: 1.5;
          border-radius: 8px;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 0;
        }

        code[class*="language-"] {
          background: transparent;
          color: inherit;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Prism.js with Next.js & TypeScript
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Complete syntax highlighting solution with advanced features
          </p>
        </div>

        {/* Code Examples */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Syntax Highlighting Examples
          </h2>

          {examples.map((example, index) => (
            <div key={index}>
              <CodeBlock
                code={example.code}
                language={example.language}
                title={example.title}
                showLineNumbers={true}
                maxHeight="500px"
                highlightLines={
                  example.language === "javascript" ? [5, 8, 12] : []
                }
              />
            </div>
          ))}
        </div>

        {/* Simple Highlighter Example */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Simple Highlighter
          </h2>
          <PrismHighlighter
            code={`// Simple React Hook
import { useState, useCallback } from 'react';

export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);
  
  return [value, toggle, setValue];
};`}
            language="javascript"
            showLineNumbers={true}
          />
        </div>

        {/* Usage Instructions */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            How to Use Prism.js in Next.js
          </h2>
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                1. Basic Usage:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
                {`import PrismHighlighter from '@/components/PrismHighlighterFixed';

<PrismHighlighter
  code="console.log('Hello World!');"
  language="javascript"
  showLineNumbers={true}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                2. Advanced Code Block:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
                {`import CodeBlock from '@/components/CodeBlock';

<CodeBlock
  code={yourCode}
  language="typescript"
  title="My Component"
  showLineNumbers={true}
  highlightLines={[5, 10, 15]}
  maxHeight="400px"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                3. Supported Languages:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {[
                  "JavaScript",
                  "TypeScript",
                  "JSX",
                  "TSX",
                  "Python",
                  "Java",
                  "CSS",
                  "SCSS",
                  "JSON",
                  "Bash",
                  "SQL",
                ].map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "🎨 Multiple Languages",
                desc: "Support for 11+ programming languages with syntax highlighting",
              },
              {
                title: "📝 Line Numbers",
                desc: "Optional line numbering with professional styling",
              },
              {
                title: "📋 Copy to Clipboard",
                desc: "One-click code copying functionality for better UX",
              },
              {
                title: "⚡ SSR Compatible",
                desc: "Works seamlessly with Next.js server-side rendering",
              },
              {
                title: "🎯 Line Highlighting",
                desc: "Highlight specific lines to draw attention to important code",
              },
              {
                title: "🚀 Dynamic Loading",
                desc: "Languages loaded on-demand for optimal performance",
              },
              {
                title: "📱 Responsive Design",
                desc: "Mobile-friendly with touch support and responsive layout",
              },
              {
                title: "🎭 Custom Themes",
                desc: "Fully customizable CSS themes and color schemes",
              },
              {
                title: "🔷 TypeScript Ready",
                desc: "Complete TypeScript integration with full type safety",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            📦 Installation & Setup
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                1. Install Dependencies:
              </h3>
              <pre className="bg-black text-green-400 p-3 rounded text-sm">
                npm install prismjs @types/prismjs
              </pre>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                2. Import and Use:
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Copy the provided components to your project and start using
                them immediately. All components are TypeScript-ready and
                SSR-compatible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrismDemo;
