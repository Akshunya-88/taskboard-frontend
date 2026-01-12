# TaskBoard Frontend - Vercel Deployment Guide

## Vercel Deployment Instructions

### 1. Prepare Your Repository
```bash
cd /Users/akshunya/Desktop/Task-Manager/taskboard-frontend
git init
git add .
git commit -m "Initial commit for Vercel deployment"
```

### 2. Push to GitHub
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/taskboard-frontend.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your `taskboard-frontend` repository
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4. Add Environment Variables
In Vercel project settings → Environment Variables, add:
- **Name**: `VITE_API_BASE_URL`
- **Value**: `https://your-backend.railway.app/api` (use your Railway backend URL)

### 5. Deploy
Click "Deploy" and Vercel will build and deploy your app.

### 6. Update Backend CORS
After deployment, copy your Vercel URL (e.g., `https://your-app.vercel.app`)

Then update your Railway backend environment variable:
- `FRONTEND_URL` = `https://your-app.vercel.app`

And redeploy the backend.

---

## Testing Your Deployment
1. Visit your Vercel URL
2. Try logging in/signing up
3. Test all features (tasks, categories, dashboard, AI suggestions)

## Troubleshooting
- If API calls fail, check that `VITE_API_BASE_URL` is set correctly
- Check browser console for CORS errors
- Verify backend `FRONTEND_URL` matches your Vercel domain
