#!/bin/bash

echo "🔧 Fixing Next.js dev server issues..."

# Clear Next.js cache
echo "1. Clearing .next directory..."
rm -rf .next

# Clear node_modules cache (optional, uncomment if needed)
# echo "2. Clearing node_modules..."
# rm -rf node_modules
# npm install

# Clear npm cache
echo "2. Clearing npm cache..."
npm cache clean --force

echo "✅ Done! Now run: npm run dev"
echo ""
echo "If issues persist, try:"
echo "  1. Stop the dev server (Ctrl+C)"
echo "  2. Run: rm -rf .next node_modules/.cache"
echo "  3. Run: npm run dev"


