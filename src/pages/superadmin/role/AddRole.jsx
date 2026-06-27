import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import PageHeader from '../../../components/hrms/PageHeader';
import FormInput from '../../../components/hrms/FormInput';
import FormSelect from '../../../components/hrms/FormSelect';
import FormActions from '../../../components/hrms/FormActions';
import InfoCard from '../../../components/hrms/InfoCard';
import FormTextarea from '../../../components/hrms/FormTextarea';

const roleTypeOptions = [
  { value: '', label: 'Select Role Type' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Employee', label: 'Employee' },
  { value: 'Custom', label: 'Custom' },
];

const accessLevelOptions = [
  { value: '', label: 'Select Access Level' },
  { value: 'Full', label: 'Full' },
  { value: 'Limited', label: 'Limited' },
  { value: 'Restricted', label: 'Restricted' },
];

const departmentOptions = [
  { value: '', label: 'Select Department' },
  { value: 'HR', label: 'HR' },
  { value: 'IT', label: 'IT' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Operations', label: 'Operations' },
];

const reportingToOptions = [
  { value: '', label: 'Select Reporting Manager' },
  { value: 'CEO', label: 'CEO' },
  { value: 'CTO', label: 'CTO' },
  { value: 'CFO', label: 'CFO' },
  { value: 'HR Manager', label: 'HR Manager' },
];

const createInitialFormData = () => ({
  roleName: '',
  roleCode: '',
  department: '',
  reportingTo: '',
  roleType: '',
  accessLevel: '',
  description: '',
  permissions: {
    employeeManagement: false,
    attendanceManagement: false,
    payrollAccess: false,
    projectAccess: false,
    recruitmentAccess: false,
    clientAccess: false,
    reportsAccess: false,
    settingsAccess: false,
  },
});

function AddRole() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => createInitialFormData());
  const [errors, setErrors] = useState({});

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePermissionChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [name]: checked,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roleName.trim()) newErrors.roleName = 'Role name is required.';
    if (!formData.roleCode.trim()) newErrors.roleCode = 'Role code is required.';
    if (!formData.roleType) newErrors.roleType = 'Role type is required.';

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Role details saved locally:', formData);
    alert('Role saved successfully!');
    setFormData(createInitialFormData());
    setErrors({});
  };

  const handleReset = () => {
    setFormData(createInitialFormData());
    setErrors({});
  };

  const summaryItems = [
    { label: 'Total Roles', value: '12' },
    { label: 'Active Roles', value: '10' },
    { label: 'Custom Roles', value: '4' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <PageHeader
          title="Add Role"
          subtitle="Create role definitions and assign permissions."
          backLink="/dashboard"
          backLinkText="Back to Role Dashboard"
          moduleText="SuperAdmin Role Module"
        />

        <section className="space-y-6 lg:space-y-8">
          {/* Main Form Card */}
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Role Configuration</h2>
            <p className="mt-1 text-sm text-slate-500">
              Define role name, hierarchy, and access control.
            </p>

            <form className="mt-6 space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormInput
                  label="Role Name"
                  name="roleName"
                  value={formData.roleName}
                  onChange={handleInputChange}
                  placeholder="Enter role name"
                  required
                  error={errors.roleName}
                />
                <FormInput
                  label="Role Code"
                  name="roleCode"
                  value={formData.roleCode}
                  onChange={handleInputChange}
                  placeholder="Enter role code"
                  required
                  error={errors.roleCode}
                />
                <FormSelect
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  options={departmentOptions}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormSelect
                  label="Reporting To"
                  name="reportingTo"
                  value={formData.reportingTo}
                  onChange={handleInputChange}
                  options={reportingToOptions}
                />
                <FormSelect
                  label="Role Type"
                  name="roleType"
                  value={formData.roleType}
                  onChange={handleInputChange}
                  options={roleTypeOptions}
                  required
                  error={errors.roleType}
                />
                <FormSelect
                  label="Access Level"
                  name="accessLevel"
                  value={formData.accessLevel}
                  onChange={handleInputChange}
                  options={accessLevelOptions}
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 gap-4">
                <FormTextarea
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter role description"
                  rows={3}
                />
              </div>

              {/* Permission Section */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-base font-semibold text-slate-900 mb-4">Permissions</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { name: 'employeeManagement', label: 'Employee Management' },
                    { name: 'attendanceManagement', label: 'Attendance Management' },
                    { name: 'payrollAccess', label: 'Payroll Access' },
                    { name: 'projectAccess', label: 'Project Access' },
                    { name: 'recruitmentAccess', label: 'Recruitment Access' },
                    { name: 'clientAccess', label: 'Client Access' },
                    { name: 'reportsAccess', label: 'Reports Access' },
                    { name: 'settingsAccess', label: 'Settings Access' },
                  ].map((permission) => (
                    <label key={permission.name} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name={permission.name}
                        checked={formData.permissions[permission.name]}
                        onChange={handlePermissionChange}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <FormActions
                submitLabel="Save Role"
                resetLabel="Reset"
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            </form>
          </div>

          {/* Summary Card */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <InfoCard title="Role Overview" items={summaryItems} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default AddRole;