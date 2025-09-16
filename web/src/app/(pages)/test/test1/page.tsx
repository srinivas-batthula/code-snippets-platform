import { jsxCodeSample } from "@/codeSamples/jsx";
import PrismHighlighter from "@/components/PrismHighlighter";
import React from "react";

const page = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        PrismHighlighter with Copy Button
      </h1>

      {/* With copy button and line numbers */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          With Copy Button & Line Numbers
        </h2>
        <PrismHighlighter
          code={jsxCodeSample}
          language="jsx"
          showLineNumbers={true}
          showCopyButton={true}
        />
      </div>

      {/* Without copy button */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Without Copy Button</h2>
        <PrismHighlighter
          code={jsxCodeSample}
          language="jsx"
          showLineNumbers={true}
          showCopyButton={false}
        />
      </div>
    </div>
  );
};

export default page;
