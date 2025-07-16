# Coolify Persistent Storage Setup

This guide explains how to set up persistent storage for your Link Tracker application on Coolify to prevent data loss during deployments.

## Problem
By default, SQLite database is stored inside the container and gets deleted on each deployment, causing all links and analytics data to be lost.

## Solution
Configure persistent storage using Docker volumes to maintain data across deployments.

## Setup Instructions

### 1. Environment Variables
In your Coolify application settings, add the following environment variable:

```
DATA_DIR=/app/data
```

### 2. Persistent Storage Configuration

#### Option A: Using Coolify UI (Recommended)
1. Go to your application in Coolify
2. Navigate to "Storage" tab
3. Add a new volume:
   - **Source**: `trackerr_data` (volume name)
   - **Destination**: `/app/data` (container path)
   - **Type**: Volume

#### Option B: Using Docker Compose
If deploying via docker-compose, the configuration is already included:

```yaml
volumes:
  - trackerr_data:/app/data

volumes:
  trackerr_data:
    driver: local
```

### 3. Verify Setup
After deployment:
1. Create some test links
2. Deploy again
3. Check if links still exist

## Database Location
- **Container Path**: `/app/data/trackerr.db`
- **Volume Name**: `trackerr_data`
- **Environment Variable**: `DATA_DIR=/app/data`

## Benefits
✅ **Data Persistence**: Links and analytics survive deployments
✅ **Zero Downtime**: No data migration needed
✅ **Automatic Backups**: Volume can be backed up separately
✅ **Scalability**: Easy to migrate to external database later

## Troubleshooting

### Data Still Lost After Setup
1. Verify the volume is properly mounted: `docker exec -it <container> ls -la /app/data`
2. Check environment variable: `docker exec -it <container> env | grep DATA_DIR`
3. Verify database file exists: `docker exec -it <container> ls -la /app/data/trackerr.db`

### Migration from Existing Deployment
If you already have data you want to preserve:
1. Export existing data before setting up persistent storage
2. Set up persistent storage
3. Import data to new persistent location

### Volume Backup
To backup your data:
```bash
docker run --rm -v trackerr_data:/data -v $(pwd):/backup alpine tar czf /backup/trackerr_backup.tar.gz -C /data .
```

To restore from backup:
```bash
docker run --rm -v trackerr_data:/data -v $(pwd):/backup alpine tar xzf /backup/trackerr_backup.tar.gz -C /data
```

## Future Considerations
For production environments, consider:
- **External Database**: PostgreSQL or MySQL for better performance
- **Regular Backups**: Automated backup strategy
- **Monitoring**: Database health monitoring
- **Scaling**: Read replicas for high traffic

## Support
If you encounter issues:
1. Check Coolify logs for volume mounting errors
2. Verify container has write permissions to `/app/data`
3. Ensure sufficient disk space on host system
