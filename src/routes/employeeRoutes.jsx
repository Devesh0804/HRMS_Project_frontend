import { Navigate } from 'react-router-dom';
import EmployeeDashboardPage from '../pages/employee/dashboard/EmployeeDashboardPage';
import EmployeeAttendancePage from '../pages/employee/attendance/EmployeeAttendancePage';
import EmployeeProfilePage from '../pages/employee/profile/EmployeeProfilePage';
import EmployeeLeavePage from '../pages/employee/leave/EmployeeLeavePage';
import EmployeePayrollPage from '../pages/employee/payroll/EmployeePayrollPage';
import EmployeeQrScannerPage from '../pages/employee/qr-scanner/EmployeeQrScannerPage';
import EmployeeAttendanceVerifyPage from '../pages/employee/attendance/EmployeeAttendanceVerifyPage';
import { EMPLOYEE_ROUTE_PATHS, SUPERADMIN_ROUTE_PATHS } from './routePaths';

export const employeeRoutes = [
  {
    path: EMPLOYEE_ROUTE_PATHS.add,
    element: <Navigate to={SUPERADMIN_ROUTE_PATHS.addEmployee} replace />,
  },
  {
    path: EMPLOYEE_ROUTE_PATHS.view,
    element: <Navigate to={SUPERADMIN_ROUTE_PATHS.addEmployee} replace />,
  },
  {
    path: EMPLOYEE_ROUTE_PATHS.manage,
    element: <Navigate to={SUPERADMIN_ROUTE_PATHS.addEmployee} replace />,
  },
  {
    path: EMPLOYEE_ROUTE_PATHS.form,
    element: <Navigate to={SUPERADMIN_ROUTE_PATHS.addEmployee} replace />,
  },
  {
    path: EMPLOYEE_ROUTE_PATHS.dashboard,
    element: <EmployeeDashboardPage />,
  },
  {
    path: EMPLOYEE_ROUTE_PATHS.attendance,
    element: <EmployeeAttendancePage />,
  },
  {
    path: EMPLOYEE_ROUTE_PATHS.attendanceVerify,
    element: <EmployeeAttendanceVerifyPage />,
  },
  {
    path: EMPLOYEE_ROUTE_PATHS.profile,
    element: <EmployeeProfilePage />,
  },
  {
    path: EMPLOYEE_ROUTE_PATHS.leave,
    element: <EmployeeLeavePage />,
  },
  {
    path: EMPLOYEE_ROUTE_PATHS.payroll,
    element: <EmployeePayrollPage />,
  },
  {
    path: EMPLOYEE_ROUTE_PATHS.qrScanner,
    element: <EmployeeQrScannerPage />,
  },
];
