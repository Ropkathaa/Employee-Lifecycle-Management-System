# Project Memory - Enterprise HR Automation Platform

This document serves as the permanent memory and active state tracker for the Enterprise HR Automation Platform. It must be updated immediately upon the completion of any feature, architectural decision, or phase shift to guide subsequent developer and agent operations.

---

## Project Metadata

* **Project Name:** Enterprise HR Automation Platform
* **Current Module:** HR Module
* **Last Updated:** 2026-07-28
* **Current Phase:** HR Dashboard UI — ✅ COMPLETE. Next: Phase 2 — Database Schemas

---

## Task Progress Tracker

### Completed Tasks

* [x] **Project Initialization Documentation:**
  * Defined core requirements, goals, and architectural structure.
  * Authored `README.md`, `architecture.md`, `coding-standards.md`, `project-rules.md`, `ui-design-system.md`, and `development-roadmap.md`.
  * Integrated Responsive Layout Standards (width bounds, device rules, grid flows, accessibility specs).
  * Verified documentation completeness and alignment with strict tech stack requirements.

* [x] **Phase 1: Project Setup & Base Architecture (COMPLETE):**
  * Scaffolded complete monorepo structure (`frontend/` + `backend/`).
  * **Frontend:**
    * Initialized Vite React 18 app (`npm create vite`).
    * Installed and configured Tailwind CSS v4 via `@tailwindcss/vite` plugin.
    * Configured HSL design tokens in `src/index.css` using `@theme` block (Tailwind v4 approach).
    * Created Axios client instance with request/response interceptors (`src/config/axios.js`).
    * Built React Router DOM v6 routing with `BrowserRouter`, `Outlet`, and `ProtectedRoute` stub.
    * Created all layout components: `DashboardLayout`, `AuthLayout`, `MainLayout`.
    * Created all 14 reusable UI components: `Button`, `Input`, `Select`, `Card`, `StatsCard`, `SearchBar`, `Table`, `Loader`, `EmptyState`, `Modal`, `Breadcrumb`, `PageHeader`, `Sidebar`, `Navbar`.
    * Created all placeholder pages: `Dashboard`, `Employees`, `Documents`, `Salary`, `Training`, `Reports`, `Settings`, `Login`, `NotFound`, `Unauthorized`.
    * Created all required directory stubs: `hooks/`, `services/`, `utils/`, `constants/`, `context/`, `styles/`, `icons/`.
    * Created `.env`, `.env.example`, `.gitignore`.
    * **Frontend build verified: ✅ 55 modules, 0 errors.**
  * **Backend:**
    * Initialized `package.json` with all dependencies: express, mongoose, cors, dotenv, morgan, multer, bcrypt, nodemon.
    * Created Express app (`src/app.js`) with CORS, Morgan, JSON parser, versioned router (`/api/v1`), 404 handler, global error handler.
    * Created `server.js` entry point with MongoDB connect-then-listen pattern and global process error handlers.
    * Created MongoDB connection utility (`src/config/db.js`) using Mongoose with event logging.
    * Created Multer config (`src/config/multer.js`) with disk storage, MIME-type whitelist, 5MB limit, and timestamp file renaming.
    * Created health check route (`src/routes/healthRoutes.js`) at `GET /api/v1/health`.
    * Created central API route index (`src/routes/index.js`) with future module slots pre-commented.
    * Created middleware: `errorHandler.js`, `notFound.js`.
    * Created all directory stubs: `controllers/`, `models/`, `services/`, `utils/`, `constants/`, `uploads/`.
    * Created `.env`, `.env.example`, `.gitignore`.
    * **Backend module loading verified: ✅ app.js loads OK.**

### Current Progress

