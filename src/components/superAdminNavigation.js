import { EMPLOYEE_ROUTE_PATHS, SUPERADMIN_ROUTE_PATHS } from '../routes/routePaths';

export const SUPERADMIN_ADMIN_ADD_PATH = SUPERADMIN_ROUTE_PATHS.addAdmin;
export const SUPERADMIN_EMPLOYEE_ADD_PATH = SUPERADMIN_ROUTE_PATHS.addEmployee;
export const SUPERADMIN_RECRUITMENT_PATH = SUPERADMIN_ROUTE_PATHS.recruitment;

export const superAdminNavigationGroups = [
  {
    key: 'attendance',
    label: 'Attendance',
    links: [
      { to: SUPERADMIN_ROUTE_PATHS.attendanceView, label: 'View Attendance' },
      { to: SUPERADMIN_ROUTE_PATHS.attendanceManage, label: 'Manage Attendance' },
    ],
  },  
  {
    key: 'employee',
    label: 'Employee',
    links: [
      { to: SUPERADMIN_ROUTE_PATHS.addEmployee, label: 'Add Employee' },
      { to: SUPERADMIN_ROUTE_PATHS.viewEmployee, label: 'View Employees' },
      {to: SUPERADMIN_ROUTE_PATHS.viewEmployeeID, lable : 'View Employee Id'}

    ],
  },
    {
    key: 'gate',
    label: 'Gate',
    links: [
      { to: SUPERADMIN_ROUTE_PATHS.gate1, label: 'Gate 1' },
      { to: SUPERADMIN_ROUTE_PATHS.gate2, label: 'Gate 2' },
      { to: SUPERADMIN_ROUTE_PATHS.gate3, label: 'Gate 3' },
    ],
  },
  {
    key: 'admin',
    label: 'Admin',
    links: [
      { to: SUPERADMIN_ADMIN_ADD_PATH, label: 'Add Admin' },
      { to: SUPERADMIN_ROUTE_PATHS.viewAdmin, label: 'View Admins' },
    ],
  },
  {
    key: 'client',
    label: 'Client',
    links: [
      { to: SUPERADMIN_ROUTE_PATHS.addClient, label: 'Add Client' },
      { to: '/superadmin/client/view', label: 'View Clients' },
    ],
  },
  {
    key: 'role',
    label: 'Role',
    links: [
      { to: SUPERADMIN_ROUTE_PATHS.addRole, label: 'Add Role' },
      { to: '/superadmin/role/view', label: 'View Roles' },
    ],
  },
  {
    key: 'department',
    label: 'Department',
    links: [
      { to: SUPERADMIN_ROUTE_PATHS.addDepartment, label: 'Add Department' },
      { to: '/superadmin/department/view', label: 'View Departments' },
    ],
  },
  {
    key: 'project',
    label: 'Project',
    links: [
      { to: SUPERADMIN_ROUTE_PATHS.addProject, label: 'Add Project' },
      { to: '/superadmin/project/view', label: 'View Projects' },
    ],
  },
  {
    key: 'profile',
    label: 'Profile',
    links: [
      { to: '/superadmin/profile/view', label: 'View Profile' },
      { to: SUPERADMIN_ROUTE_PATHS.editProfile, label: 'Edit Profile' },
    ],
  },
];
