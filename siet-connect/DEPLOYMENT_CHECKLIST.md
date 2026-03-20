# SIET Connect - Render.com Deployment Checklist

## Quick Start (5 minutes)

- [ ] **GitHub**: Push these files to your repo:
  ```bash
  git add render.yaml RENDER_DEPLOYMENT.md .env.example
  git commit -m "Add Render.com deployment configuration"
  git push -u origin main
  ```

- [ ] **Create Accounts**:
  - [ ] Sign up at [render.com](https://render.com)
  - [ ] Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  - [ ] Sign up at [Upstash](https://upstash.com)

- [ ] **Get Credentials**:
  - [ ] MongoDB URI: `mongodb+srv://...`
  - [ ] Upstash Redis URL
  - [ ] Upstash Redis Token

- [ ] **Deploy**:
  1. Go to [Render Dashboard](https://dashboard.render.com)
  2. Click "New +" → "Blueprint"
  3. Connect your GitHub repository
  4. Select the `render.yaml` file
  5. Add environment variables from `.env.example`
  6. Click "Deploy" 🚀

## What Gets Deployed

| Component | Type | Location |
|-----------|------|----------|
| Backend API | Node.js | https://siet-connect-backend.onrender.com/api |
| Frontend | Static Site | https://siet-connect-frontend.onrender.com |
| Database | MongoDB Atlas | (via MONGODB_URI) |
| Cache/Queue | Upstash Redis | (via credentials) |

## Important Environment Variables for Render

```
Backend:
- NODE_ENV=production
- MONGODB_URI=mongodb+srv://...
- JWT_SECRET=<generate a strong secret>
- UPSTASH_REDIS_URL=...
- UPSTASH_REDIS_TOKEN=...
- FRONTEND_URL=https://siet-connect-frontend.onrender.com

Frontend:
- VITE_API_URL=https://siet-connect-backend.onrender.com/api
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check logs in Render Dashboard, verify package.json scripts |
| Backend 502 error | Verify MONGODB_URI and Upstash credentials, check server logs |
| CORS errors | Update FRONTEND_URL and CLIENT_URL env vars correctly |
| Frontend blank page | Ensure VITE_API_URL is correct and backend is running |
| Slow first load | Free tier apps sleep after 15 min - this is normal |

## Free Tier Limits
- 750 hours/month per service
- 100 GB bandwidth/month total
- 1 free PostgreSQL DB (not used here, using MongoDB Atlas)

## Next Steps After Deployment
1. Test API endpoints: `https://siet-connect-backend.onrender.com/api/health`
2. Test frontend: Open main URL and verify pages load
3. Set up custom domain (optional)
4. Monitor logs for errors
5. Enable auto-deploy from GitHub (already configured in render.yaml)

## Additional Resources
- [Render Docs](https://render.com/docs)
- [render.yaml Reference](https://render.com/docs/infrastructure-as-code)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Upstash Docs](https://upstash.com/docs)
