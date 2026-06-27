import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeForm from './EmployeeForm';
import SuperAdminNavbar from './SuperAdminNavbar';





function AddEmployee() {
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
              <p className="text-sm text-indigo-600 font-semibold">SuperAdmin Employee Module</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Add Employee</h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">
                Create new employee records from the super admin workspace using the existing project styling.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back to Main Dashboard
            </Link>
          </div>
        </header>

        <section className="space-y-6 lg:space-y-8">
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Employee Onboarding</h2>
            <p className="mt-1 text-sm text-slate-500">
              Capture employee profile, documents, and banking details from one place.
            </p>
          </div>

          <EmployeeForm
            entityLabel="Employee"
            initialVisibility={true}
            showLauncher={false}
            submitLabel="Create Employee"
          />
        </section>
      </div>
    </div>
  );
}

export default AddEmployee;
