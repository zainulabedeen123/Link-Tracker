# Link Tracker - Coolify Deployment Guide

## Prerequisites
- Coolify instance running on your Hostinger VPS
- GitHub repository access
- Clerk account with publishable key

## Deployment Steps

### 1. Environment Variables
Set the following environment variables in Coolify:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

### 2. Coolify Configuration
- **Build Command**: `npm run build`
- **Start Command**: Not needed (uses Dockerfile)
- **Port**: 80 (internal container port)
- **Health Check**: `/` (root path)

### 3. Docker Configuration
The project includes:
- `Dockerfile` - Multi-stage build with Nginx
- `nginx.conf` - Optimized Nginx configuration
- `.dockerignore` - Build optimization

### 4. Build Process
1. Install dependencies with `npm ci`
2. Build React app with `npm run build`
3. Serve with Nginx on port 80

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
