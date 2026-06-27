import React, { useState, useEffect } from 'react';
import MainLayout from './MainLayout';
import EmployeePerformanceOverview from './EmployeePerformanceOverview';
import AttendanceButton from '../AttendanceButton';

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState({
    username: '',
    department: '',
    position: '',
    joinDate: ''
  });

  useEffect(() => {
    // Load employee data from localStorage
    const username = localStorage.getItem('userName');
    console.log(username);
    
    // const email = localStorage.getItem('employeeEmail');

    setEmployeeData(prev => ({
      ...prev,
      username: username || 'Employee',
      department: 'Human Resources',
      position: 'Employee',
      joinDate: new Date().toLocaleDateString()
    }));
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Welcome, {employeeData.username}! 👋</h2>
          <p className="text-gray-600 text-sm sm:text-base">Here's what's happening at your company today</p>
        </div>
              <AttendanceButton />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Present Days</p>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-1 sm:mt-2">18</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 ml-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2H3a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V5a3 3 0 00-3-3h-1a1 1 0 000 2h1a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Absent Days</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1 sm:mt-2">2</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0 ml-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Leave Balance</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">8</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0 ml-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.27 6.066 6.066 0 01-5.849 6.471 6.066 6.066 0 01-6.571-5.85 3.066 3.066 0 012.812-3.27z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        <EmployeePerformanceOverview />

        {/* Profile Information */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Employee Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Username</p>
              <p className="text-base sm:text-lg font-semibold text-gray-800">{employeeData.username}</p>
            </div>
            {/* <div>
              <p className="text-gray-600 text-xs sm:text-sm">Email</p>
              <p className="text-base sm:text-lg font-semibold text-gray-800 ">{employeeData.email}</p>
            </div> */}
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Department</p>
              <p className="text-base sm:text-lg font-semibold text-gray-800">{employeeData.department}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs sm:text-sm">Position</p>
              <p className="text-base sm:text-lg font-semibold text-gray-800">{employeeData.position}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-gray-600 text-xs sm:text-sm">Join Date</p>
              <p className="text-base sm:text-lg font-semibold text-gray-800">{employeeData.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold transition">
                Request Leave
              </button>
              <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-semibold transition">
                View Payslip
              </button>
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition">
                Update Profile
              </button>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Recent Announcements</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-indigo-600 pl-4 py-2">
                <p className="text-sm text-gray-600">Company Event</p>
                <p className="text-gray-800 font-semibold">Annual Team Building Activity</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4 py-2">
                <p className="text-sm text-gray-600">HR Update</p>
                <p className="text-gray-800 font-semibold">New Leave Policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmployeeDashboard;
