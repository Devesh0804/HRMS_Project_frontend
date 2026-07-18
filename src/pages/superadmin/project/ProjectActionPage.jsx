import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import PageHeader from '../../../components/hrms/PageHeader';
import FormInput from '../../../components/hrms/FormInput';
import FormSelect from '../../../components/hrms/FormSelect';
import FormTextarea from '../../../components/hrms/FormTextarea';
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

const makeFormData = (project) => ({
  projectName: project?.projectName || '',
  projectCode: project?.projectCode || '',
  clientName: project?.clientName || '',
  projectManager: project?.projectManager || '',
  startDate: project?.startDate || '',
  endDate: project?.endDate || '',
  priority: project?.priority || '',
  status: project?.status || 'Planning',
  budget: project?.budget || '',
  teamSize: project?.teamSize || '',
  description: project?.description || '',
});

function ProjectActionPage({ mode = 'view' }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isViewMode = mode === 'view';

  const [formData, setFormData] = useState(createInitialFormData);
  const [initialFormData, setInitialFormData] = useState(createInitialFormData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (loggedIn !== 'true' || userRole !== 'superadmin') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const api = BaseAPIcaller();
        const token = localStorage.getItem('token');
        const response = await fetch(api.geturl(api.MODULE.PROJECT, api.OPERATIONS.SEARCHBYID, id), {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const data = await response.json();
        const project = data.project || location.state?.project;

        if (project) {
          const projectFormData = makeFormData(project);
          setFormData(projectFormData);
          setInitialFormData(projectFormData);
        } else {
          setMessage('Project data not found.');
        }
      } catch (error) {
        console.log(error);

        if (location.state?.project) {
          const projectFormData = makeFormData(location.state.project);
          setFormData(projectFormData);
          setInitialFormData(projectFormData);
        } else {
          setMessage('Unable to load project data.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, location.state]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setMessage('');

    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      navigate('/superadmin/project/view');
      return;
    }

    try {
      setIsSubmitting(true);
      const api = BaseAPIcaller();
      const token = localStorage.getItem('token');
      const response = await fetch(api.geturl(api.MODULE.PROJECT, api.OPERATIONS.UPDATE, id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });
      const result = await handleApiResponse(response);

      if (result.success) {
        alert('Project updated successfully');
        navigate('/superadmin/project/view');
      } else {
        setMessage(result.message || 'Project update failed.');
      }
    } catch (error) {
      console.log(error);
      setMessage('Project update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <PageHeader
          title={isViewMode ? 'Project Details' : 'Edit Project'}
          subtitle={isViewMode ? 'View project information.' : 'Update project information.'}
          backLink="/superadmin/project/view"
          backLinkText="Back"
          moduleText="SuperAdmin Project Module"
        />

        <section className="space-y-6 lg:space-y-8">
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            {loading ? (
              <p className="text-sm text-slate-500">Loading project...</p>
            ) : (
              <form className="mt-2 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FormInput label="Project Name" name="projectName" value={formData.projectName} onChange={handleInputChange} disabled={isViewMode} />
                  <FormInput label="Project Code" name="projectCode" value={formData.projectCode} onChange={handleInputChange} disabled={isViewMode} />
                  <FormSelect label="Client Name" name="clientName" value={formData.clientName} onChange={handleInputChange} options={clientNameOptions} disabled={isViewMode} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FormSelect label="Project Manager" name="projectManager" value={formData.projectManager} onChange={handleInputChange} options={projectManagerOptions} disabled={isViewMode} />
                  <FormInput label="Start Date" name="startDate" value={formData.startDate} onChange={handleInputChange} type="date" disabled={isViewMode} />
                  <FormInput label="End Date" name="endDate" value={formData.endDate} onChange={handleInputChange} type="date" disabled={isViewMode} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FormSelect label="Priority" name="priority" value={formData.priority} onChange={handleInputChange} options={priorityOptions} disabled={isViewMode} />
                  <FormSelect label="Status" name="status" value={formData.status} onChange={handleInputChange} options={statusOptions} disabled={isViewMode} />
                  <FormInput label="Budget" name="budget" value={formData.budget} onChange={handleInputChange} type="number" disabled={isViewMode} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput label="Team Size" name="teamSize" value={formData.teamSize} onChange={handleInputChange} type="number" disabled={isViewMode} />
                  <FormTextarea label="Description" name="description" value={formData.description} onChange={handleInputChange} rows={2} disabled={isViewMode} />
                </div>

                {isViewMode ? (
                  <div className="flex gap-3 pt-4">
                    <Link
                      to={`/superadmin/project/edit/${id}`}
                      state={location.state}
                      className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Update Project
                    </Link>
                    <Link
                      to="/superadmin/project/view"
                      className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      Back
                    </Link>
                  </div>
                ) : (
                  <FormActions
                    submitLabel={isSubmitting ? 'Saving...' : 'Save Project'}
                    resetLabel="Back"
                    onSubmit={handleSubmit}
                    onReset={() => navigate('/superadmin/project/view')}
                    submitDisabled={isSubmitting}
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

export default ProjectActionPage;
