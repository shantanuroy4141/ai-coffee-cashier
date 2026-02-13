#!/bin/bash
cd "$(dirname "$0")"

# Kill anything already on port 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Build and start
echo "Building the app..."
npm run build

echo ""
echo "Starting the server..."
echo ""
echo "=========================================="
echo "  Open this in your browser:"
echo "  http://localhost:3001"
echo "=========================================="
echo ""

PORT=3001 npm run start
