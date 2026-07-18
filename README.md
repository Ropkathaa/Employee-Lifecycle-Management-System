# Employee-Lifecycle-Management-System
Web-based Employee Lifecycle Management System developed using the MERN Stack.

## Team Development Guidelines

### Project Database

**Shared MongoDB Database Name:** `"EmployeeLifecycleDB"`

### Development Rules

1. All team members must use the same MongoDB database name: `"EmployeeLifecycleDB"`.
2. Do not use absolute file paths (e.g., `C:\Users\...` or `D:\Desktop\...`). Always use relative paths within the project.
3. Every team member must work on their own Git branch. Do not push directly to the `main` branch.
4. Pull the latest changes from GitHub before starting work and before pushing your code.
5. Push only tested and working code with meaningful commit messages.

---

# Git Workflow

## First Time (Only Once)

Clone the repository:

```bash
git clone <Repository_URL>
```

Move into the project folder:

```bash
cd Employee-Lifecycle-Management-System
```

Install project dependencies (after they are added):

```bash
npm install
```

---

## Create Your Branch (Only Once)

Replace `<your-name>` with your name.

Example:
`candidate-rohan`
`hr-ananya`
`training-roop`

```bash
git checkout -b <your-branch-name>
```

Example:

```bash
git checkout -b candidate-roop
```

---

## Daily Workflow

### Step 1 — Before Starting Work

Always pull the latest changes.

```bash
git pull origin main
```

---

### Step 2 — Complete Your Work

Develop your assigned module.

---

### Step 3 — Check Modified Files

```bash
git status
```

---

### Step 4 — Stage Changes

```bash
git add .
```

---

### Step 5 — Commit Changes

```bash
git commit -m "Completed Candidate Registration Module"
```

Write a meaningful commit message describing your work.

---

### Step 6 — Push Your Branch

```bash
git push origin <your-branch-name>
```

Example:

```bash
git push origin candidate-roop
```

---

## Before Every New Working Session

Always execute:

```bash
git pull origin main
```

This ensures your project is up to date before starting new work.

---

# Important Notes

- Never delete another member's files.
- Never modify another member's module without discussion.
- Keep your code clean and well commented.
- Test your module before pushing.
- Report any merge conflicts immediately.
- Keep folder names and file names consistent across the project.

---

**Project:** Employee Lifecycle Management System (MERN Stack)
