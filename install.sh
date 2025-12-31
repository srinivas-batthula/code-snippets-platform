#!/bin/bash

#########  To run this `script`, 'bash ./install.sh'...

echo "Installing dependencies for web and extension..."

# Navigate to web and install
if [ -d "web" ]; then
    echo "Installing 'web' dependencies..."
    cd web || exit
    npm install
    cd ..
else
    echo "❌ 'web' folder not found!"
fi

# Navigate to extension and install
if [ -d "extension" ]; then
    echo "Installing 'extension' dependencies..."
    cd extension || exit
    npm install
    cd ..
else
    echo "❌ 'extension' folder not found!"
fi

echo "✅ All dependencies installed!"