"use client";

import PrismHighlighter from "@/components/PrismHighlighter";

// Simulate database code snippets
const codeSnippets = [
  {
    id: 1,
    language: "javascript",
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55`,
    title: "Fibonacci Function",
  },
  {
    id: 2,
    language: "typescript",
    code: `interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Jane", email: "jane@example.com" }
];`,
    title: "TypeScript Interface",
  },
  {
    id: 3,
    language: "python",
    code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# Example usage
numbers = [3, 6, 8, 10, 1, 2, 1]
sorted_numbers = quick_sort(numbers)
print(sorted_numbers)`,
    title: "Quick Sort Algorithm",
  },
  {
    id: 4,
    language: "html",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML</title>
</head>
<body>
    <div class="container">
        <h1>Welcome to my website</h1>
        <p>This is a sample HTML document.</p>
    </div>
</body>
</html>`,
    title: "HTML Document Structure",
  },
  {
    id: 5,
    language: "css",
    code: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin: 1rem 0;
}`,
    title: "CSS Styling",
  },
  {
    id: 6,
    language: "jsx",
    code: `import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <div>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;`,
    title: "React Todo App",
  },
];

export default function MultipleInstancesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Multiple Prism Highlighter Instances
          </h1>
          <p className="text-lg text-gray-600">
            This page demonstrates efficient usage of multiple PrismHighlighter
            components. The centralized configuration ensures CSS and themes are
            loaded only once.
          </p>
        </div>

        <div className="grid gap-6">
          {codeSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-100 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {snippet.title}
                </h2>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full uppercase">
                  {snippet.language}
                </span>
              </div>
              <div className="p-6">
                <PrismHighlighter
                  code={snippet.code}
                  language={snippet.language}
                  showLineNumbers={true}
                  className="max-h-96 overflow-y-auto"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Performance Benefits
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>
              • <strong>Single CSS Load:</strong> Theme and line number styles
              are loaded once globally
            </li>
            <li>
              • <strong>Language Caching:</strong> Common languages are
              pre-loaded and cached
            </li>
            <li>
              • <strong>Efficient Re-renders:</strong> Each component only
              highlights its own element
            </li>
            <li>
              • <strong>No Redundant Imports:</strong> Languages and plugins are
              loaded once per session
            </li>
            <li>
              • <strong>Optimized for Maps:</strong> Perfect for rendering code
              snippets from database queries
            </li>
          </ul>
        </div>

        <div className="mt-8 p-6 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-3">
            Usage Example
          </h3>
          <PrismHighlighter
            code={`// Example: Rendering code snippets from database
const codeSnippets = await fetchSnippetsFromDB();

return (
  <div>
    {codeSnippets.map(snippet => (
      <PrismHighlighter
        key={snippet.id}
        code={snippet.code}
        language={snippet.language}
        showLineNumbers={true}
      />
    ))}
  </div>
);`}
            language="jsx"
            showLineNumbers={true}
          />
        </div>
      </div>
    </div>
  );
}
