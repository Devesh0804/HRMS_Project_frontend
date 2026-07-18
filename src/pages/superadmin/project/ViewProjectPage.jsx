import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import BaseAPIcaller from '../../../utils/BaseApicaller';

const api = BaseAPIcaller();
const projectUrl = api.geturl(api.MODULE.PROJECT, api.OPERATIONS.GETDATA);
const deleteProjectUrl = (id) => api.geturl(api.MODULE.PROJECT, 'deleteById', id);

function ViewProjectPage() {
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (loggedIn !== 'true' || userRole !== 'superadmin') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    async function getProjectData() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(projectUrl, {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const projects = await response.json();
        setProjectList(projects);
      } catch (error) {
        console.log(error);
      }
    }

    getProjectData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (deletingId) return;
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        setDeletingId(id);
        const token = localStorage.getItem('token');
        const response = await fetch(deleteProjectUrl(id), {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (response.ok) {
          setProjectList((prev) => prev.filter((project) => project._id !== id));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setDeletingId('');
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
              <p className="text-sm text-indigo-600 font-semibold">SuperAdmin Project Module</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">View Projects</h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">
                Browse and review all projects in your organization.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/superadmin/project/add"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                + Add Project
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
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Project</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Code</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Client</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Manager</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Priority</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {projectList.map((project) => (
                    <tr key={project._id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm text-slate-900">{project.projectName}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{project.projectCode}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{project.clientName}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{project.projectManager}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{project.priority || 'N/A'}</td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                          {project.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/superadmin/project/view/${project._id}`, { state: { project } })}
                            className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/superadmin/project/edit/${project._id}`, { state: { project } })}
                            className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(project._id)}
                            disabled={deletingId === project._id}
                            className="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
                          >
                            {deletingId === project._id ? 'Deleting...' : 'Delete'}
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

export default ViewProjectPage;
