# Deployment Guide

Stack: Angular 19 frontend + Node/Express backend + MongoDB Atlas

All free to deploy — $0/month using free tiers.

---

## Step 1 — Set up MongoDB Atlas (database)

1. Go to https://cloud.mongodb.com and create a free account
2. Create a free M0 cluster (any region is fine)
3. Go to Database Access and add a database user with a username and password
4. Go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Click Connect → Drivers → copy the connection string
   - Should look like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mtnConnect`

---

## Step 2 — Deploy the backend to Render

1. Push the project to GitHub if you haven't already
2. Go to https://render.com and sign up with GitHub
3. Click New → Web Service
4. Connect your GitHub repo
5. Fill in:
   - Root Directory: `mtnConnect/backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Add these environment variables:
   ```
   MONGO_URI       = (connection string from Step 1)
   JWT_SECRET      = (random 64-char string — run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   ADMIN_USERNAME  = admin
   ADMIN_PASSWORD  = (pick a strong password)
   FRONTEND_URL    = (your Netlify URL — add this after Step 3)
   ```
7. Click Deploy Web Service
8. Copy your Render URL (something like `https://mtn-connect-api.onrender.com`)

> Note: The free tier on Render sleeps after 15 minutes of no traffic. First request after sleeping takes around 30 seconds to wake up. Upgrade to paid ($7/mo) if that's a problem.

---

## Step 3 — Build and deploy the frontend to Netlify

### Update the API URL first

Open `mtnConnect/src/environments/environment.prod.ts` and swap in your Render URL:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR-RENDER-URL.onrender.com/api',
};
```

### Build it

```bash
cd mtnConnect
npm install
ng build
```

This creates a `dist/mtn-connect/browser/` folder.

### Deploy to Netlify

Option A (easiest) — drag and drop:
1. Go to https://netlify.com and sign up
2. Drag the `dist/mtn-connect/browser/` folder onto the Netlify dashboard
3. You'll get a URL like `https://mtn-connect-xxxx.netlify.app`

Option B — Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --dir=dist/mtn-connect/browser --prod
```

### Fix page refresh 404s

Angular handles routing on the client side, so refreshing a page will 404 without this fix.

Create `mtnConnect/public/_redirects` with:
```
/*    /index.html    200
```

Then rebuild and redeploy.

---

## Step 4 — Update CORS on the backend

Go back to Render and update the `FRONTEND_URL` environment variable with your Netlify URL:
```
FRONTEND_URL = https://your-app.netlify.app
```

Render restarts automatically when you save.

---

## Running locally

Start the backend:
```bash
cd mtnConnect/backend
cp .env.example .env
# fill in your MongoDB URI and other secrets in .env
npm install
npm run dev
```

Start the frontend (separate terminal):
```bash
cd mtnConnect
ng serve
```

Open http://localhost:4200

---

## Admin login

1. Go to `/login`
2. Use the `ADMIN_USERNAME` and `ADMIN_PASSWORD` from your `.env`
3. Should redirect to `/attendees` on success

---

## Adding test events (optional)

With the backend running, use curl or Postman to seed some events:

```bash
# Log in to get a token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}'

# Create an event (replace TOKEN with the token above)
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Forklift Training Orientation","date":"2026-05-17","trainingType":"Forklift"}'
```
