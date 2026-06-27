import React from 'react';

const statusStyles = {
  Applied: 'bg-blue-100 text-blue-700',
  Interview: 'bg-amber-100 text-amber-700',
  Hired: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700',
};

const CandidateManagement = ({ candidates, setCandidates }) => {
  const handleStatusChange = (candidateId, nextStatus) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              status: nextStatus,
              movedToEmployee: nextStatus === 'Hired' ? candidate.movedToEmployee : false,
            }
          : candidate
      )
    );
  };

  const handleMoveToEmployee = (candidateId) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              movedToEmployee: true,
            }
          : candidate
      )
    );
  };

  return (
    <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Candidate Management</h2>
        <p className="mt-1 text-sm text-slate-500">
          Update candidate status and prepare hired candidates for onboarding.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Applied Job</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border-b border-slate-100 text-slate-700">
                <td className="py-4 pr-4">
                  <div>
                    <p className="font-medium text-slate-900">{candidate.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {candidate.movedToEmployee ? 'Ready for employee onboarding' : 'In recruitment'}
                    </p>
                  </div>
                </td>
                <td className="py-4 pr-4">{candidate.appliedJob}</td>
                <td className="py-4 pr-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[candidate.status]
                    }`}
                  >
                    {candidate.status}
                  </span>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex min-w-[240px] flex-col sm:flex-row gap-2">
                    <select
                      value={candidate.status}
                      onChange={(event) => handleStatusChange(candidate.id, event.target.value)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleMoveToEmployee(candidate.id)}
                      disabled={candidate.status !== 'Hired' || candidate.movedToEmployee}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                        candidate.status === 'Hired' && !candidate.movedToEmployee
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {candidate.movedToEmployee ? 'Moved to Employee' : 'Move to Employee'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateManagement;
