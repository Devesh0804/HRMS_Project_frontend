import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ViewAdmin from '../../../components/ViewAdmin';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';

function ViewAdminPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (loggedIn !== 'true' || userRole !== 'superadmin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-semibold">SuperAdmin Admin Module</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">View Admins</h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">
                Browse and manage all admins in your organization.
              </p>
            </div>

            <Link
              to="/superadmin/admin/add"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              + Add Admin
            </Link>
          </div>
        </header>

        <section className="space-y-6 lg:space-y-8">
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            <ViewAdmin />
          </div>
        </section>
      </div>
    </div>
  );
}

export default ViewAdminPage;
