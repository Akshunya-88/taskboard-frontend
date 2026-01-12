---
description: Deploy TaskBoard Frontend to Vercel
---

# Deploy TaskBoard Frontend to Vercel

This workflow guides you through deploying the TaskBoard frontend application to Vercel.

## Prerequisites
- Vercel account (sign up at [vercel.com](https://vercel.com))
- GitHub account
- Backend deployed on Railway (or another platform)

## Steps

### 1. Ensure Git Repository is Set Up

```bash
cd /Users/akshunya/Desktop/taskboard-frontend
git status
```

If not initialized, run:
```bash
git init
git add .
git commit -m "Initial commit for Vercel deployment"
```

### 2. Push to GitHub

If you haven't already pushed to GitHub:
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/taskboard-frontend.git
git branch -M main
git push -u origin main
```

If already pushed, ensure latest changes are committed:
```bash
git add .
git commit -m "Update for deployment"
git push
```

### 3. Deploy to Vercel via Dashboard

1. Go to [vercel.com](https://vercel.com) and log in with GitHub
2. Click **"Add New Project"** or **"New Project"**
3. **Import** your `taskboard-frontend` repository from GitHub
4. **Configure Project Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4. Add Environment Variables

Before deploying, add environment variables in Vercel:
1. In the project configuration screen, find **Environment Variables** section
2. Add the following variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend.railway.app/api` (replace with your actual Railway backend URL)
   - **Environment**: Select all (Production, Preview, Development)

### 5. Deploy

Click **"Deploy"** button. Vercel will:
- Install dependencies
- Build your Vite app
- Deploy to a URL like `https://your-project.vercel.app`

Wait for the deployment to complete (usually 1-2 minutes).

### 6. Update Backend CORS Settings

After successful deployment:
1. Copy your Vercel deployment URL (e.g., `https://taskboard-frontend.vercel.app`)
2. Go to your Railway backend dashboard
3. Add/update the environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-app.vercel.app` (your actual Vercel URL)
4. Redeploy the backend if needed

### 7. Test Your Deployment

1. Visit your Vercel URL
2. Test the following features:
   - User registration/login
   - Dashboard loads correctly
   - Create, edit, delete tasks
   - Categories management
   - AI suggestions (if implemented)
   - Check browser console for any errors

## Alternative: Deploy via Vercel CLI

If you prefer using the CLI:

### Install Vercel CLI
```bash
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy
// turbo
```bash
cd /Users/akshunya/Desktop/taskboard-frontend
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N** (first time) or **Y** (subsequent)
- What's your project's name? `taskboard-frontend`
- In which directory is your code located? `./`
- Want to override settings? **Y**
- Build Command: `npm run build`
- Output Directory: `dist`
- Development Command: `npm run dev`

### Set Environment Variables via CLI
```bash
vercel env add VITE_API_BASE_URL
```
Enter your backend URL when prompted.

### Deploy to Production
// turbo
```bash
vercel --prod
```

## Troubleshooting

### Issue: API calls failing
- **Check**: Verify `VITE_API_BASE_URL` is set correctly in Vercel dashboard
- **Check**: Ensure the backend URL is accessible and includes `/api` path
- **Fix**: Redeploy after updating environment variables

### Issue: CORS errors in browser console
- **Check**: Backend `FRONTEND_URL` matches your Vercel domain exactly
- **Check**: Backend CORS configuration allows your Vercel domain
- **Fix**: Update backend environment variable and redeploy

### Issue: 404 on page refresh
- **Check**: Ensure `vercel.json` exists with rewrites configuration
- **Fix**: The existing `vercel.json` should handle this, but verify it contains:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

### Issue: Build fails
- **Check**: Run `npm run build` locally to see detailed errors
- **Check**: Ensure all dependencies are in `package.json`
- **Fix**: Fix any build errors locally, commit, and push

### Issue: Environment variables not working
- **Remember**: All Vite environment variables must start with `VITE_`
- **Check**: Environment variables are set for the correct environment (Production/Preview)
- **Fix**: Redeploy after adding/updating environment variables

## Managing Deployments

### View Deployments
Visit your project dashboard at `https://vercel.com/your-username/taskboard-frontend`

### Automatic Deployments
- Each push to `main` branch triggers a production deployment
- Pull requests create preview deployments

### Custom Domain (Optional)
1. Go to project settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Notes

- The `vercel.json` file is already configured for React Router compatibility
- All commits to `main` will trigger automatic deployments
- Preview deployments are created for pull requests
- You can roll back to previous deployments from the Vercel dashboard
