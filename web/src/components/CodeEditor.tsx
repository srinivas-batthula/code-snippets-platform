"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "./ui/combobox";
import type { ComboboxOption } from "./ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import MonacoEditor from "@/components/MonacoEditor";
import {
  codeEditorFormSchema,
  type CodeEditorFormData,
  type SupportedLanguage,
} from "@/schemas/codeEditorFormSchema";
import axios from "axios";

interface CodeEditorProps {
  /** Initial form data */
  initialData?: Partial<CodeEditorFormData>;
  /** Callback when form is submitted */
  onSubmit?: (data: CodeEditorFormData) => void | Promise<void>;
  /** Whether the form is in loading/submitting state */
  isLoading?: boolean;
  /** Custom CSS class for the container */
  className?: string;
}

export default function CodeEditor({
  initialData,
  onSubmit,
  isLoading = false,
  className = "",
}: CodeEditorProps) {
  const [fontSize, setFontSize] = useState<number>(14);
  const [tagInput, setTagInput] = useState<string>("");
  const [isDefaultCode, setIsDefaultCode] = useState<boolean>(true); // Track if current code is default

  // Helper function to get default code for a language
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
      css: `/* CSS Example */\nbody {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n    color: #333;\n}\n\nh1 {\n    color: #007bff;\n}`,
      json: `{\n  "name": "example",\n  "version": "1.0.0",\n  "description": "A sample JSON file",\n  "keywords": ["json", "example"],\n  "author": "Developer"\n}`,
      markdown: `# Markdown Example\n\nThis is a **bold** text and this is *italic*.\n\n## Code Block\n\n\`\`\`javascript\nconsole.log('Hello World!');\n\`\`\`\n\n- List item 1\n- List item 2`,
    };
    return samples[lang] || "// Type your code here";
  };

  const form = useForm<CodeEditorFormData>({
    resolver: zodResolver(codeEditorFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      tags: initialData?.tags || [],
      code: initialData?.code || getDefaultCode("javascript"),
      language: initialData?.language || "javascript",
    },
  });

  // Set initial default code flag
  React.useEffect(() => {
    if (!initialData?.code) {
      setIsDefaultCode(true);
    } else {
      setIsDefaultCode(false);
    }
  }, [initialData?.code]);

  const languageOptions: ComboboxOption[] = [
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

  const fontSizeOptions = [
    { value: "8", label: "8px" },
    { value: "10", label: "10px" },
    { value: "12", label: "12px" },
    { value: "14", label: "14px" },
    { value: "16", label: "16px" },
    { value: "18", label: "18px" },
    { value: "20", label: "20px" },
    { value: "22", label: "22px" },
    { value: "24", label: "24px" },
    { value: "26", label: "26px" },
    { value: "28", label: "28px" },
    { value: "30", label: "30px" },
    { value: "32", label: "32px" },
  ];

  const handleFormSubmit = async (data: CodeEditorFormData) => {
    try {
      const response = await axios.post("/api/snippets/upload", data);

      console.log("Form submitted:", data);
      console.log("data:", response.data);
    } catch (error) {
      // const axiosError = error as AxiosError<ApiResponse>;
      console.error("Error submitting form:", error);
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    const currentTags = form.getValues("tags");
    if (currentTags.includes(trimmedTag)) {
      setTagInput("");
      return;
    }

    if (currentTags.length >= 10) {
      form.setError("tags", {
        message: "Cannot have more than 10 tags",
      });
      return;
    }

    form.setValue("tags", [...currentTags, trimmedTag], {
      shouldValidate: true,
    });
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
      { shouldValidate: true },
    );
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // Handle language change to load default code
  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    // Always load new default code when language changes
    // This ensures the code sample updates immediately
    const newCode = getDefaultCode(newLanguage);
    form.setValue("code", newCode, { shouldValidate: true });
    setIsDefaultCode(true);
  };

  // Handle code changes from Monaco Editor
  const handleCodeChange = (newCode: string) => {
    // Check if the new code is different from the current default for this language
    const currentLanguage = form.getValues("language");
    const defaultCode = getDefaultCode(currentLanguage);

    // If code is different from default and not empty, mark as custom
    if (newCode !== defaultCode && newCode.trim() !== "") {
      setIsDefaultCode(false);
    } else if (newCode === defaultCode) {
      setIsDefaultCode(true);
    }

    return newCode;
  };
  return (
    <div className={`space-y-6 ${className}`}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-6 max-w-md w-full">
              {/* Title Field */}
              <div className="flex flex-row gap-4 w-full ">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Programming Language</FormLabel>
                      <FormControl>
                        <Combobox
                          options={languageOptions}
                          value={field.value}
                          onValueChange={(value: string) => {
                            const newLanguage = value as SupportedLanguage;
                            field.onChange(value);
                            handleLanguageChange(newLanguage);
                          }}
                          placeholder="Select programming language..."
                          searchPlaceholder="Search languages..."
                          disabled={isLoading}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Font Size Controls */}
                <div className="space-y-2">
                  <div className="flex flex-col gap-2">
                    <FormLabel>Font Size</FormLabel>
                    <Select
                      value={fontSize.toString()}
                      onValueChange={(value) => setFontSize(Number(value))}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-fit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter snippet title..."
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        rows={4}
                        placeholder="Describe what this code snippet does..."
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Language Selection and Font Size Row */}

              {/* Tags Field */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagInputKeyDown}
                          disabled={isLoading}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="default"
                          onClick={addTag}
                          disabled={isLoading || !tagInput.trim()}
                        >
                          Add
                        </Button>
                      </div>
                      {field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((tag, index) => (
                            <span
                              key={`${tag}-${index}`}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                disabled={isLoading}
                                className="text-secondary-foreground/60 hover:text-secondary-foreground"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit Button */}

              <div className="flex justify-end space-x-2 ">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Snippet"}
                </Button>
              </div>
            </div>

            {/* Right Column - Code Editor */}
            <div className="space-y-4 w-full ">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="border border-input rounded-md overflow-hidden">
                        <MonacoEditor
                          initialLanguage={form.watch("language")}
                          initialCode={field.value || undefined}
                          initialFontSize={fontSize}
                          height="500px"
                          showLanguageSelector={false}
                          showFontControls={false}
                          onCodeChange={(newCode: string) => {
                            handleCodeChange(newCode);
                            field.onChange(newCode);
                          }}
                          readOnly={isLoading}
                          className="border-0 bg-transparent"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
