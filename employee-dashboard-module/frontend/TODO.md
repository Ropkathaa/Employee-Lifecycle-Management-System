# Dark Mode Implementation - TODO

## Infrastructure (Already Complete) ✅
- [x] `ThemeContext.jsx` - Context with `isDark`, `toggleTheme`, localStorage persistence
- [x] `App.jsx` - Wraps with `ThemeProvider`
- [x] `tailwind.config.js` - `darkMode: 'class'` configured
- [x] `index.css` - Dark variants for `body`, `.card`, `.input-field`, `.btn-secondary`
- [x] `Settings.jsx` - Dark mode toggle wired to ThemeContext with dark text classes

## Layout Files (Need dark: classes)
- [ ] `DashboardLayout.jsx` - Main layout wrapper
- [ ] `Sidebar.jsx` - Navigation sidebar
- [ ] `Header.jsx` - Top header bar
- [ ] `ProfileDropdown.jsx` - User dropdown menu

## Pages (Need dark: classes)
- [ ] `Dashboard.jsx` - Dashboard page
- [ ] `EmployeeList.jsx` - Employee list page
- [ ] `EmployeeDetail.jsx` - Employee detail page
- [ ] `Profile.jsx` - Profile page
- [ ] `Attendance.jsx` - Attendance page
- [ ] `LeaveManagement.jsx` - Leave management page
- [ ] `Documents.jsx` - Documents page
- [ ] `Training.jsx` - Training page
- [ ] `Notifications.jsx` - Notifications page
- [ ] `NotFound.jsx` - 404 page

## Components (Need dark: classes)
- [ ] `WelcomeBanner.jsx` - Welcome banner on dashboard
- [ ] `EmployeeInfoCard.jsx` - Employee info card
- [ ] `TodayAttendanceCard.jsx` - Today's attendance card
- [ ] `RecentNotifications.jsx` - Recent notifications widget
- [ ] `NotificationBadge.jsx` - Notification bell badge
- [ ] `AttendanceSummaryCards.jsx` - Attendance summary cards
- [ ] `AttendanceFilters.jsx` - Attendance filter controls
- [ ] `AttendanceHistoryTable.jsx` - Attendance history table
- [ ] `AttendanceCalendar.jsx` - Attendance calendar
- [ ] `AttendanceTimer.jsx` - Attendance timer
- [ ] `StatusBadge.jsx` - Status badge
- [ ] `LoadingSkeleton.jsx` - Loading skeleton
- [ ] `EmptyState.jsx` - Empty state display
- [ ] `TrainingSummaryCards.jsx` - Training summary cards
- [ ] `TrainingFilters.jsx` - Training filters
- [ ] `TrainingStatusBadge.jsx` - Training status badge
- [ ] `TrainingProgressBar.jsx` - Training progress bar
- [ ] `CertificateBadge.jsx` - Certificate badge
- [ ] `TrainingRegistrationModal.jsx` - Training registration modal
- [ ] `TrainingDetailsModal.jsx` - Training details modal
- [ ] `UploadDocumentsModal.jsx` - Upload documents modal
- [ ] `NotificationSummaryCards.jsx` - Notification summary cards
- [ ] `NotificationFilters.jsx` - Notification filters
- [ ] `NotificationCard.jsx` - Notification card
- [ ] `NotificationList.jsx` - Notification list
- [ ] `NotificationDetailsModal.jsx` - Notification details modal
