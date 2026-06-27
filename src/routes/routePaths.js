export const AUTH_ROUTE_PATHS = {
  login: '/login',
  register: '/register',
};

export const SUPERADMIN_ROUTE_PATHS = {
  dashboard: '/dashboard',
  recruitment: '/superadmin/recruitment',
  addAdmin: '/superadmin/admin/add',
  viewAdmin: '/superadmin/admin/view',
  addEmployee: '/superadmin/employee/add',
  viewEmployee: '/superadmin/employee/view',
  viewEmployeeID : '/superadmin/employee/view/${id}',
  // manageEmployee: '/superadmin/employee/manage',
  attendanceView: '/attendance/view',
  attendanceManage: '/attendance/manage',
  addClient: '/superadmin/client/add',
  addRole: '/superadmin/role/add',
  addDepartment: '/superadmin/department/add',
  viewDepartment: '/superadmin/department/view',
  addProject: '/superadmin/project/add',
  editProfile: '/superadmin/profile/edit',
  gate1: '/superadmin/gate/gate1',
  gate2: '/superadmin/gate/gate2',
  gate3: '/superadmin/gate/gate3',
};

export const EMPLOYEE_ROUTE_PATHS = {
  add: '/superadmin/employee/add',
  view: '/superadmin/employee/view',
  manage: '/superadmin/employee/manage',
  dashboard: '/employee/dashboard',
  attendance: '/employee/attendance',
  attendanceVerify: '/employee/attendance/verify',
  profile: '/employee/profile',
  form: '/employee/form',
  leave: '/employee/leave',
  payroll: '/employee/payroll',
  qrScanner: '/employee/qr-scanner',
};

export const DEFAULT_ROUTE_PATHS = {
  root: '/',
  fallback: '*',
};
