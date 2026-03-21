# Render.com Deployment Guide for SIET Connect

## Prerequisites
1. GitHub repository pushed (✓ Done)
2. Render.com account (free tier available)
3. MongoDB Atlas account (for database)
4. Upstash account (for Redis)

## Step 1: Create Render.com Account
- Go to https://render.com
- Sign up with GitHub account for easy deployment

## Step 2: Set Up External Services

### MongoDB (for main database)
1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string: `<your-mongodb-connection-string>`

### Upstash (for Redis - already configured in your project)
1. Go to https://upstash.com
2. Create free Redis instance
3. Copy:
   - `UPSTASH_REDIS_URL`
   - `UPSTASH_REDIS_TOKEN`

## Step 3: Deploy Using render.yaml

### Option A: Deploy from GitHub (Recommended)
1. Go to Render Dashboard: https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Select `render.yaml` file
5. Configure environment variables (see Step 4)
6. Click "Deploy"

### Option B: Manual Deploy
1. Dashboard → "New +" → "Web Service"
2. Select GitHub repository
3. Fill in:
   - **Name**: `siet-connect-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Add environment variables
5. Deploy

## Step 4: Environment Variables

Add these in Render Dashboard under Environment Variables:

**Backend:**
```
NODE_ENV=production
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=your_jwt_secret_key_here
UPSTASH_REDIS_URL=your_upstash_redis_url
UPSTASH_REDIS_TOKEN=your_upstash_token
FRONTEND_URL=https://your-frontend.onrender.com
```

**Frontend:**
```
VITE_API_URL=https://siet-connect-backend.onrender.com/api
```

## Step 5: Database Migration (if needed)
1. Connect to MongoDB Atlas
2. Create collections or run seed scripts if applicable

## Step 6: Verify Deployment
- Check Backend: `https://siet-connect-backend.onrender.com/api/health`
- Check Frontend: `https://siet-connect-frontend.onrender.com`
- Check logs in Render Dashboard for errors

## Troubleshooting

### Cold Starts
- Free tier services spin down after 15 mins of inactivity
- First request takes 30 seconds - use a monitoring service to keep it warm

### Build Failures
- Check logs in Render Dashboard
- Ensure all dependencies in package.json are correct
- Verify Node version compatibility

### Database Connection Issues
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Render)
- Test connection string locally first

### Port Issues
- Render uses dynamic ports - ensure your backend uses `process.env.PORT || 3000`

## Updating Deployment
1. Push changes to GitHub
2. Render automatically redeploys (if connected)
3. Or manually trigger from Dashboard

## Cost Notes
- **Free Tier**: 750 hours/month (enough for 1 service running continuously)
- **Multiple services**: Use paid tier or split services across accounts
- Consider upgrading as you grow

## Next Steps
1. Push this render.yaml to GitHub
2. Create Render account
3. Set up MongoDB and Upstash
4. Deploy via Blueprint
5. Monitor application health
