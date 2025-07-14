#!/bin/bash

# Build script that ensures environment variables are available during build

echo "=== Build Environment Check ==="
echo "NODE_ENV: $NODE_ENV"
echo "VITE_CLERK_PUBLISHABLE_KEY: ${VITE_CLERK_PUBLISHABLE_KEY:0:20}..."

# If VITE_CLERK_PUBLISHABLE_KEY is not set, try to get it from other sources
if [ -z "$VITE_CLERK_PUBLISHABLE_KEY" ]; then
    echo "Warning: VITE_CLERK_PUBLISHABLE_KEY not found in environment"
    echo "Available environment variables:"
    env | grep -E "(VITE_|CLERK_)" || echo "No VITE_ or CLERK_ variables found"
fi

# Run the build
echo "=== Starting Build ==="
npm run build

echo "=== Build Complete ==="
