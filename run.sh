#!/bin/bash

set -e

# ─────────────────────────────────────────────
# Detect OS and install make if not found
# ─────────────────────────────────────────────

# Add GnuWin32 to PATH for Windows Git Bash
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    export PATH=$PATH:"/c/Program Files (x86)/GnuWin32/bin"
    # Make it permanent in .bashrc
    if ! grep -q "GnuWin32" ~/.bashrc 2>/dev/null; then
        echo 'export PATH=$PATH:"/c/Program Files (x86)/GnuWin32/bin"' >> ~/.bashrc
    fi
fi

if ! command -v make &> /dev/null; then
    echo "→ make not found. Installing..."

    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update -y && sudo apt-get install -y make

    elif [[ "$OSTYPE" == "darwin"* ]]; then
        xcode-select --install 2>/dev/null || true

    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        if command -v winget &> /dev/null; then
            winget install GnuWin32.Make
            export PATH=$PATH:"/c/Program Files (x86)/GnuWin32/bin"
        elif command -v choco &> /dev/null; then
            choco install make -y
        else
            echo "  Could not install make automatically on Windows."
            echo "  Please run: winget install GnuWin32.Make"
            exit 1
        fi

    else
        echo "  Unknown OS. Please install make manually."
        exit 1
    fi

    echo "→ make installed successfully."
fi

# ─────────────────────────────────────────────
# Run setup
# ─────────────────────────────────────────────
make setup