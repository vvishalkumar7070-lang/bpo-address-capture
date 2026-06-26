# 🚀 Render Deployment Guide - BPO Address Capture System

## Step-by-Step Setup (5 minutes)

### 1. **Create Render Account**
   - Go to https://render.com
   - Sign up with your GitHub account (recommended for easy integration)

### 2. **Connect GitHub Repository**
   - Log in to Render Dashboard
   - Click "New +" → "Web Service"
   - Select "Build and deploy from a Git repository"
   - Click "Connect GitHub"
   - Authorize Render to access your GitHub
   - Find and select: `bpo-address-capture`

### 3. **Configure Web Service**

**Basic Information:**
- **Name:** `bpo-address-capture`
- **Region:** Choose closest to your users (e.g., Singapore, Mumbai)
- **Branch:** `main`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Environment:**
- Set `NODE_ENV=production`

**Add Environment Variables:**
```
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/bpo-address-capture
JWT_SECRET=bpo-secret-key-production-2024
RENDER_EXTERNAL_URL=https://bpo-address-capture.onrender.com
```

**Plan:**
- Select "Free" tier to start (2.5 free hours/month)
- Or "Starter" for production ($7/month, always on)

### 4. **Click "Create Web Service"**
   - Render will automatically:
     - Clone your GitHub repo
     - Install dependencies
     - Deploy your application
     - Assign a public URL

### 5. **Monitor Deployment**
   - Watch the logs in real-time
   - Wait for "✓ Build succeeded" and "✓ Service is live"
   - You'll get a URL like: `https://bpo-address-capture.onrender.com`

---

## 🔗 Accessing Your Application

After deployment succeeds:

- **Home Page:** `https://bpo-address-capture.onrender.com`
- **Agent Portal:** `https://bpo-address-capture.onrender.com/agent`
- **Admin Dashboard:** `https://bpo-address-capture.onrender.com/admin`
- **Health Check:** `https://bpo-address-capture.onrender.com/health`

---

## 📊 MongoDB Setup (Optional but Recommended)

### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (Free tier available)
4. Get your connection string
5. Update `.env` with your MongoDB Atlas URI

### Option B: Local MongoDB
1. Install MongoDB locally
2. Use connection string: `mongodb://localhost:27017/bpo-address-capture`

---

## 🔄 Auto-Deployment

Once set up, every time you:
1. Push code to `main` branch on GitHub
2. Render automatically:
   - Detects the push
   - Builds the latest code
   - Deploys to production (no downtime)

---

## 💾 Persistent Data

**Note:** Render's free tier has ephemeral storage. For production:
- Use MongoDB Atlas for data persistence (recommended)
- Connect it via `MONGODB_URI` environment variable

---

## 🆘 Troubleshooting

### "Deploy Failed"
- Check build logs in Render dashboard
- Ensure `package.json` has all dependencies
- Verify `server.js` is in root directory

### "Application not responding"
- Check if PORT is set to `3000` or use `process.env.PORT`
- Verify environment variables are set correctly
- Check Render logs for errors

### "MongoDB connection failed"
- Verify MongoDB URI in `.env` on Render dashboard
- For Atlas: Add Render IP to whitelist (0.0.0.0/0)
- Test connection locally first

---

## 📈 Monitoring

Render provides:
- **Real-time logs** for debugging
- **CPU & Memory usage** monitoring
- **Error tracking** and alerts
- **Deploy history** for rollbacks

---

## 🎯 Next Steps

1. Deploy to Render following this guide
2. Share the public URL with your team
3. Test all three portals (Home, Agent, Admin)
4. Connect MongoDB for data persistence
5. Monitor performance in Render dashboard

---

**Estimated Time:** 5 minutes ⏱️
**Cost:** Free tier available (with limitations)
**Difficulty:** Beginner-friendly ✅

Need help? Check Render docs: https://render.com/docs
