# Coding Standards & Styling Guidelines

This document outlines the strict coding rules, naming systems, structural constraints, and security practices that must be followed by every developer working on the Enterprise HR Automation Platform.

---

## 1. Naming Conventions

### Folder Naming
* **Convention:** Lowercase kebab-case.
* **Examples:** `employee-management`, `ui-components`, `route-handlers`.

### File Naming
* **React Components:** PascalCase with `.jsx` extension (e.g., `EmployeeTable.jsx`, `ActionButton.jsx`).
* **Custom React Hooks:** camelCase starting with `use` (e.g., `useEmployeeData.js`, `useSalarySummary.js`).
* **Services / Controllers / Models / Routes / Utils:** camelCase (e.g., `employeeController.js`, `employeeService.js`, `employeeModel.js`, `dateFormatter.js`).

### Variable & Function Naming
* **Variables / Local State:** camelCase (e.g., `isActive`, `employeeProfile`).
* **Constants:** UPPERCASE_SNAKE_CASE (e.g., `MAX_FILE_SIZE_BYTES`, `HTTP_STATUS_OK`).
* **Functions:** camelCase starting with a verb indicating action (e.g., `calculatePfContribution`, `fetchEmployeeById`, `validateFormFields`).

### Mongo Collection & Field Naming
* **Collections:** Lowercase, plural, snake_case (e.g., `employees`, `documents`, `training_programs`).
* **Document Fields:** camelCase (e.g., `firstName`, `employeeId`, `dateOfJoining`).

### API Endpoint Paths
* **Convention:** Lowercase kebab-case paths. Use plural nouns for resources.
* **Examples:** `/api/v1/employee-profiles`, `/api/v1/training-progress/assign`.

---

## 2. React Component Rules

* **Function Declarations:** Write components using named function declarations instead of arrow functions for clearer debug traces.
  ```jsx
  export default function EmployeeCard({ employee, onSelect }) {
    return (
      <div className="card-container">
        {/* Component layout */}
      </div>
    );
  }
  ```
* **No Inline Styles:** All layout structures must use Tailwind classes. Custom inline styles (`style={{ marginTop: '10px' }}`) are strictly prohibited.
* **Single Responsibility:** A component should do only one thing. If a component extends beyond 200 lines, extract sub-elements into smaller helper components.
* **Separate Layout & Logic:** Components must focus on layout and interface presentation. State fetching, data massaging, and API requests must live in custom hooks or services.
* **Prop Destructuring with Defaults:** Always destructure props and specify defaults where applicable.
  ```jsx
  export default function Modal({ isOpen = false, title = 'Confirm', children }) {
    if (!isOpen) return null;
    // ...
  }
  ```

---

## 3. Error Handling Rules

### Backend Error Strategy
* **Async Middleware Wrapper:** Wrap all asynchronous controller routes to automatically forward uncaught exceptions to the global error middleware. Do not write duplicate try-catch blocks in routes.
* **Global Error Middleware:** Implement an Express error handler that logs stack traces internally and sends a structured JSON payload back to the client:
  ```json
  {
    "success": false,
    "message": "Error description displayable to user",
    "errors": []
  }
  ```
* **Custom AppError Class:** Create a class inheriting from standard `Error` to easily append operational HTTP status codes (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found).

### Frontend Error Strategy
* **Axios Interceptors:** Use global interceptors (`frontend/src/config/axios.js`) to capture 401/403/500 responses and alert users via notifications or redirect rules.
* **Local Boundaries:** Use React Error Boundaries to wrap major page modules so that a crash in a small component doesn't take down the entire page.

---

## 4. Logging Rules

* **No Production `console.log`:** Plain `console.log` statements are forbidden. Use logging wrappers or structured log utilities.
* **Morgan Logger (Backend):** Use Morgan in `dev` format for local debugging and configure it to output structured log statements for incoming HTTP operations.
* **Vite Clean-up:** The Vite compiler must be configured to automatically strip `console.log` calls during the production build cycle.

---

## 5. Commenting Rules

* **Document the "Why":** Comments should explain the design decision, logic boundaries, or mathematical rationale, never simply restate what the line of code does.
* **JSDoc Specifications:** Write JSDoc comments for all services, utility operations, and custom hooks.
  ```javascript
  /**
   * Calculates the Provident Fund contribution based on basic salary.
   * @param {number} basicSalary - The basic salary of the employee.
   * @returns {number} The calculated PF contribution (12% of basic).
   */
  export function calculatePf(basicSalary) {
    // ...
  }
  ```

---

## 6. Formatting Rules

* **Prettier Configuration:** Enforce formatting rules via `.prettierrc`.
  * `semi`: true
  * `singleQuote`: true
  * `tabWidth`: 2
  * `trailingComma`: "es5"
  * `printWidth`: 100
* **Tabulation:** Never mix tabs and spaces. Spaces only.

---

## 7. Import Ordering

Ensure imports are organized in a structured sequence:
1. **Core dependencies:** React, React Router elements, React Hooks.
2. **Third-Party Libraries:** Axios, React Icons, etc.
3. **Internal Configuration/Constants:** Database configs, constants, API URLs.
4. **Custom Hooks:** Custom logic hooks (`useEmployee`, `useAuth`).
5. **Services:** API integration layers.
6. **Reusable Components:** Elements from `/components`.
7. **Assets & Styling:** Local images, custom SVG elements, css files.

---

## 8. Code Reusability Rules

* **DRY (Don't Repeat Yourself):** If you copy-paste code twice, refactor it. Combine matching inputs, UI card components, and data grids into parameterized components.
* **Centralized API Calls:** Do not instantiate local `fetch` or custom `axios.get` calls inside a page. All actions must go through frontend service modules.
* **Helper Utilities:** Date formatting, local currency calculations, and file size computations must live in `/utils` and be reused project-wide.

---

## 9. Performance Rules

* **Rendering Optimization:** Use `useMemo` and `useCallback` to prevent useless re-render loops on lists, complex calculation blocks, and custom dropdown hooks.
* **Paginated Requests:** All resource index listings must support pagination (`page`, `limit`) and dynamic database projection to avoid pulling entire rows.
* **Vite Lazy-Loading:** Utilize React's `lazy` and `Suspense` modules to load route pages on-demand, lowering the primary bundle size.

---

## 10. Security Rules

* **Environment Variable Safety:** Never commit API endpoints, MongoDB credentials, or tokens directly to git. All configurations must pull from `process.env` (backend) or `import.meta.env` (frontend).
* **Password Hashing:** Store credentials safely. Passwords must pass through `bcrypt` with a minimum cost parameter of 12 rounds before database insertion.
* **File Upload Constraints:**
  * Validate MIME-types strictly (whitelist: `.pdf`, `.jpg`, `.png`).
  * Enforce maximum size validation (Limit: 5MB per upload).
  * Store files using unique hash renaming strategies to prevent path traversal attacks.
* **CORS Settings:** Strict CORS configurations must restrict API calls to designated domains.
