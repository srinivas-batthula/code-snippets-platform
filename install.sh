#!/bin/bash

######### To run this script:
# bash ./install.sh

echo "Installing dependencies for web and extension..."

# -------- EXTENSION --------
if [ -d "extension" ]; then
    echo "Installing 'extension' dependencies..."
    cd extension || exit
    npm install

    echo "Compiling VSCode extension..."
    npm run compile
    cd ..
else
    echo "❌ 'extension' folder not found!"
fi

# -------- WEB (Next.js) --------
if [ -d "web" ]; then
    echo "Installing 'web' dependencies..."
    cd web || exit
    npm install

    echo "Starting Next.js server..."
    echo "Press Ctrl+C to stop."
    npm run dev
else
    echo "❌ 'web' folder not found!"
fi

echo "✅ All tasks completed!"
