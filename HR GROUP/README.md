# Enterprise HR Automation Platform

An enterprise-grade, highly scalable, and modular HR automation system designed to streamline human resource management, employee onboarding, document generation, and tracking. This project incorporates modern software engineering best practices with a clear separation of concerns, structured configuration, and unified styling guidelines.

---

## Project Overview

The HR Automation Platform is designed to handle key HR workflows from candidate selection to employee management. The current active module is the **HR Module**, which handles the following features:
* **HR Dashboard:** A unified screen for stats, quick tasks, and status tracking.
* **Employee Management:** Create profiles, automatically generate custom Employee IDs, search employee records, and track detailed statuses.
* **Document Management:** Securely upload and manage employee documentation using Multer, and automatically compile onboarding/offer packets.
* **Financial Calculations:** Automatically calculate Provident Fund (PF) contributions, basic salary distributions, and compile salary summaries.
* **Training Management:** Assign mandatory trainings, monitor progress, and flag incomplete courses.
* **Reporting & Statistics:** View administrative and operational statistics, and generate detailed reports.

---

## Project Goals

1. **Enterprise Scalability:** Modular architecture to accommodate future growth and additional modules (e.g., Attendance, Payroll, Performance, Benefits).
2. **Consistency:** Enforce a single styling, directory structural, and coding standard across the entire stack.
3. **Data Security & Privacy:** Maintain data integrity with standard encryption (bcrypt), role-based middleware, and secure uploads.
4. **Automation:** Minimize manual HR operations through ID generation, document compiling, and auto-calculations.

---

## Technology Stack

The platform is built using a strict, modern, and production-ready Javascript stack.

### Frontend
* **Core:** React 18 (SPA)
* **Build Tool:** Vite
* **Routing:** React Router DOM (v6)
* **Styling:** Tailwind CSS (configured for uniform design language)
* **Icons:** React Icons
* **API Client:** Axios

### Backend
* **Runtime:** Node.js (LTS version)
* **Framework:** Express.js
* **Database:** MongoDB
* **ODM:** Mongoose
* **Multipart Upload:** Multer
* **Logging:** Morgan
* **Security & Utility:** Bcrypt (hashing), Cors (cross-origin controls), Dotenv (environment variables)

*Note: Next.js, Redux, Material UI, Bootstrap, TypeScript, and Firebase are strictly prohibited to maintain codebase simplicity, modular alignment, and low runtime overhead.*

---

## Folder Structure

The project is structured as a monorepo containing distinct `frontend` and `backend` codebases:

```text
HR-GROUP/
├── backend/
│   ├── src/
│   │   ├── config/             # Database connection, Multer config, environment validation
│   │   ├── constants/          # Error messages, HTTP status codes, role definitions
│   │   ├── controllers/        # Route controllers handling HTTP requests and responses
│   │   ├── middleware/         # Auth, validation wrappers, error handling, upload handlers
│   │   ├── models/             # Mongoose schemas and models
│   │   ├── routes/             # Express routes grouped by resource (e.g., employeeRoutes.js)
│   │   ├── services/           # Reusable business logic (e.g., idGenerator, pfCalculator)
│   │   ├── utils/              # Generic utility functions (e.g., formatters, file helpers)
│   │   ├── validation/         # Input schemas (using custom validator rules or lightweight libraries)
│   │   └── app.js              # Express app setup and middleware registration
│   ├── .env.example            # Backend environment template
│   ├── package.json
│   └── server.js               # Application entry point
├── frontend/
│   ├── src/
│   │   ├── assets/             # Images, static design SVGs
│   │   ├── components/         # Reusable presentation components (e.g., Button, Table, Input)
│   │   ├── config/             # Axios instance setup, API route definitions
│   │   ├── constants/          # Layout keys, fixed options, string literals
│   │   ├── hooks/              # Custom React hooks (e.g., useAuth, useFetch)
│   │   ├── layouts/            # Page templates (e.g., DashboardLayout, AdminLayout)
│   │   ├── pages/              # View pages corresponding to router paths
│   │   ├── routes/             # App routing configs and route components
│   │   ├── services/           # API interaction layer (e.g., employeeService.js)
│   │   ├── utils/              # UI utility functions (e.g., date formats, currency helpers)
│   │   └── index.css           # Global CSS and Tailwind directives
│   ├── .env.example            # Frontend environment template
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── README.md
├── architecture.md
├── coding-standards.md
├── project-rules.md
├── ui-design-system.md
├── memory.md
└── development-roadmap.md
```

---

## Development Workflow

To build features for this project, always adhere to the following sequence:

1. **Review Rules & Standards:** Ensure you are familiar with `project-rules.md` and `coding-standards.md`.
2. **Review Memory:** Check `memory.md` to see the current active task and system state.
3. **Database Schema:** If creating a new model, write the Mongoose model in `backend/src/models/` and export it.
4. **Business Logic & Service:** Write logic (e.g., calculations, file-operations) inside `backend/src/services/`.
5. **Controller & Router:** Write the controller to capture requests, invoke services, and return responses. Connect it to the routes.
6. **API Client Integration:** Create a service file in `frontend/src/services/` to hook up Axios.
7. **UI Component & Page:** Build the reusable UI component (if new) and implement the user view in `frontend/src/pages/`.
8. **Documentation Sync:** Once a feature works, update `memory.md` with accomplishments and any modifications to the roadmap.

---

## How to Run

### Prerequisite
Ensure you have **Node.js (v18+)** and a running instance of **MongoDB** (local or Atlas cluster) installed.

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in the values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/hr_automation
   CORS_ORIGIN=http://localhost:5173
   JWT_SECRET=supersecretjwtkeyforhrautomation
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in the values:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Coding Guidelines (Highlights)

* **Single Responsibility:** Files must do only one thing. Hooks contain stateful UI logic, services contain external API and calculation logic, and components handle layout and markup.
* **Tailwind Consistency:** Use custom class combinations declared in the `ui-design-system.md` file rather than arbitrary margins, colors, or values.
* **Error Handling:** Async operations must be wrapped in Try-Catch. Frontend Axios calls must handle responses uniformly via interceptors. Backend must use custom error-handling middleware.

---

## Git Branch Strategy

* **`main`:** Production-stable branch. Direct commits are strictly prohibited.
* **`develop`:** Integration branch. All features are merged here first.
* **Feature Branches (`feature/hr-[description]`)**: Created for individual features (e.g., `feature/hr-employee-profile`). Must be rebased against `develop` before submitting a Pull Request.
* **Hotfixes (`hotfix/[description]`)**: Short-lived branches off `main` for critical production fixes.

---

## Future Scope

* **Module 2: Attendance & Leave:** Automatic clock-in, geofencing, leave approval workflows, and biometric sync.
* **Module 3: Payroll System:** Automated payslip generation, tax deductions, bonus calculations, and direct deposit routing.
* **Module 4: Performance Management:** OKRs tracking, peer reviews, performance matrices, and promotion analytics.

---

## Contributors

* **Lead Architect:** Principal Full Stack Engineer
* **Development Team:** Core Platform Engineering Group
