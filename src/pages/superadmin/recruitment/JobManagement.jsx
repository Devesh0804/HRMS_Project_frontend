import React, { useState } from 'react';

const emptyForm = {
  title: '',
  department: '',
  location: '',
  salary: '',
  description: '',
};

const JobManagement = ({ jobs, setJobs }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [editingJobId, setEditingJobId] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingJobId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.title || !formData.department || !formData.location || !formData.description) {
      return;
    }

    if (editingJobId) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === editingJobId
            ? {
                ...job,
                title: formData.title,
                department: formData.department,
                location: formData.location,
                salary: formData.salary || 'Not specified',
                description: formData.description,
              }
            : job
        )
      );
    } else {
      setJobs((prev) => [
        {
          id: Date.now(),
          title: formData.title,
          department: formData.department,
          location: formData.location,
          salary: formData.salary || 'Not specified',
          description: formData.description,
          status: 'Open',
        },
        ...prev,
      ]);
    }

    resetForm();
  };

  const handleEdit = (job) => {
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      salary: job.salary === 'Not specified' ? '' : job.salary,
      description: job.description,
    });
    setEditingJobId(job.id);
  };

  const handleDelete = (jobId) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
    if (editingJobId === jobId) {
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Job Management</h2>
          <p className="mt-1 text-sm text-slate-500">
            Add new openings and maintain your current recruitment pipeline.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
              // placeholder="Frontend Developer"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
              // placeholder="Engineering"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
              // placeholder="Bangalore"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Salary (Optional)
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
              // placeholder="8 LPA"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Write the main responsibilities and requirements"
              required
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              {editingJobId ? 'Update Job' : 'Add Job'}
            </button>
            {editingJobId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Open Positions</h3>
          <p className="mt-1 text-sm text-slate-500">Dummy data for the recruitment workflow.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="pb-3 pr-4 font-medium">Job Title</th>
                <th className="pb-3 pr-4 font-medium">Department</th>
                <th className="pb-3 pr-4 font-medium">Location</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-slate-100 text-slate-700">
                  <td className="py-4 pr-4">
                    <div>
                      <p className="font-medium text-slate-900">{job.title}</p>
                      <p className="mt-1 text-xs text-slate-500"></p>
                    </div>
                  </td>
                  <td className="py-4 pr-4">{job.department}</td>
                  <td className="py-4 pr-4">{job.location}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        job.status === 'Open'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(job)}
                        className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(job.id)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100"
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
    </div>
  );
};

export default JobManagement;