* [x] **Executive HR Analytics & Report Generation Center (COMPLETE & POLISHED):**
  * Built complete Executive HR Analytics & Report Generation Center with clean 5-layer architecture (**Config & Templates → Domain Helpers & Selectors → Service Layer → Context State → Custom Hook → UI Layer**):
    * `frontend/src/config/reportTemplates.js`: Centralized built-in report templates (`Employee Master Census`, `Annual Compensation & Payroll`, `Mandatory Compliance & Training`, `Document Verification & Expiry Audit`, `Recruitment & Offer Packet Status`, `Executive Board Overview`), categories, and export format definitions (`PDF`, `Excel`, `CSV`, `Print`, `Email`, `Cloud Share`). Zero hardcoding.
    * `frontend/src/mock/analytics.js`: Seed system health indicators (`mockSystemHealth`), executive KPI benchmarks (`mockKPIBenchmarks`), and executive insights (`mockExecutiveInsights`).
    * `frontend/src/utils/analyticsHelpers.js`: Growth rate math (`calculateGrowthRate`), compliance scoring (`calculateComplianceScore`), offer acceptance calculation, department headcount distribution, and AI readiness hooks (`aiWorkforceForecastingHook`, `attritionPredictionHook`, `hiringRecommendationsHook`, `aiReportGenerationHook`).
    * `frontend/src/utils/analyticsSelectors.js`: Pure memoized selector functions (`selectExecutiveKPIs`, `selectDepartmentAnalytics`) aggregating live data across all 5 HR module contexts (`Employees`, `Documents`, `Offers`, `Salary`, `Training`).
    * `frontend/src/services/analyticsService.js` & `reportService.js`: Service layer abstraction returning async Promises (`fetchSystemHealth`, `fetchExecutiveInsights`, `generateReportApi`, `exportReportApi`, `scheduleReportApi`). Ready for Analytics/Export API replacement in Phase 2+.
    * `frontend/src/context/AnalyticsContext.jsx`: Single Source of Truth aggregating data from all module contexts live without page refreshes.
    * `frontend/src/hooks/useAnalytics.js`: Reusable custom hook exposing domain state & handlers cleanly to UI components.
  * Built 9 reusable domain components in `frontend/src/components/analytics/`: `KPICard`, `ExecutiveSummary`, `InsightCard`, `DepartmentCard`, `ReportTable`, `ReportBuilder`, `AnalyticsFilters`, `ExportDialog`, `ComplianceWidget`.
  * Built 5 complete pages:
    * `ReportCenter.jsx` (`/reports`): Executive Report Library featuring categorized template filters, search bar, run report triggers, and generated report archive.
    * `AnalyticsDashboard.jsx` (`/reports/analytics`): Boardroom HR Analytics Dashboard featuring C-suite banner, 6 executive KPI cards with trend indicators & drill-down navigation (`/employees`, `/salary`, `/reports/compliance`, `/documents`, `/offers`), department performance grid, and executive insights.
    * `ReportGenerator.jsx` (`/reports/generator`): 7-step interactive Report Builder page.
    * `DepartmentAnalyticsPage.jsx` (`/reports/departments`): Department headcount, average salary, and compliance analytics page.
    * `ComplianceDashboardPage.jsx` (`/reports/compliance`): Organization audit and compliance monitor page.
  * Added client-side routes in `AppRoutes.jsx`: `/reports`, `/reports/analytics`, `/reports/generator`, `/reports/departments`, `/reports/compliance`.
  * **Build verified: ✅ 166 modules, 0 errors.**







* [ ] **Phase 2: Database Configuration & Schemas** — Ready to begin.






### Pending Tasks (HR Module Backlog)

* [ ] **Phase 2: Database Configuration & Schemas**
  * Write the Employee Mongoose Schema with validators and pre-save ID generation hook.
  * Write the Document Mongoose Schema (linked to employee via ObjectId ref).
  * Write the Training Program and Training Progress Mongoose Schemas.
* [ ] **Phase 3: Authentication & Middleware**
  * Implement bcrypt hashing utility service.
  * Implement JWT signing and verification services.
  * Build `authMiddleware.js` and `roleMiddleware.js`.
* [ ] **Phase 4: Core Business Services**
  * Implement Employee ID auto-generator service (`EMP-YYYY-[4-digit counter]`).
  * Implement PF and salary calculation service.
  * Implement document file service (tracking Multer uploads in DB).
* [ ] **Phase 5: HR Dashboard & Employee Module**
  * Backend: Employee CRUD controllers and routes.
  * Frontend: Connect Employee page to real API using `employeeService.js`.
* [ ] **Phase 6: Document Management Integration**
  * Connect Document page to upload API.
  * Implement offer packet compilation service.
* [ ] **Phase 7: Training Monitor**
  * Assignment service and progress tracking API.
* [ ] **Phase 8: Reporting & Sign-off**
  * Stats aggregator API.
  * CSV report generator utility.

---

## Known Issues

* Tailwind CSS v4 (shipped with Vite 8) uses a different configuration approach vs. v3. `tailwind.config.js` is no longer read. All theme tokens are now defined inside `src/index.css` using `@theme {}` block. The `@tailwindcss/vite` plugin replaces the PostCSS approach.
* `react-icons` version installed does not export `FiShieldAlert` — replaced with `FiLock` in `Unauthorized.jsx`.

---

## Important Architectural Decisions

