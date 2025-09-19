"use client";

import CodeEditor from "@/components/CodeEditor";
import type { CodeEditorFormData } from "@/schemas/codeEditorFormSchema";

export default function TestEditorPage() {
  const handleSubmit = async (data: CodeEditorFormData) => {
    console.log("Form submitted:", data);
    // Here you would normally send the data to your API
    alert(
      `Code snippet saved!\nTitle: ${data.title}\nLanguage: ${
        data.language
      }\nTags: ${data.tags.join(", ")}`,
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test Code Editor</h1>
        <p className="text-muted-foreground">
          Test the CodeEditor component with React Hook Form integration
        </p>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <CodeEditor
          onSubmit={handleSubmit}
          initialData={{
            title: "Sample Code Snippet",
            description: "A demonstration of the code editor functionality",
            tags: ["demo", "test"],
            language: "javascript",
            code: `// Welcome to the Code Editor!
function greetUser(name) {
  return \`Hello, \${name}! Welcome to our platform!\`;
}

console.log(greetUser("Developer"));`,
          }}
        />
      </div>
    </div>
  );
}
