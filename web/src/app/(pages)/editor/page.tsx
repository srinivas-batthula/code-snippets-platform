"use client";

import CodeEditor from "@/components/CodeEditor";
import React from "react";

const EditorPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Code Editor Test</h1>
      <CodeEditor />
    </div>
  );
};

export default EditorPage;
