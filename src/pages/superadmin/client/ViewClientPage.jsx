import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import BaseAPIcaller from '../../../utils/BaseApicaller';

const api = BaseAPIcaller();
const clientUrl = api.geturl(api.MODULE.CLIENT, api.OPERATIONS.GETDATA);
const deleteClientUrl = (id) => api.geturl(api.MODULE.CLIENT, 'deleteById', id);

const getClientName = (client) => client.companyName || client.ORG_Name || client.clientName || 'N/A';
const getClientCode = (client) => client.clientCode || client.orgmobile || 'N/A';
const getContactPerson = (client) => client.contactPerson || client.clientName || 'N/A';
const getClientEmail = (client) => client.email || client.orgemail || client.ownemail || 'N/A';
const getClientPhone = (client) => client.phone || client.orgmobile || client.ownmobile || 'N/A';

function ViewClientPage() {
  const navigate = useNavigate();
  const [clientList, setClientList] = useState([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (loggedIn !== 'true' || userRole !== 'superadmin') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    async function getClientData() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(clientUrl, {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const clients = await response.json();
        setClientList(clients);
      } catch (error) {
        console.log(error);
      }
    }

    getClientData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(deleteClientUrl(id), {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (response.ok) {
          setClientList((prev) => prev.filter((client) => client._id !== id));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-semibold">SuperAdmin Client Module</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">View Clients</h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">
                Browse and review all clients in your organization.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/superadmin/client/add"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                + Add Client
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </Link>
            </div>
          </div>
        </header>

        <section className="space-y-6 lg:space-y-8">
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Company</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Code</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Contact Person</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Email</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Phone</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {clientList.map((client) => (
                    <tr key={client._id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm text-slate-900">{getClientName(client)}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{getClientCode(client)}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{getContactPerson(client)}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{getClientEmail(client)}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{getClientPhone(client)}</td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <span className={`inline-flex rounded-full px-3 py-1 ${client.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/superadmin/client/view/${client._id}`, { state: { client } })}
                            className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/superadmin/client/edit/${client._id}`, { state: { client } })}
                            className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(client._id)}
                            className="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700"
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
          </div>
        </section>
      </div>
    </div>
  );
}

export default ViewClientPage;
