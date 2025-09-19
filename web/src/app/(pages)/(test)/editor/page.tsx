"use client";

import CodeEditor from "@/components/CodeEditor";
import { type SupportedLanguage } from "@/schemas/codeEditorFormSchema";
import React, { useState } from "react";

const EditorPage = () => {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    console.log("Code changed:", newCode);
  };

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    console.log("Language changed:", newLanguage);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Code Editor Test</h1>
      <CodeEditor onSubmit={handleFormSubmit} />
    </div>
  );
};

export default EditorPage;
