# StartupHealer — Monorepo

Clone + upgrade of [startuphealer.com](https://startuphealer.com) — same content, new mobile-first design, SEO, lead magnet, chatbot, auth and admin panel.

| Folder | What | Tech | Deploy |
|---|---|---|---|
| `web/` | Website + Admin panel | Next.js 16 (App Router, TS, Tailwind v4) | **Vercel** |
| `api/` | REST API | Node 22, Express 5, Mongoose 9, JWT | **Render (Docker)** |
| DB | MongoDB | Docker locally/staging · **MongoDB Atlas** in production | |

```
StartupHealer/
├─ web/                    Next.js frontend (Vercel root directory = web)
│  └─ src/app/(site)/      public pages · src/app/admin/ admin panel · src/data/ all site content
├─ api/                    Express API (Dockerfile here)
│  └─ src/  config · models · routes · middleware · chatbot · scripts
├─ docker-compose.yml           LOCAL   : mongo + api (hot reload)
├─ docker-compose.staging.yml   STAGING : mongo (auth) + api (production image)
├─ render.yaml                  PRODUCTION api on Render (Docker) + Atlas
└─ .github/workflows/ci.yml     lint + build on every push
```

## Features
- All original pages & exact content: Home, About, Services, **Success Stories** (was Testimonials — `/testimonials` 308-redirects), FAQ, Contact, Login, Register, Profile, 404
- **New home hero design** with image + floating certificate badges
- **Service detail pages** `/services/<slug>` (8 services) with enquiry form, Service JSON-LD
- **Lead magnet popup** (12s delay / exit-intent / 60% scroll) → saved in MongoDB `leads` collection, unlocks `/resources/startup-checklist`
- **Chatbot** (rule-based, free, no API key) — answers services/pricing/docs, captures callback leads, stores transcripts
- **Partners** section (ISPM, NIMS) — drop logos into `web/public/partners/` and set `logo` in `web/src/data/content.ts`
- **Auth**: email + password (bcrypt, httpOnly JWT cookie). Email OTP via **Brevo — coming soon**
- **Admin panel** `/admin`: dashboard, leads (filter/search/status/notes/CSV export/WhatsApp), contact messages, chatbot transcripts, users (make admin/disable)
- **SEO**: per-page metadata, canonical, Open Graph, sitemap.xml, robots.txt, manifest, JSON-LD (Organization/LocalBusiness, Service, FAQPage, Review, Breadcrumb), static prerendering
- Security: helmet, CORS whitelist, rate limits, zod validation, honeypot spam trap, CSV-injection safe export

---

## 1. Local setup (Mongo + API in Docker, website on your machine)

Requirements: Node 22+, Docker Desktop, Git.

```bash
npm install                           # installs web + api (npm workspaces)

# API env (optional for docker — compose already has safe local defaults)
cp api/example.env api/.env
# Website env
cp web/example.env web/.env.local     # API_URL=http://localhost:5000

npm run docker:local                  # starts mongo:27017 + api:5000 (hot reload)
npm run dev                           # website on http://localhost:3000
```

- API health: http://localhost:5000/health
- Admin login: `admin@startuphealer.com` / `Admin@12345` (created automatically from `ADMIN_EMAIL`/`ADMIN_PASSWORD`) → http://localhost:3000/admin
- MongoDB Compass: `mongodb://localhost:27017/startuphealer`
- Logs: `npm run docker:logs` · Stop: `npm run docker:local:down`

> Without Docker: run a local MongoDB, set `MONGODB_URI` in `api/.env`, then `npm run dev:api`.

## 2. Staging (VPS / any Docker host — Mongo + API both in Docker)

```bash
cp api/staging.example.env api/.env.staging     # fill strong passwords + JWT_SECRET
npm run docker:staging                          # mongo (auth, not exposed) + api (production image)
```
Point a staging Vercel deployment (or preview branch) at it with `API_URL=https://<staging-api-domain>` and add that Vercel URL to `CORS_ORIGINS`.

## 3. Production

### 3a. MongoDB Atlas
1. https://cloud.mongodb.com → create project → **M0/M10 cluster** (region: Mumbai `ap-south-1`).
2. Database Access → add user (password auth). Network Access → add `0.0.0.0/0` (Render IPs are dynamic) — or Render static outbound IPs on paid plans.
3. Connect → Drivers → copy `mongodb+srv://USER:PASS@cluster.xxxx.mongodb.net/startuphealer?retryWrites=true&w=majority`.

### 3b. API on Render (Docker)
1. https://dashboard.render.com → **New → Blueprint** → select this GitHub repo (uses `render.yaml`).
   *(Or New → Web Service → Runtime **Docker**, Dockerfile path `./api/Dockerfile`, Docker context `.`, health check `/health`.)*
2. Set env vars in Render:
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Atlas connection string |
   | `JWT_SECRET` | auto-generated (or 64+ random chars) |
   | `CORS_ORIGINS` | `https://startuphealer.com,https://www.startuphealer.com,https://<project>.vercel.app` |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | first admin login |
   | `TRUST_PROXY` | `2` (Vercel → Render) |
3. Deploy → open `https://<service>.onrender.com/health` → `{"status":"ok","db":true}`.

### 3c. Website on Vercel
1. https://vercel.com/new → import repo → **Root Directory: `web`** (framework auto-detected: Next.js).
2. Environment variables (Production + Preview):
   | Key | Value |
   |---|---|
   | `API_URL` | `https://<service>.onrender.com` |
   | `NEXT_PUBLIC_SITE_URL` | `https://startuphealer.com` |
   | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | (optional) Search Console token |
3. Deploy. Add domain `startuphealer.com` + `www` in Vercel → Domains, update DNS.
4. **Important:** `API_URL` is read at build time (rewrites) — after changing it, **redeploy**. Every web domain must also be listed in Render `CORS_ORIGINS`, otherwise forms return 403.
5. Google Search Console → submit `https://startuphealer.com/sitemap.xml`.

How it connects: browser → `startuphealer.com/api/v1/*` → Vercel rewrite → Render API. Same-origin, so the httpOnly login cookie is first-party and there are no CORS issues for users.

---

## 4. Git & GitHub (commit as **Buildadda**, only for this repo)

Identity is set **locally in this repo only** (no `--global`), so other projects keep your normal account.

```bash
cd D:/StartupHealer
git init -b main
git config user.name  "Buildadda"
git config user.email "<buildadda-github-email-or-noreply>"   # e.g. 12345678+Buildadda@users.noreply.github.com
git config --local --list | grep user                          # verify (only this repo)
```

Push auth with the Buildadda account — pick ONE:

**Option A — SSH key just for Buildadda (recommended)**
```bash
ssh-keygen -t ed25519 -C "buildadda" -f ~/.ssh/id_ed25519_buildadda
# GitHub (logged in as Buildadda) → Settings → SSH and GPG keys → New → paste ~/.ssh/id_ed25519_buildadda.pub
```
Add to `~/.ssh/config`:
```
Host github-buildadda
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_buildadda
  IdentitiesOnly yes
```
```bash
git remote add origin git@github-buildadda:Buildadda/<repo-name>.git
ssh -T git@github-buildadda      # "Hi Buildadda!"
```

**Option B — HTTPS with username in URL** (Git Credential Manager stores a separate login for Buildadda)
```bash
git remote add origin https://Buildadda@github.com/Buildadda/<repo-name>.git
git config credential.https://github.com.useHttpPath true
```

Then:
```bash
git add .
git commit -m "Initial commit: StartupHealer monorepo (web + api)"
git push -u origin main
git checkout -b staging && git push -u origin staging   # optional staging branch
```

---

## 5. Useful scripts (root)

| Command | Does |
|---|---|
| `npm run dev` | website dev server (:3000) |
| `npm run dev:api` | API without Docker (:5000) |
| `npm run build` | production build of website |
| `npm run lint` | lint all workspaces |
| `npm run docker:local` / `docker:local:down` | local mongo + api |
| `npm run docker:staging` / `docker:staging:down` | staging stack |
| `npm run seed:admin` | create/promote admin from `api/.env` |

## 6. API reference (`/api/v1`)

| Method | Path | Auth |
|---|---|---|
| POST | `/auth/register` · `/auth/login` · `/auth/logout` | — |
| GET | `/auth/me` | cookie (returns `user:null` if logged out) |
| GET/PUT | `/profile` | user |
| POST | `/leads` (lead magnet / service enquiry) · `/contact` | — (rate limited) |
| POST | `/chatbot/message` · `/chatbot/lead` | — |
| GET | `/admin/stats` · `/admin/leads` · `/admin/leads/export.csv` · `/admin/contacts` · `/admin/users` · `/admin/chats` | admin |
| PATCH/DELETE | `/admin/leads/:id` · `/admin/contacts/:id` · PATCH `/admin/users/:id` | admin |

## 7. Roadmap / TODO
- Email OTP verification + password reset with **Brevo** (`emailVerified` field already in the User model)
- Real partner logos & descriptions for ISPM / NIMS (`web/src/data/content.ts`)
- Team photos (currently initials avatars)
- Optional: upgrade chatbot to an LLM — replace `getReply()` in `api/src/chatbot/knowledge.js`
