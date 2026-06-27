import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CandidateManagement from './CandidateManagement';
import JobManagement from './JobManagement';
import RecruitmentStats from './RecruitmentStats';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';

const RecruitmentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Bangalore',
      salary: '8 LPA',
      description: 'Build and maintain modern user interfaces.',
      status: 'Open',
    },
    {
      id: 2,
      title: 'HR Executive',
      department: 'Human Resources',
      location: 'Mumbai',
      salary: '5.5 LPA',
      description: 'Support employee engagement and HR operations.',
      status: 'Open',
    },
    {
      id: 3,
      title: 'UI Designer',
      department: 'Design',
      location: 'Remote',
      salary: '6.5 LPA',
      description: 'Create reusable design systems and flows.',
      status: 'Closed',
    },
  ]);
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Aarav Sharma', appliedJob: 'Frontend Developer', status: 'Interview', movedToEmployee: false },
    { id: 2, name: 'Priya Verma', appliedJob: 'HR Executive', status: 'Applied', movedToEmployee: false },
    { id: 3, name: 'Rohan Mehta', appliedJob: 'UI Designer', status: 'Hired', movedToEmployee: false },
    { id: 4, name: 'Sneha Kapoor', appliedJob: 'Frontend Developer', status: 'Rejected', movedToEmployee: false },
  ]);

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

  const topStats = useMemo(
    () => [
      {
        label: 'Total Jobs',
        value: jobs.length,
        helper: 'Current job postings',
      },
      {
        label: 'Total Candidates',
        value: candidates.length,
        helper: 'Candidates in pipeline',
      },
      {
        label: 'Hired',
        value: candidates.filter((candidate) => candidate.status === 'Hired').length,
        helper: 'Selected candidates',
      },
      {
        label: 'Rejected',
        value: candidates.filter((candidate) => candidate.status === 'Rejected').length,
        helper: 'Closed applications',
      },
    ],
    [candidates, jobs]
  );

  const renderActiveSection = () => {
    if (activeTab === 'jobs') {
      return <JobManagement jobs={jobs} setJobs={setJobs} />;
    }

    return <CandidateManagement candidates={candidates} setCandidates={setCandidates} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-semibold">SuperAdmin Recruitment Module</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                Recruitment Dashboard
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">
                Manage job openings, track candidates, and review hiring progress.
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
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {topStats.map((card) => (
              <div
                key={card.label}
                className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm"
              >
                <p className="text-xs sm:text-sm text-slate-500">{card.label}</p>
                <p className="mt-2 sm:mt-3 lg:mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900">
                  {card.value}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">{card.helper}</p>
              </div>
            ))}
          </div>

          <RecruitmentStats candidates={candidates} />

          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setActiveTab('jobs')}
                className={`rounded-lg px-5 py-3 text-sm font-medium transition ${
                  activeTab === 'jobs'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Job Management
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('candidates')}
                className={`rounded-lg px-5 py-3 text-sm font-medium transition ${
                  activeTab === 'candidates'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Candidates
              </button>
            </div>
          </div>

          {renderActiveSection()}
        </section>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;
