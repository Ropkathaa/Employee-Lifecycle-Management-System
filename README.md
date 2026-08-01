# HR Automation System — Candidate Module

Full-stack implementation of the **Candidate** portion of the BRD (Section 4.2 and related
requirements), built strictly on the specified stack:

- **Frontend:** Vite, React 18, React Router DOM, Tailwind CSS, React Icons (`react-icons/hi`), Axios
- **Backend:** Node.js, Express, MongoDB + Mongoose, CORS, Morgan, Dotenv, Nodemon, Multer, Bcrypt

## What's implemented (mapped to BRD 4.2)

| BRD Requirement | Where |
|---|---|
| Candidate Registration | `POST /api/candidates/register` · `Register.jsx` |
| Candidate Login | `POST /api/candidates/login` · `Login.jsx` |
| Profile Creation & Management | `GET/PUT /api/candidates/profile` · `Profile.jsx` |
| Resume & Document Upload (Stage 1) | `POST /api/candidates/documents` · `Documents.jsx` |
| Additional Document Upload (HR-requested) | `additionalDocumentsRequested` on the Candidate model, surfaced in `Documents.jsx` |
| Recruitment Status Tracking | `GET /api/candidates/status` · `RecruitmentStatus.jsx` |
| Interview Schedule Viewing | `GET /api/candidates/interviews` · `Interviews.jsx` |
| Interview Reschedule Requests | `PUT /api/candidates/interviews/:id/reschedule` |
| HR Notifications | `GET/PUT /api/candidates/notifications` · `Notifications.jsx` |
| Selection/Rejection Status | Part of `recruitmentStatus` enum + timeline |
| Offer Letter Viewing/Download | `GET /api/candidates/offer` · `OfferLetter.jsx` |
| Offer Accept/Decline (+ auto-convert to Employee, per BRD 4.2) | `PUT /api/candidates/offer/decision` |
| Password Reset & Account Management | `forgot-password` / `reset-password/:token` / `change-password` |
| Recruitment Timeline | `recruitmentTimeline[]` on the Candidate model, shown on Dashboard & Status page |
| FAQ / Help & Support | `FAQ.jsx` (static content — wire to a real KB later if needed) |
| Logout | Sidebar → clears token via `AuthContext` |

Stage 1 documents (Resume, Experience Certificate, Professional Certification) and Stage 2
onboarding documents (Government ID, Educational Certificates, Photograph) are modeled as a
single `documents[]` array with a `stage` field, so nothing is duplicated when a candidate
converts to an employee — matching the BRD's "avoid duplicate document submissions" requirement.

## Note on JWT

The BRD's stack list includes **Bcrypt** for password hashing but doesn't name a session/token
library. Since a stateless Express API needs *some* way to authenticate requests after login,
this build adds **`jsonwebtoken`** (issued at login/register, verified in `authMiddleware.js`).
If your team prefers cookie-based sessions instead, that's a straightforward swap in
`authMiddleware.js` and the controller's `generateToken` — flag it if you'd like that version
instead.

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET as needed
npm install
npm run dev                # nodemon, http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so no CORS
configuration is needed in development beyond what's already in `server.js`.

## Folder structure

```
server/
  config/db.js                 Mongoose connection
  models/Candidate.js           Candidate schema (profile, docs, interviews, offer, notifications)
  middleware/authMiddleware.js  JWT route protection
  middleware/uploadMiddleware.js Multer disk storage, 5MB limit, type whitelist
  controllers/candidateController.js  All candidate business logic
  routes/candidateRoutes.js
  server.js

client/
  src/api/axios.js              Axios instance with auth interceptor
  src/context/AuthContext.jsx   Candidate session state
  src/components/               Sidebar, layout, route guard
  src/pages/candidate/          One page per BRD feature
  src/App.jsx                   Route table
```

## What's out of scope here

This delivers the **candidate-facing** experience only, as requested. It does not include the
HR-side screens (offer packet generation, interview scheduling UI, document verification UI) —
those write to the same `Candidate` collection (e.g. an HR endpoint would push to `interviews[]`,
set `offerLetter`, or push to `additionalDocumentsRequested`) but aren't built here since the
brief was candidate-only.
