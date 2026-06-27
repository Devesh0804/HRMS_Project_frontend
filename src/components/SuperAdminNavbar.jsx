import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthSession } from '../utils/authSession';
import {
  SUPERADMIN_ADMIN_ADD_PATH,
  SUPERADMIN_EMPLOYEE_ADD_PATH,
  SUPERADMIN_RECRUITMENT_PATH,
  superAdminNavigationGroups,
} from './superAdminNavigation';

const recruitmentIcon = (
  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m-8 0h10m-11 0h12a1 1 0 011 1v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a1 1 0 011-1z"
    />
  </svg>
);

const SuperAdminNavbar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const isGroupActive = (group) => group.links.some((link) => location.pathname === link.to);
 const [result ,setResult]= useState(false);
  const handleLogoutClick = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch('https://hrms-project-backend-gijz.onrender.com/hrms/authentication/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      clearAuthSession('superadmin');
      if (typeof onLogout === 'function') {
        onLogout();
      }
      navigate('/login');
    }
  }


  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
              HRMS
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {superAdminNavigationGroups.map((group) => {
                // console.log(group);
                
                const isActive = isGroupActive(group);
                // console.log(isActive);
                

                return (
                  <div key={group.key} className="relative dropdown">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown(openDropdown === group.key ? null : group.key)
                      }
                      className={`px-3 py-2 text-sm font-medium transition-colors flex items-center ${
                        isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                      }`}
                    >
                      {group.label}
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {openDropdown === group.key && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg z-50">
                        {group.links.map((link) => {
                          const isLinkActive = location.pathname === link.to;

                          return (
                            <Link
                              key={link.to}
                              to={link.to}
                              className={`block px-4 py-2 text-sm ${
                                isLinkActive
                                  ? 'bg-slate-100 text-indigo-600'
                                  : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link
                to={SUPERADMIN_RECRUITMENT_PATH}
                className={`px-3 py-2 text-sm font-medium transition-colors flex items-center ${
                  location.pathname === SUPERADMIN_RECRUITMENT_PATH
                    ? 'text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                {recruitmentIcon}
                Recruitment
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="text-slate-600 hover:text-slate-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            <button
              type="button"
              // onClick={onLogout}
              onClick={handleLogoutClick}
              className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-600 hover:text-slate-900 p-2"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {superAdminNavigationGroups.map((group) =>
                group.key === 'admin' || group.key === 'employee' || group.key === 'gate' ? (
                  <Link
                    key={group.key}
                    to={
                      group.key === 'admin'
                        ? SUPERADMIN_ADMIN_ADD_PATH
                        : group.key === 'employee'
                          ? SUPERADMIN_EMPLOYEE_ADD_PATH
                          : group.links[0].to
                    }
                    className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium text-left transition-colors"
                  >
                    {group.label}
                  </Link>
                ) : (
                  <button
                    key={group.key}
                    type="button"
                    className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium text-left transition-colors"
                  >
                    {group.label}
                  </button>
                )
              )}

              <Link
                to={SUPERADMIN_RECRUITMENT_PATH}
                className="text-slate-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium text-left transition-colors flex items-center"
              >
                {recruitmentIcon}
                Recruitment
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SuperAdminNavbar;