1. **Monorepo Directory Separation:** Split into `/backend` and `/frontend` with isolated `package.json`, environments, and runners.
2. **Strict ES Modules:** Both frontend and backend use `import`/`export` exclusively. Backend `package.json` has `"type": "module"`.
3. **Mongoose Pre-Save ID Hook:** Employee IDs (`EMP-YYYY-XXXX`) generated in pre-save hook to prevent concurrency race conditions.
4. **Tailwind CSS v4 via Vite Plugin:** Using `@tailwindcss/vite` instead of PostCSS plugin. Theme tokens are CSS variables defined in `@theme {}` inside `index.css` — no `tailwind.config.js` needed.
5. **ProtectedRoute Stub:** Uses `localStorage.getItem('token')` as auth check placeholder. Will be replaced with a proper AuthContext in Phase 3.
6. **No Redux:** State managed via React Context API + custom hooks (`useFetch`, `useAuth` — to be built in Phase 3+).
7. **Health Check Baseline:** Backend exposes `GET /api/v1/health` returning `{ success: true, status: "ok" }` for uptime monitoring.

---

## Project Timeline

* **Phase 1: Project Setup & Base Architecture:** ✅ COMPLETE (Day 1)
* **HR Dashboard UI:** ✅ COMPLETE
* **Phase 2: Database Configuration & Schemas:** 🔜 NEXT (Day 2)
* **Phase 3: Authentication & Middleware:** ⬜ Pending (Day 3)
* **Phase 4: Core Business Services:** ⬜ Pending (Day 4)
* **Phase 5: Employee Profile & HR Dashboard:** ⬜ Pending (Day 5-7)
* **Phase 6: Document Management:** ⬜ Pending (Day 8-9)
* **Phase 7: Training Monitor:** ⬜ Pending (Day 10-11)
* **Phase 8: Reporting & Sign-off:** ⬜ Pending (Day 12)

---

## Next Immediate Task

**Phase 2 — Database Schemas:**
Create the four Mongoose model files inside `backend/src/models/`:
1. `employeeModel.js` — with pre-save auto-ID generation hook (`EMP-YYYY-XXXX`), full field definitions, validators, and enums.
2. `documentModel.js` — referencing `employees` via `ObjectId`.
3. `trainingProgramModel.js` — course catalog schema.
4. `trainingProgressModel.js` — links employees to programs with status and percentage.

---

## Dashboard Component Registry

| Component | Path | Purpose |
|:---|:---|:---|
| `DashboardStats` | `components/dashboard/DashboardStats.jsx` | 4-col responsive stat cards with trend indicators |
| `QuickActionCard` | `components/dashboard/QuickActionCard.jsx` | Clickable action tiles with hover glow + arrow reveal |
| `ActivityTimeline` | `components/dashboard/ActivityTimeline.jsx` | Vertical timeline with relative timestamps |
| `DashboardChart` | `components/dashboard/DashboardChart.jsx` | Bar / Horizontal-bar / SVG Donut — no external library |
| `UpcomingTaskCard` | `components/dashboard/UpcomingTaskCard.jsx` | Task rows with priority badges and deadline labels |
| `NotificationCard` | `components/dashboard/NotificationCard.jsx` | Approval cards with Approve/Reject actions |

---

## Developer Notes

* **Tailwind v4 tokens:** All design tokens (colors, fonts) are defined in `frontend/src/index.css` inside `@theme {}`. Do NOT edit a `tailwind.config.js` — it is not used in v4.
* **Axios Interceptors:** All frontend API calls go through `frontend/src/config/axios.js`. Never use raw `fetch` or inline `axios.create()` in pages.
* **Backend route registration:** New module routes must be added to `backend/src/routes/index.js` under the `/api/v1` prefix.
* **Keep Memory Fresh:** Update this file after every phase or architectural decision.
* **Dev Servers:**
  * Frontend: `cd frontend && npm run dev` → `http://localhost:5173`
  * Backend: `cd backend && npm run dev` → `http://localhost:5000/api/v1/health`

---

## Mock Data Layer

All UI mock data lives in `frontend/src/mock/`. Pages import from here — never hardcode arrays inside components.

| File | Consumed By | Replace With (Phase 5+) |
|:---|:---|:---|
| `mock/dashboard.js` | `pages/Dashboard.jsx` | `services/dashboardService.js` → `GET /api/v1/dashboard/*` |
| `mock/employees.js` | `pages/Employees.jsx` | `services/employeeService.js` → `GET /api/v1/employees` |
| `mock/training.js` | `pages/Training.jsx` | `services/trainingService.js` → `GET /api/v1/trainings/*` |
| `mock/salary.js` | `pages/Salary.jsx` | `services/salaryService.js` → `GET /api/v1/employees?fields=salary` |
| `mock/reports.js` | `pages/Reports.jsx` | `services/reportService.js` → `GET /api/v1/reports` |

**Transition rule:** When wiring real APIs, create the corresponding `services/*.js` file, update the import path in the page, and delete the mock file. The page UI code remains untouched.

