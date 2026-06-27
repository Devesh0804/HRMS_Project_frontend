import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import PageHeader from '../../../components/hrms/PageHeader';
import FormInput from '../../../components/hrms/FormInput';
import FormSelect from '../../../components/hrms/FormSelect';
import FormTextarea from '../../../components/hrms/FormTextarea';
import InfoCard from '../../../components/hrms/InfoCard';
import FormActions from '../../../components/hrms/FormActions';

const twoFactorOptions = [
  { value: 'Enabled', label: 'Enabled' },
  { value: 'Disabled', label: 'Disabled' },
];

const notificationOptions = [
  { value: '', label: 'Select Preference' },
  { value: 'Email', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'Both', label: 'Both' },
];

const languageOptions = [
  { value: '', label: 'Select Language' },
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
];

const timezoneOptions = [
  { value: '', label: 'Select Timezone' },
  { value: 'UTC', label: 'UTC' },
  { value: 'IST', label: 'IST (India Standard Time)' },
  { value: 'PST', label: 'PST (Pacific Standard Time)' },
  { value: 'EST', label: 'EST (Eastern Standard Time)' },
];

const departmentOptions = [
  { value: '', label: 'Select Department' },
  { value: 'HR', label: 'HR' },
  { value: 'IT', label: 'IT' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Operations', label: 'Operations' },
];

const createInitialFormData = () => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  employeeID: '',
  designation: '',
  department: '',
  timezone: '',
  preferredLanguage: '',
  officeLocation: '',
  bio: '',
  username: '',
  recoveryEmail: '',
  twoFactorAuth: 'Disabled',
  notificationPreference: '',
});

function EditProfile() {
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

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!formData.username.trim()) newErrors.username = 'Username is required.';

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Profile details saved locally:', formData);
    alert('Profile updated successfully!');
    setErrors({});
  };

  const handleReset = () => {
    setFormData(createInitialFormData());
    setErrors({});
  };

  const summaryItems = [
    { label: 'Profile Completion', value: '75%' },
    { label: 'Last Login', value: 'May 1, 2026' },
    { label: 'Account Status', value: 'Active' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <PageHeader
          title="Edit Profile"
          subtitle="Update profile, account, and organization settings."
          backLink="/dashboard"
          backLinkText="Back to Profile Dashboard"
          moduleText="SuperAdmin Profile Module"
        />

        <section className="space-y-6 lg:space-y-8">
          {/* Card 1: Profile Information */}
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Profile Information</h2>
            <p className="mt-1 text-sm text-slate-500">
              Update personal and organization profile details.
            </p>

            <form className="mt-6 space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                  error={errors.firstName}
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                  error={errors.lastName}
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                  error={errors.email}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormInput
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
                <FormInput
                  label="Employee ID"
                  name="employeeID"
                  value={formData.employeeID}
                  onChange={handleInputChange}
                  placeholder="Enter employee ID"
                />
                <FormInput
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="Enter designation"
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormSelect
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  options={departmentOptions}
                />
                <FormSelect
                  label="Time Zone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  options={timezoneOptions}
                />
                <FormSelect
                  label="Preferred Language"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                  options={languageOptions}
                />
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Office Location"
                  name="officeLocation"
                  value={formData.officeLocation}
                  onChange={handleInputChange}
                  placeholder="Enter office location"
                />
                <FormTextarea
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Enter bio"
                  rows={2}
                />
              </div>
            </form>
          </div>

          {/* Card 2: Account Settings */}
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Account Settings</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage account security and notification preferences.
            </p>

            <form className="mt-6 space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormInput
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  required
                  error={errors.username}
                />
                <FormInput
                  label="Recovery Email"
                  name="recoveryEmail"
                  type="email"
                  value={formData.recoveryEmail}
                  onChange={handleInputChange}
                  placeholder="Enter recovery email"
                />
                <FormSelect
                  label="Two Factor Auth"
                  name="twoFactorAuth"
                  value={formData.twoFactorAuth}
                  onChange={handleInputChange}
                  options={twoFactorOptions}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormSelect
                  label="Notification Preference"
                  name="notificationPreference"
                  value={formData.notificationPreference}
                  onChange={handleInputChange}
                  options={notificationOptions}
                />
              </div>

              <FormActions
                submitLabel="Update Profile"
                resetLabel="Reset"
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            </form>
          </div>

          {/* Summary Card */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <InfoCard title="Profile Overview" items={summaryItems} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default EditProfile;