# RealEstateBuddy App

Phase 1 implementation: agent auth, dashboard, add homeowner, CSV import with column mapping, and placeholder screens for touchpoints, events, and AVM meter.

## Setup (add your APIs and database last)

1. **Firebase (realestatebuddy2)**
   - Use the **realestatebuddy2** project in [Firebase Console](https://console.firebase.google.com).
   - Project settings (gear) → Your apps → select your Web app → copy the config.
   - Enable **Authentication** → Sign-in method → Email/Password (and Google if using the client ID below).
   - Create a **Firestore** database if needed.
   - Add the config to a `.env` file in this directory:

   ```
   VITE_FIREBASE_API_KEY=<from config>
   VITE_FIREBASE_AUTH_DOMAIN=<from config>
   VITE_FIREBASE_PROJECT_ID=<from config>
   VITE_FIREBASE_STORAGE_BUCKET=<from config>
   VITE_FIREBASE_MESSAGING_SENDER_ID=<from config>
   VITE_FIREBASE_APP_ID=<from config>
   ```
   - For Google Sign-In (optional): use OAuth client `78503199798-qb20mnaofjbd3ii210gq8omo2ou9bmpp.apps.googleusercontent.com` in Firebase Auth → Sign-in method → Google.

   - Deploy Firestore rules (from this repo):
     ```bash
     firebase deploy --only firestore:rules
     ```
     Or copy the contents of `firestore.rules` into the Firebase Console > Firestore > Rules.

2. **CSV column mapping API (optional)**
   - For LLM-assisted column mapping, run the small API server (heuristic mapping works without it):
     ```bash
     npm run server
     ```
   - The Vite dev server proxies `/api` to `http://localhost:3001`. If you add an LLM (e.g. Anthropic), set `ANTHROPIC_API_KEY` in the environment when running the server.

## Run

```bash
cd app
npm install
cp .env.example .env
# Edit .env with your Firebase config (see above)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Sign up, then add homeowners manually or import a CSV.

To run the column-mapping API (for import):
```bash
npm run server
```
Keep it running in a separate terminal while using the import flow, or import will use heuristic mapping only.

## What’s included

- **Auth:** Sign up / Sign in with Firebase Auth. On first signup, an `agents/{uid}` doc and `users/{uid}` doc are created.
- **Dashboard:** Real homeowner count from Firestore; empty state with CTA to import; AVM meter placeholder.
- **Add client:** Form writes to `agents/{agentId}/homeowners`, `properties`, `transactions`, and `auditLogs`.
- **Import:** Upload CSV → parse → map columns (API or heuristic) → confirm → batch write to Firestore; post-import success screen.
- **Touchpoints / Event / AVM meter:** UI wired to Firestore where applicable; “Send” and AVM actions stubbed for Phase 2/3.
- **Firestore rules:** Agent (and future team members via `users/{uid}.agentId`) can read/write only their data.

## Deploy to Vercel (via GitHub)

1. **Push the app to GitHub**
   - If your repo root is the **whole workspace** (e.g. `RealEstateBuddy 2` with an `app` folder inside):
     - Commit and push as usual from the repo root.
     - In Vercel, when you import the project, set **Root Directory** to `app` (so Vercel runs `npm install` and `npm run build` inside `app`).
   - If your repo contains **only** the app (e.g. you created a repo and only pushed the contents of `app/`):
     - Root Directory in Vercel can stay **empty** (default).

2. **Connect the repo in Vercel**
   - Go to [vercel.com](https://vercel.com) → Add New Project → Import your GitHub repo.
   - Set **Root Directory** to `app` if the app lives in a subfolder (see above).
   - **Build and Output**: Vercel will detect Vite; build command `npm run build` and output `dist` are set in `vercel.json`.

3. **Add environment variables**
   - In the Vercel project: **Settings → Environment Variables**.
   - Add each Firebase value (same names as in `.env`), so the built app has them at runtime:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - Apply to **Production** (and Preview if you want). Redeploy after saving.

4. **Firebase auth domain**
   - In Firebase Console → Authentication → Settings → **Authorized domains**, add your Vercel domain (e.g. `your-app.vercel.app`) so sign-in and sign-up work in production.

5. **Deploy**
   - Push to the connected branch (e.g. `main`); Vercel will build and deploy. Or trigger a redeploy from the Vercel dashboard.

**Note:** The optional CSV column-mapping API (`npm run server`) runs on Node and is not deployed with the static frontend. For production you could host it separately (e.g. another Vercel serverless function or a small Node server) and set the frontend’s API base URL if needed.

---

## Firestore structure

- `users/{uid}` — `agentId`, `email`, `displayName` (for team support later).
- `agents/{agentId}` — profile, `avmQuota`, `avmUsed`, etc.
- `agents/{agentId}/homeowners` — one doc per client.
- `agents/{agentId}/properties` — one per property; `homeownerId` links to homeowner.
- `agents/{agentId}/transactions` — closing date, sale price, etc.
- `agents/{agentId}/touchpoints` — for Phase 2.
- `auditLogs` — top-level; `agentId`, `action`, `payload`, `timestamp`.
