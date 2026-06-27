import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import BaseAPIcaller from '../../../utils/BaseApicaller';

const api = BaseAPIcaller();
const dept_url = api.geturl(api.MODULE.DEPARTMENT,api.OPERATIONS.GETDATA);
const delete_dept_url = (id) => api.geturl(api.MODULE.DEPARTMENT,'deleteById',id);



function ViewDepartmentPage() {

//     const departmentList = [
 
// ];

const [departmentList , setDepartmentList] = useState([]);

useEffect(()=>{
    let departmentlist =[]
    async function getDeptData(){
      const token = localStorage.getItem('token');
      const response = await fetch(dept_url,{
        method : 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })

         departmentlist = await response.json();
         console.log(departmentlist);
         
        await setDepartmentList(departmentlist)
        
        
    }
    getDeptData();
  
},[])






  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(delete_dept_url(id), {
          method: 'DELETE',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (response.ok) {
          setDepartmentList((prev) => prev.filter((department) => department._id !== id));
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
              <p className="text-sm text-indigo-600 font-semibold">SuperAdmin Department Module</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">View Departments</h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">
                Browse and review all departments in your organization.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/superadmin/department/add"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                + Add Department
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
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Department</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Code</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Min Salary</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Max Salary</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Users</th>
                    <th className="px-4 py-3 text-sm font-semibold uppercase">Actions</th>
                    
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {departmentList.map((department) => (
                    <tr key={department._id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm text-slate-900">{department.deptName}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{department.deptCode}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{department.salary.minSalary}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{department.salary.maxSalary}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">{department.users.length}</td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/superadmin/department/view/${department._id}`, { state: { department } })}
                            className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/superadmin/department/edit/${department._id}`, { state: { department } })}
                            className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(department._id)}
                            className="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                      {/* <td className="px-4 py-4 text-sm font-medium">
                        <span className={`inline-flex rounded-full px-3 py-1 ${department.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                          {department.status}
                        </span>
                      </td> */}
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

export default ViewDepartmentPage;
