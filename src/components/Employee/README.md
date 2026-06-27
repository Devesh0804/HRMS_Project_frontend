# Employee Module Documentation

## Overview
The Employee Module provides authentication and dashboard for employees in the HRMS application. Employees receive their login credentials (username and password) from the SuperAdmin and use them to access their dashboard.

## File Structure
```
frontend/hrms_project/src/components/
├── Employee/
│   ├── EmployeeLogin.jsx       - Employee login form
│   ├── EmployeeRegister.jsx    - [COMMENTED OUT] Not used - SuperAdmin creates employees
│   └── EmployeeDashboard.jsx   - Employee dashboard with stats
```

## Features

### 1. EmployeeLogin Component
- **Path**: `/employee/login`
- **Fields**:
  - Username (provided by SuperAdmin)
  - Email Address (provided by SuperAdmin)
  - Password (provided by SuperAdmin)
- **Features**:
  - Form validation (email format, password length)
  - Error messages for each field
  - Remember me checkbox
  - Forgot password link
  - Clear note: "Credentials provided by SuperAdmin"
  - Link to admin login

### 2. EmployeeRegister Component
- **Status**: ⚠️ **COMMENTED OUT** - Not in use
- **Reason**: Employee registration is handled by SuperAdmin only
- **File**: `EmployeeRegister.jsx` (kept for reference)

### 3. EmployeeDashboard Component
- **Path**: `/employee/dashboard`
- **Features**:
  - Sidebar navigation
  - Quick stats (Present Days, Absent Days, Leave Balance, Performance)
  - Employee information display
  - Quick action buttons
  - Recent announcements section
  - Logout functionality

## Styling
All components use **Tailwind CSS** for styling with:
- Responsive design (mobile, tablet, desktop)
- Gradient backgrounds
- Hover effects and transitions
- Color-coded sections (indigo theme for primary, red for alerts, green for success)

## Routes in App.jsx
```javascript
/employee/login          - Employee login page
/employee/dashboard      - Employee dashboard (main area)
// /employee/register    - [COMMENTED OUT] SuperAdmin handles registration
```

## LocalStorage Keys
The following keys are used for session management:
- `isEmployeeLoggedIn` - Boolean flag for login status
- `employeeUsername` - Stored employee username
- `employeeEmail` - Stored employee email

## Employee Registration Flow
1. **SuperAdmin** creates employee account via SuperAdmin panel
2. **SuperAdmin** assigns username and password to the employee
3. **Employee** receives credentials via email/notification
4. **Employee** uses `/employee/login` with provided credentials
5. **Employee** accesses `/employee/dashboard` after successful login

## TODO - Backend Integration
Replace the TODO comments in the components with actual API calls:
1. **EmployeeLogin.jsx**: Connect to employee login API endpoint (verify credentials against backend)
2. **EmployeeDashboard.jsx**: Fetch employee data and stats from backend

## Navigation
- Users start at `/` which redirects to admin login (`/login`)
- Employees access their portal at `/employee/login`
- After login, employees are redirected to `/employee/dashboard`

## Mobile Responsive
All components are fully responsive with:
- Mobile-first design approach
- Collapsible sidebar in dashboard
- Touch-friendly buttons and inputs
- Adaptive grid layouts
