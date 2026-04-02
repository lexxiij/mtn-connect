# MeetTheNeedConnects — Deployment Guide

**Stack:** Angular 19 (frontend) + Node/Express (backend) + MongoDB Atlas

**Cost:** $0/month to launch (free tiers on all platforms)

---

## Step 1 — Set up MongoDB Atlas (database)

1. Go to https://cloud.mongodb.com and create a free account
2. Create a **free M0 cluster** (choose any region)
3. Under **Database Access** → Add a database user with username & password
4. Under **Network Access** → Add IP Address → click **Allow Access from Anywhere** (0.0.0.0/0)
5. Click **Connect** → **Drivers** → copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mtnConnect`

---

## Step 2 — Deploy the Express backend to Render (free)

1. Push your project to GitHub (if not already there)
2. Go to https://render.com and sign up with your GitHub account
3. Click **New** → **Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Root Directory:** `mtnConnect/backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
6. Under **Environment Variables**, add:
   ```
   MONGO_URI       = (your Atlas connection string from Step 1)
   JWT_SECRET      = (a random 64-char string — run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   ADMIN_USERNAME  = admin
   ADMIN_PASSWORD  = (choose a strong password)
   FRONTEND_URL    = (your Netlify URL from Step 3 — add this after deploying frontend)
   ```
7. Click **Deploy Web Service**
8. Copy your Render URL — it looks like `https://mtn-connect-api.onrender.com`

> ⚠️ **Free tier note:** Render free services sleep after 15 minutes of inactivity.
> The first request after sleeping takes ~30 seconds. Upgrade to paid ($7/mo) if you need always-on.

---

## Step 3 — Build and deploy the Angular frontend to Netlify (free)

### First — update the production API URL

Open `mtnConnect/src/environments/environment.prod.ts` and replace the apiUrl:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR-ACTUAL-RENDER-URL.onrender.com/api',  // ← your Render URL + /api
};
```

### Build the Angular app

```bash
cd mtnConnect
npm install
ng build
```

This creates a `dist/mtn-connect/browser/` folder.

### Deploy to Netlify

**Option A — Drag and Drop (easiest):**
1. Go to https://netlify.com → sign up
2. Drag the `dist/mtn-connect/browser/` folder onto the Netlify dashboard
3. Done! You'll get a URL like `https://mtn-connect-xxxx.netlify.app`

**Option B — Netlify CLI:**
```bash
npm install -g netlify-cli
netlify deploy --dir=dist/mtn-connect/browser --prod
```

### Fix Angular routing on Netlify
Angular uses client-side routing. Without this fix, refreshing any page shows a 404.

Create a file at `mtnConnect/public/_redirects` with this content:
```
/*    /index.html    200
```

Then rebuild and redeploy.

---

## Step 4 — Update CORS on the backend

After you have your Netlify URL, go back to Render and update the `FRONTEND_URL` environment variable:
```
FRONTEND_URL = https://your-app.netlify.app
```

Render will restart the server automatically.

---

## Running locally (development)

### Start the backend:
```bash
cd mtnConnect/backend
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and secrets
npm install
npm run dev    # uses nodemon for auto-restart on file changes
```

### Start the Angular frontend (separate terminal):
```bash
cd mtnConnect
ng serve
```

Open http://localhost:4200

---

## How to log in to admin

1. Navigate to `/login`
2. Use the `ADMIN_USERNAME` and `ADMIN_PASSWORD` you set in your `.env`
3. You'll be redirected to `/attendees` on success

---

## Seed some events (optional)

After the backend is running, you can use curl or Postman to add events:

```bash
# First log in to get a token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}'

# Then create an event (replace TOKEN with the token from above)
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Forklift Training Orientation","date":"2026-05-17","trainingType":"Forklift"}'
```
