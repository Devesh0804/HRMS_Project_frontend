import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import PageHeader from '../../../components/hrms/PageHeader';
import FormInput from '../../../components/hrms/FormInput';
import FormSelect from '../../../components/hrms/FormSelect';
import FormTextarea from '../../../components/hrms/FormTextarea';
import InfoCard from '../../../components/hrms/InfoCard';
import FormActions from '../../../components/hrms/FormActions';
import BaseAPIcaller from '../../../utils/BaseApicaller';
import handleApiResponse from '../../../utils/BaseApiResponse';

const priorityOptions = [
  { value: '', label: 'Select Priority' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const statusOptions = [
  { value: '', label: 'Select Status' },
  { value: 'Planning', label: 'Planning' },
  { value: 'Active', label: 'Active' },
  { value: 'On Hold', label: 'On Hold' },
  { value: 'Completed', label: 'Completed' },
];

const clientNameOptions = [
  { value: '', label: 'Select Client' },
  { value: 'Tech Corp', label: 'Tech Corp' },
  { value: 'Innovate Ltd', label: 'Innovate Ltd' },
  { value: 'Global Solutions', label: 'Global Solutions' },
  { value: 'Digital Systems', label: 'Digital Systems' },
];

const projectManagerOptions = [
  { value: '', label: 'Select Project Manager' },
  { value: 'John Smith', label: 'John Smith' },
  { value: 'Sarah Johnson', label: 'Sarah Johnson' },
  { value: 'Michael Brown', label: 'Michael Brown' },
  { value: 'Emily Davis', label: 'Emily Davis' },
];

const createInitialFormData = () => ({
  projectName: '',
  projectCode: '',
  clientName: '',
  projectManager: '',
  startDate: '',
  endDate: '',
  priority: '',
  status: 'Planning',
  budget: '',
  teamSize: '',
  description: '',
});

function AddProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => createInitialFormData());
  const [errors, setErrors] = useState({});
  const [projectCount, setProjectCount] = useState(0);
  const [activeProjectCount, setActiveProjectCount] = useState(0);

  useEffect(() => {
    const loadProjectCount = async () => {
      try {
        const api = BaseAPIcaller();
        const token = localStorage.getItem('token');
        const response = await fetch(api.geturl(api.MODULE.PROJECT, api.OPERATIONS.GETDATA), {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const projects = await response.json();

        setProjectCount(projects.length);
        setActiveProjectCount(projects.filter((project) => project.status === 'Active').length);
      } catch (error) {
        console.log(error);
      }
    };

    loadProjectCount();
  }, []);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required.';
    if (!formData.projectCode.trim()) newErrors.projectCode = 'Project code is required.';
    if (!formData.clientName) newErrors.clientName = 'Client name is required.';
    if (!formData.projectManager) newErrors.projectManager = 'Project manager is required.';

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const api = BaseAPIcaller();
      const token = localStorage.getItem('token');
      const response = await fetch(api.geturl(api.MODULE.PROJECT, api.OPERATIONS.SAVE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });
      const result = await handleApiResponse(response);

      if (result.success) {
        alert('Project saved successfully!');
        setFormData(createInitialFormData());
        setErrors({});
        navigate('/superadmin/project/view');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert('Project save failed.');
    }
  };

  const handleReset = () => {
    setFormData(createInitialFormData());
    setErrors({});
  };

  const summaryItems = [
    { label: 'Total Projects', value: `${projectCount}` },
    { label: 'Active Projects', value: `${activeProjectCount}` },
    { label: 'Delayed Projects', value: '0' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <PageHeader
          title="Add Project"
          subtitle="Create project records and assign ownership."
          backLink="/dashboard"
          backLinkText="Back to Project Dashboard"
          moduleText="SuperAdmin Project Module"
        />

        <section className="space-y-6 lg:space-y-8">
          {/* Main Form Card */}
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Project Initialization</h2>
            <p className="mt-1 text-sm text-slate-500">
              Capture project details, ownership, and timeline.
            </p>

            <form className="mt-6 space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormInput
                  label="Project Name"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  required
                  error={errors.projectName}
                />
                <FormInput
                  label="Project Code"
                  name="projectCode"
                  value={formData.projectCode}
                  onChange={handleInputChange}
                  placeholder="Enter project code"
                  required
                  error={errors.projectCode}
                />
                <FormSelect
                  label="Client Name"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  options={clientNameOptions}
                  required
                  error={errors.clientName}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormSelect
                  label="Project Manager"
                  name="projectManager"
                  value={formData.projectManager}
                  onChange={handleInputChange}
                  options={projectManagerOptions}
                  required
                  error={errors.projectManager}
                />
                <FormInput
                  label="Start Date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  type="date"
                />
                <FormInput
                  label="End Date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  type="date"
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormSelect
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  options={priorityOptions}
                />
                <FormSelect
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={statusOptions}
                />
                <FormInput
                  label="Budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter budget"
                  type="number"
                />
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Team Size"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  placeholder="Enter team size"
                  type="number"
                />
                <FormTextarea
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter project description"
                  rows={2}
                />
              </div>

              <FormActions
                submitLabel="Save Project"
                resetLabel="Reset"
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            </form>
          </div>

          {/* Summary Card */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <InfoCard title="Project Overview" items={summaryItems} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default AddProject;
