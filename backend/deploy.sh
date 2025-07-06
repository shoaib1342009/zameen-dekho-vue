#!/bin/bash

echo "🚀 Zameen Dekho Backend Deployment Script"
echo "=========================================="

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version must be 16 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the project
echo "🔨 Building the project..."
npm run build

# Create logs directory
mkdir -p logs

# Create data directory
mkdir -p data

# Set production environment variables
if [ ! -f .env ]; then
    echo "📝 Creating production environment file..."
    cat > .env << EOF
PORT=3001
NODE_ENV=production
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://yourdomain.com
UPLOAD_MAX_SIZE=10485760
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
EOF
    echo "⚠️  Please update CORS_ORIGIN in .env file with your domain!"
fi

# Make the script executable
chmod +x deploy.sh

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🚀 To start the server:"
echo "   npm start"
echo ""
echo "📖 API Documentation will be available at:"
echo "   http://localhost:3001/api"
echo ""
echo "💚 Health Check:"
echo "   http://localhost:3001/health"
echo ""
echo "📝 Don't forget to:"
echo "   1. Update CORS_ORIGIN in .env file with your domain"
echo "   2. Update JWT_SECRET with a secure key"
echo "   3. Configure your web server to proxy requests to port 3001"
echo ""