# Task: Fix Data Persistence for Profile & Leave Management

## Problem
Profile edits and leave applications only work in-memory and are lost when backend/frontend restart.

## Steps
- [x] 1. Create `backend/models/Employee.js` (Mongoose schema for profile data)
- [x] 2. Create `backend/models/Leave.js` (Mongoose schema for leave requests)
- [x] 3. Update `backend/controllers/employeeController.js` to use MongoDB models instead of in-memory data
- [x] 4. Update `frontend/src/services/employeeService.js` to align cancelLeave endpoint with backend route
- [x] 5. Update `frontend/src/pages/LeaveManagement.jsx` to fetch/persist leaves via backend API instead of local mock state
- [ ] 6. Test persistence across backend/frontend restart

