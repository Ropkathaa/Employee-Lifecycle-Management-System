# Profile Picture Upload - Implementation TODO

## Goal
Allow user/employee to upload or change their profile picture on the Profile screen.

## Backend
- [x] Explore existing files (upload middleware, controllers, routes, model)
- [x] Add `uploadAvatar` multer instance (any file type, 5MB limit) in `backend/middleware/upload.js`
- [x] Add `uploadProfileAvatar` controller in `backend/controllers/employeeController.js`
- [x] Add `PUT /profile/avatar` route in `backend/routes/employeeRoutes.js`

## Frontend
- [x] Add `uploadProfileAvatar` service method in `frontend/src/services/employeeService.js`
- [x] Add `uploadProfileAvatar` context method in `frontend/src/context/EmployeeContext.jsx`
- [x] Add profile picture UI (avatar display + upload/change button) in `frontend/src/pages/Profile.jsx`

## Follow-up
- [ ] Verify avatar displays in Profile page, Header dropdown, and Employee info card

