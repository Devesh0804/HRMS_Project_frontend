import React, { useState, useEffect } from 'react';
import MainLayout from './MainLayout';

const Profile = () => {
  const [employeeData, setEmployeeData] = useState({
    username: '',
    email: '',
    department: '',
    role: '',
    joinDate: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    // Load employee data from localStorage
    const username = localStorage.getItem('employeeUsername');
    const email = localStorage.getItem('employeeEmail');

    setEmployeeData({
      username: username || 'Employee',
      email: email || 'employee@company.com',
      department: 'Human Resources',
      role: 'Employee',
      joinDate: new Date().toLocaleDateString()
    });
  }, []);

  const handleEdit = () => {
    setEditData({ ...employeeData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setEmployeeData({ ...editData });
    setIsEditing(false);
    // In a real app, you would save to backend here
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">My Profile</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage your personal information and account details</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Personal Information</h3>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm sm:text-base"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.username || ''}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-base sm:text-lg font-semibold text-gray-800">{employeeData.username}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-base sm:text-lg font-semibold text-gray-800 break-words">{employeeData.email}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-base sm:text-lg font-semibold text-gray-800">{employeeData.department}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.role || ''}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-base sm:text-lg font-semibold text-gray-800">{employeeData.role}</p>
                )}
              </div>

              {/* Join Date */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.joinDate || ''}
                    onChange={(e) => handleInputChange('joinDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-base sm:text-lg font-semibold text-gray-800">{employeeData.joinDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Account Information</h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700">Employee ID</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">EMP001</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Account Status</p>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-green-600 bg-green-100">
                  Active
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Last Login</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Password</p>
                <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;