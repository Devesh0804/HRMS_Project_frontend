import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import PageHeader from '../../../components/hrms/PageHeader';
import FormInput from '../../../components/hrms/FormInput';
import FormActions from '../../../components/hrms/FormActions';
import BaseAPIcaller from '../../../utils/BaseApicaller';
import handleApiResponse from '../../../utils/BaseApiResponse';

const createInitialFormData = () => ({
  deptName: '',
  deptCode: '',
  salary: {
    minSalary: '',
    maxSalary: ''
  },
  createdBy: '',
  updatedBy: ''
});

const makeFormData = (department) => ({
  deptName: department?.deptName || '',
  deptCode: department?.deptCode || '',
  salary: {
    minSalary: department?.salary?.minSalary || '',
    maxSalary: department?.salary?.maxSalary || ''
  },
  createdBy: department?.createdBy || '',
  updatedBy: department?.updatedBy || ''
});

function DepartmentActionPage({ mode = 'view' }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isViewMode = mode === 'view';

  const [formData, setFormData] = useState(createInitialFormData);
  const [initialFormData, setInitialFormData] = useState(createInitialFormData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (loggedIn !== 'true' || userRole !== 'superadmin') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const loadDepartment = async () => {
      try {
        const api = BaseAPIcaller();
        const token = localStorage.getItem('token');
        const response = await fetch(api.geturl(api.MODULE.DEPARTMENT, api.OPERATIONS.SEARCHBYID, id), {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const data = await response.json();
        const department = data.department || location.state?.department;

        if (department) {
          const departmentFormData = makeFormData(department);
          setFormData(departmentFormData);
          setInitialFormData(departmentFormData);
        } else {
          setMessage('Department data not found.');
        }
      } catch (error) {
        console.log(error);

        if (location.state?.department) {
          const departmentFormData = makeFormData(location.state.department);
          setFormData(departmentFormData);
          setInitialFormData(departmentFormData);
        } else {
          setMessage('Unable to load department data.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDepartment();
  }, [id, location.state]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
//Submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      navigate('/superadmin/department/view');
      return;
    }

    try {
      const api = BaseAPIcaller();
      const token = localStorage.getItem('token');
      const response = await fetch(api.geturl(api.MODULE.DEPARTMENT, api.OPERATIONS.UPDATE, id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });
      const result = await handleApiResponse(response);

      if (result.success) {
        alert('Department updated successfully');
        navigate('/superadmin/department/view');
      } else {
        setMessage('Department update failed.');
      }
    } catch (error) {
      console.log(error);
      setMessage('Department update failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <PageHeader
          title={isViewMode ? 'Department Details' : 'Edit Department'}
          subtitle={isViewMode ? 'View department information.' : 'Update department information.'}
          backLink="/superadmin/department/view"
          backLinkText="Back"
          moduleText="SuperAdmin Department Module"
        />

        <section className="space-y-6 lg:space-y-8">
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            {loading ? (
              <p className="text-sm text-slate-500">Loading department...</p>
            ) : (
              <form className="mt-2 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  <FormInput
                    label="Department Name"
                    name="deptName"
                    value={formData.deptName}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                  <FormInput
                    label="Department Code"
                    name="deptCode"
                    value={formData.deptCode}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  <FormInput
                    label="Max Salary"
                    name="salary.maxSalary"
                    value={formData.salary.maxSalary}
                    onChange={handleInputChange}
                    type="number"
                    disabled={isViewMode}
                  />
                  <FormInput
                    label="Min Salary"
                    name="salary.minSalary"
                    value={formData.salary.minSalary}
                    onChange={handleInputChange}
                    type="number"
                    disabled={isViewMode}
                  />
                </div>

                {isViewMode ? (
                  <div className="flex gap-3 pt-4">
                    <Link
                      to={`/superadmin/department/edit/${id}`}
                      state={location.state}
                      className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Update Department
                    </Link>
                    <Link
                      to="/superadmin/department/view"
                      className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      Back
                    </Link>
                  </div>
                ) : (
                  <FormActions
                    submitLabel="Save Department"
                    resetLabel="Back"
                    onSubmit={handleSubmit}
                    onReset={() => navigate('/superadmin/department/view')}
                  />
                )}

                {message && <p className="text-sm font-medium text-slate-600">{message}</p>}
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default DepartmentActionPage;
