// src/app/page.tsx
'use client'; // Needed for client-side interactivity

import React from 'react';

const Page = () => {
  const openInVSCode = () => {
    const start = Date.now();

    window.location.href = 'vscode://srinivas-batthula.codesnippets/intro'; // Try to `run command` in the extension via 'URI-handler' (in VSCode app)...

    setTimeout(() => { // Fallback-1: Open the `extension-page` in VSCode's Extensions-tab (if extension is not installed by user)...
      const elapsed = Date.now() - start;
      if (elapsed < 600) {
        window.location.href = 'vscode:extension/srinivas-batthula.codesnippets';
      }
    }, 500);

    setTimeout(() => { // Fallback-2: Open `marketplace-page` in browser (If user doesn't even has VSCode App in his device)...
      const elapsed = Date.now() - start;
      if (elapsed < 1200) {
        window.location.href =
          'https://marketplace.visualstudio.com/items?itemName=srinivas-batthula.codesnippets';
      }
    }, 1000);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div>page</div>
      <br />
      <button
        onClick={openInVSCode}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
          borderRadius: '5px',
        }}
      >
        Open Extension in VSCode
      </button>
    </div>
  );
};

export default Page;