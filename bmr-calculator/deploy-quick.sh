#!/bin/bash

# Quick Deployment Script for BodyMetrics Pro
# This script builds the project and prepares it for deployment

echo "🚀 BodyMetrics Pro - Quick Deployment"
echo "======================================"
echo ""

# Step 1: Clean previous build
echo "📦 Step 1/4: Cleaning previous build..."
rm -rf dist/
echo "✅ Clean complete"
echo ""

# Step 2: Install dependencies (if needed)
if [ ! -d "node_modules" ]; then
  echo "📥 Step 2/4: Installing dependencies..."
  npm install
else
  echo "⏭️  Step 2/4: Dependencies already installed"
fi
echo ""

# Step 3: Build project
echo "🔨 Step 3/4: Building project..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed! Please check errors above."
  exit 1
fi
echo "✅ Build complete"
echo ""

# Step 4: Verify logos
echo "🖼️  Step 4/4: Verifying logos..."
if [ -f "dist/logos/instytut-dietcoachingu.jpg" ] && [ -f "dist/logos/poradnia.jpg" ]; then
  echo "✅ Both logos found in dist/logos/"
else
  echo "⚠️  Warning: Logos not found in dist/logos/"
fi
echo ""

echo "=========================================="
echo "✅ Build complete! Ready for deployment"
echo "=========================================="
echo ""
echo "📁 Build output: ./dist/"
echo ""
echo "🚀 Deployment options:"
echo ""
echo "1️⃣  NETLIFY DROP (Easiest - Recommended):"
echo "   → Open: https://app.netlify.com/drop"
echo "   → Drag and drop the 'dist' folder"
echo ""
echo "2️⃣  VERCEL:"
echo "   → npm i -g vercel"
echo "   → vercel"
echo ""
echo "3️⃣  GITHUB PAGES:"
echo "   → npm install --save-dev gh-pages"
echo "   → Add 'deploy' script to package.json"
echo "   → npm run deploy"
echo ""
echo "4️⃣  YOUR SERVER (VPS):"
echo "   → scp -r dist/* user@server:/var/www/bodymetrics-pro/"
echo ""
echo "📖 Full deployment guide: See DEPLOYMENT.md"
echo ""
