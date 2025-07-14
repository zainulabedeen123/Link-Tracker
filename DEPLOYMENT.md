# Link Tracker - Coolify Deployment Guide

## Prerequisites
- Coolify instance running on your Hostinger VPS
- GitHub repository access (make repository public or configure GitHub token)
- Clerk account with publishable key

## 🚨 Fix GitHub Access Issue

The error `fatal: could not read Username for 'https://github.com'` means Coolify can't access your repository.

### Option 1: Make Repository Public (Recommended)
1. Go to https://github.com/zainulabedeen123/Link-Tracker
2. Settings → Danger Zone → Change repository visibility → Make public

### Option 2: Configure GitHub Token
1. In Coolify: Sources → Add GitHub account
2. Generate Personal Access Token with repo permissions

## Deployment Steps

### 1. Environment Variables
Set the following environment variables in Coolify:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y3V0ZS10dXJ0bGUtMjYuY2xlcmsuYWNjb3VudHMuZGV2JA
```

### 2. Coolify Configuration (Nixpacks)
- **Build Pack**: Nixpacks
- **Build Command**: `npm run build` (auto-detected)
- **Start Command**: `npm start` (auto-detected)
- **Port**: 3000 (or auto-detected from $PORT)
- **Health Check**: `/` (root path)

### 3. Nixpacks Configuration
The project includes:
- `nixpacks.toml` - Nixpacks build configuration
- `server.js` - Express server for production
- Automatic Node.js 18 detection

### 4. Build Process (Nixpacks)
1. Install dependencies with `npm ci`
2. Build React app with `npm run build`
3. Serve with Express server on $PORT

### 5. Features Included
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ Security headers
- ✅ SPA routing support
- ✅ Optimized for production

## Troubleshooting

### Build Issues
- Ensure all environment variables are set
- Check Node.js version compatibility (18+)
- Verify Clerk publishable key format

### Runtime Issues
- Check container logs in Coolify
- Verify port 80 is accessible
- Ensure domain/subdomain is properly configured

## Local Testing
```bash
# Build and test locally
docker build -t link-tracker .
docker run -p 3000:80 link-tracker
```

Visit `http://localhost:3000` to test the deployment.
