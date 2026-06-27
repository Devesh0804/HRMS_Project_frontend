import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { clearAuthSession } from '../../utils/authSession';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    const isEmployeeLoggedIn = localStorage.getItem('isEmployeeLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    // eslint-disable-next-line no-console
    console.debug('[MainLayout] auth check -> isEmployeeLoggedIn:', isEmployeeLoggedIn, 'userRole:', userRole);

    const hasEmployeeRole = userRole === 'employee' || userRole === 'user';

    if (!isEmployeeLoggedIn || !hasEmployeeRole) {
      navigate('/login');
      return;
    }

    // Load employee data from localStorage
    const username = localStorage.getItem('employeeUsername');
    const email = localStorage.getItem('employeeEmail');

    setEmployeeData({
      username: username || 'Employee',
      email: email || 'employee@company.com'
    });
  }, [navigate]);

  const handleLogout = () => {
    // Remove stored JWT token and attendance state when employee logs out
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded && decoded._id) {
          localStorage.removeItem(`attendance-status-${decoded._id}`);
        }
      } catch (e) {
        // ignore
      }
    }

    clearAuthSession('employee');
    localStorage.removeItem('employeeUsername');
    localStorage.removeItem('employeeEmail');
    navigate('/login');
  };

  const navigationItems = [
    { path: '/employee/dashboard', label: 'Dashboard', icon: 'home' },
    { path: '/employee/profile', label: 'My Profile', icon: 'profile' },
    { path: '/employee/attendance', label: 'Attendance', icon: 'attendance' },
    { path: '/employee/qr-scanner', label: 'QR Scanner', icon: 'qr' },
    { path: '/employee/leave', label: 'Leave Requests', icon: 'leave' },
    { path: '/employee/payroll', label: 'Payroll', icon: 'payroll' }
    
  ];

  const getIcon = (iconType) => {
    switch (iconType) {
      case 'home':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        );
      case 'profile':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v4h8v-4zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        );
      case 'attendance':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2H3a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V5a3 3 0 00-3-3h-1a1 1 0 000 2h1a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5z" clipRule="evenodd" />
          </svg>
        );
      case 'qr':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm6-2h6v6h-6V3zm2 2v2h2V5h-2zM3 11h6v6H3v-6zm2 2v2h2v-2H5zm8-2h2v2h-2v-2zm-2 0h2v2h-2v-2zm2 4h2v2h-2v-2zm2-2h2v4h-2v-4zm-4 0h2v2h-2v-2zm0 2h2v2h-2v-2z" />
          </svg>
        );
      case 'leave':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        );
      case 'payroll':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        );
      case 'messages':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 100-2 1 1 0 000 2zM8 7a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 w-full shrink-0">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle sidebar"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-600">HRMS - Employee Portal</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/employee/qr-scanner"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Open QR scanner"
              title="Open QR scanner"
            >
              {getIcon('qr')}
            </Link>
            <span className="text-gray-700 text-sm sm:text-base hidden sm:block">{employeeData.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 relative min-h-0">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`bg-indigo-900 text-white transition-all duration-300 transform overflow-hidden ${
            sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'
          } fixed top-16 left-0 z-40 bottom-0 lg:translate-x-0 lg:w-64 lg:sticky lg:top-0 lg:left-auto lg:bottom-auto lg:z-0 lg:h-full`}
        >
          <nav className="p-4 sm:p-6 h-full overflow-y-auto">
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-full text-right mb-4 text-white hover:text-gray-300 focus:outline-none"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    location.pathname === item.path
                      ? 'bg-indigo-700 text-white'
                      : 'hover:bg-indigo-800 text-gray-100'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {getIcon(item.icon)}
                  <span className="text-sm sm:text-base">{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-0 p-4 sm:p-6 lg:p-8 w-full overflow-y-auto relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
