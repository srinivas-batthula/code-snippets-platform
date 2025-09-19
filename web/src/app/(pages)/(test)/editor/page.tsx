"use client";

import MonacoEditor, { SupportedLanguage } from "@/components/MonacoEditor";
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

  return (
    <div>
      <MonacoEditor
        initialLanguage="typescript"
        // initialCode="// Welcome to the Monaco Editor!\nconsole.log('Hello, TypeScript!');"
        height="500px"
        onCodeChange={handleCodeChange}
        onLanguageChange={handleLanguageChange}
        showLanguageSelector={true}
        showFontControls={false}
        readOnly={false}
      />
    </div>
  );
};

export default EditorPage;
