#!/bin/bash

# Health Predictor Deployment Script for Vercel

echo "🚀 Deploying Health Predictor to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Set environment variables for production
echo "🔧 Setting up environment variables..."

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "🔗 Don't forget to:"
echo "  1. Update your environment variables in Vercel dashboard"
echo "  2. Set your production domain in NEXTAUTH_URL"
echo "  3. Update CORS origins in your FastAPI settings"
echo ""
echo "🌐 Your app should be available at: https://your-app-name.vercel.app"