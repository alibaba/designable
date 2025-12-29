#!/bin/bash
# Script to apply the same TypeScript module fix pattern to all packages

set -e

PACKAGES=(
  "formily/antd-v5"
  "formily/next"
  "formily/setters"
  "formily/transformer"
)

ROOT_DIR="/Users/binhnt/Lab/form-center/designable"

echo "Applying TypeScript module fix to all packages..."

for pkg in "${PACKAGES[@]}"; do
  PKG_DIR="$ROOT_DIR/$pkg"
  
  if [ ! -d "$PKG_DIR" ]; then
    echo "⚠️  Skipping $pkg (directory not found)"
    continue
  fi
  
  echo ""
  echo "Processing $pkg..."
  
  # Create scripts directory if it doesn't exist
  mkdir -p "$PKG_DIR/scripts"
  
  # Copy scripts
  if [ -f "$ROOT_DIR/packages/shared/scripts/remove-js-extensions.js" ]; then
    cp "$ROOT_DIR/packages/shared/scripts/remove-js-extensions.js" "$PKG_DIR/scripts/"
  fi
  if [ -f "$ROOT_DIR/packages/shared/scripts/add-js-extensions.js" ]; then
    cp "$ROOT_DIR/packages/shared/scripts/add-js-extensions.js" "$PKG_DIR/scripts/"
  fi
  
  # Run remove-js-extensions if src directory exists
  if [ -d "$PKG_DIR/src" ] && [ -f "$PKG_DIR/scripts/remove-js-extensions.js" ]; then
    echo "  Removing .js extensions from source files..."
    cd "$PKG_DIR" && node scripts/remove-js-extensions.js
  fi
  
  # Update tsconfig.json if it exists
  if [ -f "$PKG_DIR/tsconfig.json" ]; then
    echo "  Updating tsconfig.json..."
    sed -i.bak 's/"module": "NodeNext"/"module": "ESNext"/' "$PKG_DIR/tsconfig.json"
    sed -i.bak 's/"moduleResolution": "NodeNext"/"moduleResolution": "Bundler"/' "$PKG_DIR/tsconfig.json"
    rm -f "$PKG_DIR/tsconfig.json.bak"
  fi
  
  echo "✓ $pkg processed"
done

echo ""
echo "✓ All packages processed successfully!"
