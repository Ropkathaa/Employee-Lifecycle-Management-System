# Strict Project Rules & Guardrails

This is the central rulebook for the Enterprise HR Automation Platform. The rules defined here are absolute and must be followed at all times. Failure to adhere to these rules will result in pull request rejection or code rollback.

---

## 1. Architectural Guardrails

### Rule 1.1: Separation of UI & Business Logic
* **Frontend:** React component files (`.jsx`) must only handle structure, layout styling, and state visualization. Form submissions, API calls, logic checks, or mathematical calculations must be delegated to Custom Hooks (`/hooks`) or Service modules (`/services`).
* **Backend:** Route handlers (`/routes`) must only map endpoints. Controllers (`/controllers`) must only extract request arguments and format responses. The actual business logic, DB queries, calculations, and external systems interface must live inside Service modules (`/services`). Direct model calls in controllers are prohibited.

### Rule 1.2: Strict Modularization
* Never write everything in a single file. Keep components, hooks, styles, routers, configurations, schemas, and helpers separated as dictated by the [System Architecture](file:///d:/HR%20GROUP/architecture.md).

---

## 2. Code Hygiene & Reusability

### Rule 2.1: Zero Component & Logic Duplication
* Never copy-paste design elements. If a component (such as a card, input field, header, table header, drawer wrapper) is used in multiple pages, it must be extracted into the reusable frontend components directory (`/components`).
* Never duplicate API calls or state integrations. Ensure common database operations, calculation logic, and validations are consolidated into reusable services.

### Rule 2.2: Do Not Create Unused Files
* Never leave boilerplate or unused assets/files in the codebase. If a component, utility, hook, or asset is deprecated, delete it immediately.
* Do not commit scrap code, draft files, or commented-out modules.

### Rule 2.3: Folder Structure Stability
* Never alter the layout of the project's folders without updating the system architecture documentation (`architecture.md`, `README.md`) first.

---

## 3. Configuration & Security Safety

### Rule 3.1: Never Hardcode URLs & Secrets
* No hardcoded API endpoints, server ports, file paths, database URIs, or encryption keys.
* **Frontend:** Use `import.meta.env` properties (prefixed with `VITE_`) for all network configurations.
* **Backend:** Use `process.env` properties populated via `dotenv` initialization.
* Maintain complete `.env.example` templates in both frontend and backend roots.

### Rule 3.2: Dependency Discipline
* Never install unnecessary packages. Before adding a package (using `npm install`), consult the lead architect. If a feature can be solved with lightweight custom logic or utility, code it from scratch.

---

## 4. Operational Integrity

### Rule 4.1: Documentation Synchronization
* **Update memory.md:** You MUST update the `memory.md` file after every successful feature completion, architectural adjustment, or blocker. It is the permanent state record.
* **Coding Standards Compliance:** All written code must pass checks matching the guidelines in `coding-standards.md`.

### Rule 4.2: Think and Plan Before Coding
* Do not immediately generate code. Always review the target system layout, research active patterns, check database implications, design interfaces, and verify code logic beforehand.

### Rule 4.3: Preserve Code Comments & Comments Safety
* Maintain structural code integrity. Do not modify or delete existing comments or documentation blocks that are not relevant to your current edit, unless asked.
