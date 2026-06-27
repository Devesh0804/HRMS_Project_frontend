import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Attendence } from './Graphs/attendenceRaph';
import { Department } from './Graphs/Department';
import { EmployeeGraph } from './Graphs/EmployeeGraph';
import { EmployeePerformance } from './Graphs/EmployeePerformance';
import { AreaGraph } from './Graphs/AreaGraph';
import SuperAdminNavbar from './SuperAdminNavbar';
import BaseAPIcaller from '../utils/BaseApicaller.js';
import { clearAuthSession } from '../utils/authSession';


const api = BaseAPIcaller();
const user_url = api.geturl(api.MODULE.USER,api.OPERATIONS.GETDATA);
const dept_url = api.geturl(api.MODULE.DEPARTMENT,api.OPERATIONS.GETDATA)



const Dashboard = () => {

  const [employees,setEmployees] = useState();
  const [departments , setDepartment] = useState();


  useEffect(()=>{
     async function fetchData(){
       const token = localStorage.getItem('token');
       const UserResponse = await fetch(user_url,{
        method : 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
        
      const Userdata = await UserResponse.json();
      setEmployees(Userdata.length);

      const deptResponse = await fetch(dept_url,{
        method : 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
      const departData = await deptResponse.json();
      setDepartment(departData.length)

     }

     fetchData();
      
  },[])






  const navigate = useNavigate();
  const [isActivityTrackerOpen, setIsActivityTrackerOpen] = useState(true);

  useEffect(() => {
    const isSuperAdminSession = localStorage.getItem('isSuperAdminLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    if (!isSuperAdminSession && userRole !== 'superadmin') {
      navigate('/login');
    }
  }, [navigate]);

  const [activities, setActivities] = useState([
    { id: 1, title: 'SuperAdmin login', time: '2 min ago', status: 'Success' },
    { id: 2, title: 'Department created', time: '15 min ago', status: 'Success' },
    { id: 3, title: 'Admin account added', time: '1 hour ago', status: 'Success' }
  ]);

  const handleLogout = () => {
    clearAuthSession('superadmin');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6  lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div>
            <p className="text-sm text-indigo-600 font-semibold">SuperAdmin Dashboard</p>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Welcome back, SuperAdmin</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">Manage your HRMS system efficiently.</p>
          </div>
        </header>

        <section className="space-y-6 lg:space-y-8">
          {/* Main Content */}
          <div className="space-y-6 max lg:space-y-8">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
                <p className="text-xs sm:text-sm text-slate-500">Total Employees</p>
                <p className="mt-2 sm:mt-3 lg:mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900">{employees}</p>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">Active employees</p>
              </div>
              <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
                <p className="text-xs sm:text-sm text-slate-500">Departments</p>
                <p className="mt-2 sm:mt-3 lg:mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900">{departments}</p>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">Active departments</p>
              </div>
              <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
                <p className="text-xs sm:text-sm text-slate-500">Projects</p>
                <p className="mt-2 sm:mt-3 lg:mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900">0</p>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">Active projects</p>
              </div>
              <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
                <p className="text-xs sm:text-sm text-slate-500">Attendance</p>
                <p className="mt-2 sm:mt-3 lg:mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900">0%</p>
                <p className="mt-1 text-xs sm:text-sm text-slate-500">Today</p>
              </div>
            </div>

            {/* Graphs Row 1 - Two Graphs */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
              <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm w-full overflow-hidden">
                <div className="w-full h-48 sm:h-60 lg:h-80 flex items-center justify-center">
                  <EmployeeGraph/>
                </div>
              </div>
              <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm w-full overflow-hidden">
                <div className="w-full h-48 sm:h-60 lg:h-80 flex items-center justify-center">
                 <EmployeePerformance/>
                </div>
              </div>
            </div>

            {/* Graphs Row 2 - Two Graphs */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
              <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm w-full overflow-hidden">
                <div className="w-full h-48 sm:h-60 lg:h-80 flex items-center justify-center">
                 <Department/>  
                </div>
              </div>
              <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm w-full overflow-hidden">
                <div className="w-full h-48 sm:h-60 lg:h-80 flex items-center justify-center">
                  <AreaGraph/>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Activity Tracker */}
          {isActivityTrackerOpen && (
            <aside className="space-y-6 lg:space-y-8">
              <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm relative">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">Activity tracker</h2>
                  <button
                    onClick={() => setIsActivityTrackerOpen(false)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label="Close activity tracker"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">Recent actions in your dashboard.</p>
                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  {activities.slice(0, 5).map(item => (
                    <div key={item.id} className="rounded-lg sm:rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                      <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
                        <p className="text-sm sm:text-base font-medium text-slate-900 flex-1 min-w-0">{item.title}</p>
                        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 whitespace-nowrap">{item.status}</span>
                      </div>
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Open Activity Tracker Button */}
          {!isActivityTrackerOpen && (
            <div className="flex justify-center">
              <button
                onClick={() => setIsActivityTrackerOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition"
              >
                Show Activity Tracker
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
