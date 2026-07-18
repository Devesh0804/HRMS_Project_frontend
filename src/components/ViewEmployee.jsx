import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseAPIcaller from '../utils/BaseApicaller.js';

const ViewEmployee = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch employee data from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const api = BaseAPIcaller();
        const url = api.geturl(api.MODULE.USER, api.OPERATIONS.GETDATA);
        const token = localStorage.getItem('token');
  

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Map backend data to display structure (showing 3-4 fields)
          const formattedEmployees = data.map((emp, index) => ({
            id: emp._id || index,
            name: `${emp.FullName?.firstName || ''} ${emp.FullName?.lastName || ''}`.trim(),
            email: emp.useremail || 'N/A',
            mobile: emp.mobile || 'N/A',
            status: emp.status || 'Active',
            details: emp
          }));
          
          setEmployees(formattedEmployees);
          // console.log('Employees loaded:', formattedEmployees);
        } else {
          console.error('Failed to fetch employees');
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) 
                      
    return matchesSearch;
  });

  const handleEdit = (id) => {
    const employee = employees.find(emp => emp.id === id);
    navigate(`/superadmin/employee/edit/${id}`, { state: { employee: employee?.details } });
  };

  //http://localhost:4000/hrms/user/deleteById/${id}
  // https://hrms-project-backend-gijz.onrender.com/hrms/user/deleteById/${id}
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`https://hrms-project-backend-gijz.onrender.com/hrms/user/deleteById/${id}`, {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
      } catch (error) {
        console.error('Error deleting employee:', error);
      }

      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const handleViewDetails = (id) => {
    const employee = employees.find(emp => emp.id === id);
    navigate(`/superadmin/employee/view/${id}`, { state: { employee: employee?.details } });
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Employee Directory</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage and view all employees in your organization.
        </p>
      </div>

      {/* Search Section */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <p className="text-slate-500">Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-8 flex items-center justify-center">
            <p className="text-slate-500">No employees found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900 hidden sm:table-cell">Email</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900 hidden md:table-cell">Mobile</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredEmployees.map(employee => (
                  <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 text-sm text-slate-900">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-xs text-slate-500 sm:hidden">{employee.email}</div>
                      <div className="text-xs text-slate-500 md:hidden">{employee.mobile}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-sm text-slate-600 hidden sm:table-cell">{employee.email}</td>
                    <td className="px-4 sm:px-6 py-3 text-sm text-slate-600 hidden md:table-cell">{employee.mobile}</td>
                    <td className="px-4 sm:px-6 py-3 text-sm">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        employee.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-sm">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleViewDetails(employee.id)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-medium transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(employee.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 flex justify-between items-center text-sm text-slate-600">
        <p>Showing {filteredEmployees.length} of {employees.length} employees</p>
      </div>
    </div>
  );
};

export default ViewEmployee;
