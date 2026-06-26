# 🚀 Deploy to Render - Permanent Public URL

## 📋 Steps to Deploy

### Step 1: Go to Render
1. Visit: https://render.com
2. Sign up or login with GitHub
3. Click **"New +"** → **"Web Service"**

### Step 2: Connect GitHub Repository
1. Select **"Build and deploy from a Git repository"**
2. Click **"Connect account"** to authorize GitHub
3. Find and select: **bpo-address-capture**
4. Click **"Connect"**

### Step 3: Configure Deployment
- **Name**: `bpo-address-capture`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: Free (or Paid if you want)

### Step 4: Add Environment Variables
Click **"Add Environment Variable"**:
- `NODE_ENV` = `production`
- `PORT` = `3000`

### Step 5: Deploy
Click **"Create Web Service"**

Render will automatically deploy from your GitHub repo!

---

## ✅ Your Permanent URL Will Be:

After deployment completes (5-10 minutes), you'll get:

```
https://bpo-address-capture.onrender.com
```

---

## 📍 Live Links

- **Main Portal**: `https://bpo-address-capture.onrender.com`
- **Agent Portal**: `https://bpo-address-capture.onrender.com/agent`
- **Admin Dashboard**: `https://bpo-address-capture.onrender.com/admin`

---

## 🔄 Auto Redeploy

Any push to GitHub `main` branch will automatically redeploy!

---

## 💡 Features

✅ Free tier available  
✅ Auto deploys from GitHub  
✅ Permanent public URL  
✅ 24/7 uptime  
✅ All your Agent + Admin features working  

