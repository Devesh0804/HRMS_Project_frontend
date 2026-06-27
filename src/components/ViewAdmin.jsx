import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseAPIcaller from '../utils/BaseApicaller.js';

const isAdminUser = (user) => user?.roleName === 'Admin' || user?.role?.roleName === 'Admin';

const ViewAdmin = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const api = BaseAPIcaller();
        const url = api.geturl(api.MODULE.USER, api.OPERATIONS.GETDATA);

        const token = localStorage.getItem('token');
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (response.ok) {
          const data = await response.json();
          const formattedAdmins = data.filter(isAdminUser).map((admin, index) => ({
            id: admin._id || index,
            name: `${admin.FullName?.firstName || ''} ${admin.FullName?.lastName || ''}`.trim(),
            email: admin.useremail || 'N/A',
            mobile: admin.mobile || 'N/A',
            status: admin.status || 'Active',
            details: admin
          }));

          setAdmins(formattedAdmins);
        } else {
          setAdmins([]);
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
        setAdmins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter((admin) => (
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const handleEdit = (id) => {
    const admin = admins.find((item) => item.id === id);
    navigate(`/superadmin/admin/edit/${id}`, { state: { admin: admin?.details } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const api = BaseAPIcaller();
        const url = api.geturl(api.MODULE.USER, 'deleteById', id);
        const token = localStorage.getItem('token');
        await fetch(url, {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
      } catch (error) {
        console.error('Error deleting admin:', error);
      }

      setAdmins(admins.filter((admin) => admin.id !== id));
    }
  };

  const handleViewDetails = (id) => {
    const admin = admins.find((item) => item.id === id);
    navigate(`/superadmin/admin/view/${id}`, { state: { admin: admin?.details } });
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Admin Directory</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage and view all admins in your organization.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
      </div>

      <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <p className="text-slate-500">Loading admins...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-8 flex items-center justify-center">
            <p className="text-slate-500">No admins found.</p>
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
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 text-sm text-slate-900">
                      <div className="font-medium">{admin.name}</div>
                      <div className="text-xs text-slate-500 sm:hidden">{admin.email}</div>
                      <div className="text-xs text-slate-500 md:hidden">{admin.mobile}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-sm text-slate-600 hidden sm:table-cell">{admin.email}</td>
                    <td className="px-4 sm:px-6 py-3 text-sm text-slate-600 hidden md:table-cell">{admin.mobile}</td>
                    <td className="px-4 sm:px-6 py-3 text-sm">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        admin.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-sm">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleViewDetails(admin.id)}
                          className="text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-medium transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(admin.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(admin.id)}
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

      <div className="mt-4 flex justify-between items-center text-sm text-slate-600">
        <p>Showing {filteredAdmins.length} of {admins.length} admins</p>
      </div>
    </div>
  );
};

export default ViewAdmin;
