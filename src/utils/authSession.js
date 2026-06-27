const SUPERADMIN_SESSION = {
  loggedInKey: 'isSuperAdminLoggedIn',
  roleKey: 'superadminRole',
  tokenKey: 'superadminToken',
};

const EMPLOYEE_SESSION = {
  loggedInKey: 'isEmployeeLoggedIn',
  roleKey: 'employeeRole',
  tokenKey: 'employeeToken',
};

const setGlobalAuth = (role) => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userRole', role);
};

const clearGlobalAuth = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  localStorage.removeItem('token');
};

export const setAuthSession = (role, token = null) => {
  const normalizedRole = role === 'superadmin' ? 'superadmin' : 'employee';

  if (normalizedRole === 'superadmin') {
    localStorage.setItem(SUPERADMIN_SESSION.loggedInKey, 'true');
    localStorage.setItem(SUPERADMIN_SESSION.roleKey, 'superadmin');
    if (token) {
      localStorage.setItem(SUPERADMIN_SESSION.tokenKey, token);
      localStorage.setItem('token', token);
    }
    setGlobalAuth('superadmin');
    return;
  }

  localStorage.setItem(EMPLOYEE_SESSION.loggedInKey, 'true');
  localStorage.setItem(EMPLOYEE_SESSION.roleKey, 'employee');
  if (token) {
    localStorage.setItem(EMPLOYEE_SESSION.tokenKey, token);
    localStorage.setItem('token', token);
  }
  setGlobalAuth('employee');
};

const restoreAlternateAuth = (remainingRole) => {
  if (remainingRole === 'superadmin') {
    const token = localStorage.getItem(SUPERADMIN_SESSION.tokenKey);
    if (token) {
      localStorage.setItem('token', token);
    }
    setGlobalAuth('superadmin');
    return;
  }

  const token = localStorage.getItem(EMPLOYEE_SESSION.tokenKey);
  if (token) {
    localStorage.setItem('token', token);
  }
  setGlobalAuth('employee');
};

export const clearAuthSession = (role) => {
  const normalizedRole = role === 'superadmin' ? 'superadmin' : 'employee';

  if (normalizedRole === 'superadmin') {
    localStorage.removeItem(SUPERADMIN_SESSION.loggedInKey);
    localStorage.removeItem(SUPERADMIN_SESSION.roleKey);
    localStorage.removeItem(SUPERADMIN_SESSION.tokenKey);

    const employeeLoggedIn = localStorage.getItem(EMPLOYEE_SESSION.loggedInKey) === 'true';
    if (employeeLoggedIn) {
      restoreAlternateAuth('employee');
      return;
    }

    clearGlobalAuth();
    return;
  }

  localStorage.removeItem(EMPLOYEE_SESSION.loggedInKey);
  localStorage.removeItem(EMPLOYEE_SESSION.roleKey);
  localStorage.removeItem(EMPLOYEE_SESSION.tokenKey);

  const superAdminLoggedIn = localStorage.getItem(SUPERADMIN_SESSION.loggedInKey) === 'true';
  if (superAdminLoggedIn) {
    restoreAlternateAuth('superadmin');
    return;
  }

  clearGlobalAuth();
};

export const isAuthenticated = (role) => {
  const normalizedRole = role === 'superadmin' ? 'superadmin' : 'employee';
  const sessionKey = normalizedRole === 'superadmin' ? SUPERADMIN_SESSION.loggedInKey : EMPLOYEE_SESSION.loggedInKey;
  return localStorage.getItem(sessionKey) === 'true';
};

export const isSuperAdminAuthenticated = () => localStorage.getItem(SUPERADMIN_SESSION.loggedInKey) === 'true';
export const isEmployeeAuthenticated = () => localStorage.getItem(EMPLOYEE_SESSION.loggedInKey) === 'true';
