import SuperAdminDashboardPage from '../pages/superadmin/dashboard/SuperAdminDashboardPage';
import RecruitmentDashboard from '../pages/superadmin/recruitment/RecruitmentDashboard';
import AddAdminPage from '../pages/superadmin/admin/AddAdminPage';
import ViewAdminPage from '../pages/superadmin/admin/ViewAdminPage';
import AdminActionPage from '../pages/superadmin/admin/AdminActionPage';
import AddEmployeePage from '../pages/superadmin/employee/AddEmployeePage';
import ViewEmployeePage from '../pages/superadmin/employee/ViewEmployeePage';
import SuperAdminAttendance from '../pages/superadmin/attendance/SuperAdminAttendance';
import AddClient from '../pages/superadmin/client/AddClient';
import AddRole from '../pages/superadmin/role/AddRole';
import AddDepartment from '../pages/superadmin/department/AddDepartment';
import AddProject from '../pages/superadmin/project/AddProject';
import EditProfile from '../pages/superadmin/profile/EditProfile';
import Gate1Page from '../pages/superadmin/gate/Gate1Page';
import Gate2Page from '../pages/superadmin/gate/Gate2Page';
import Gate3Page from '../pages/superadmin/gate/Gate3Page';
import { SUPERADMIN_ROUTE_PATHS } from './routePaths';

export const superAdminRoutes = [
  {
    path: SUPERADMIN_ROUTE_PATHS.dashboard,
    element: <SuperAdminDashboardPage />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.recruitment,
    element: <RecruitmentDashboard />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.addAdmin,
    element: <AddAdminPage />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.viewAdmin,
    element: <ViewAdminPage />,
  },
  {
    path: '/superadmin/admin/view/:id',
    element: <AdminActionPage />,
  },
  {
    path: '/superadmin/admin/edit/:id',
    element: <AdminActionPage mode="edit" />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.addEmployee,
    element: <AddEmployeePage />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.viewEmployee,
    element: <ViewEmployeePage />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.attendanceView,
    element: <SuperAdminAttendance />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.addClient,
    element: <AddClient />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.addRole,
    element: <AddRole />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.addDepartment,
    element: <AddDepartment />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.addProject,
    element: <AddProject />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.editProfile,
    element: <EditProfile />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.gate1,
    element: <Gate1Page />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.gate2,
    element: <Gate2Page />,
  },
  {
    path: SUPERADMIN_ROUTE_PATHS.gate3,
    element: <Gate3Page />,
  },
  // Keep attendance manage route disabled to preserve current behavior.
  // {
  //   path: SUPERADMIN_ROUTE_PATHS.attendanceManage,
  //   element: <SuperAdminAttendance />,
  // },
];
