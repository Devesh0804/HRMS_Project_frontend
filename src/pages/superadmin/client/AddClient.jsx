import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import PageHeader from '../../../components/hrms/PageHeader';
import FormInput from '../../../components/hrms/FormInput';
import FormSelect from '../../../components/hrms/FormSelect';
import FormTextarea from '../../../components/hrms/FormTextarea';
import InfoCard from '../../../components/hrms/InfoCard';
import FormActions from '../../../components/hrms/FormActions';
import SearchableSelect from '../../../components/hrms/SearchableSelect';
import BaseAPIcaller from '../../../utils/BaseApicaller';
import handleApiResponse from '../../../utils/BaseApiResponse';






const companySizeOptions = [
  { value: '', label: 'Select Company Size' },
  { value: '1-10', label: '1-10 Employees' },
  { value: '11-50', label: '11-50 Employees' },
  { value: '51-200', label: '51-200 Employees' },
  { value: '201-500', label: '201-500 Employees' },
  { value: '500+', label: '500+ Employees' },
];

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

const industryOptions = [
  { value: '', label: 'Select Industry' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Education', label: 'Education' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Other', label: 'Other' },
];

const createInitialFormData = () => ({
  companyName: '',
  clientCode: '',
  industry: '',
  contactPerson: '',
  email: '',
  phone: '',
  gstNumber: '',
  companySize: '',
  website: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  status: 'Active',
});

const createSelectOptions = (items, defaultLabel) => [
  { value: '', label: defaultLabel },
  ...items.map((item) => ({ value: item, label: item }))
];

function AddClient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => createInitialFormData());
  const [errors, setErrors] = useState({});
  const [clientCount, setClientCount] = useState(0);
  const [activeClientCount, setActiveClientCount] = useState(0);
  const [countryOptions, setCountryOptions] = useState(['India']);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [allStatesByCountry, setAllStatesByCountry] = useState({});
  const [allCitiesByState, setAllCitiesByState] = useState({});

  useEffect(() => {
    const loadClientCount = async () => {
      try {
        const api = BaseAPIcaller();
        const token = localStorage.getItem('token');
        const response = await fetch(api.geturl(api.MODULE.CLIENT, api.OPERATIONS.GETDATA), {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const clients = await response.json();

        setClientCount(clients.length);
        setActiveClientCount(clients.filter((client) => client.status === 'Active').length);
      } catch (error) {
        console.log(error);
      }
    };

    loadClientCount();
  }, []);

  useEffect(() => {
    const loadAddressOptions = async () => {
      try {
        const api = BaseAPIcaller();
        const token = localStorage.getItem('token');
        const response = await fetch(api.geturl(api.MODULE.ADDRESS, api.OPERATIONS.GETDATA), {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const data = await response.json();
        const countries = [];
        const states = [];
        const cities = [];
        const stateMap = {};
        const cityMap = {};

        data.forEach((country) => {
          if (country.name) {
            countries.push(country.name);
          }

          stateMap[country.name] = country.states.map((state) => state.name);

          country.states.forEach((state) => {
            states.push(state.name);
            const stateCities = state.cities.map((city) => city.name);
            cityMap[state.name] = stateCities;
            cities.push(...stateCities);
          });
        });

        setCountryOptions(countries.length ? countries : ['India']);
        setStateOptions(states);
        setCityOptions(cities);
        setAllStatesByCountry(stateMap);
        setAllCitiesByState(cityMap);
      } catch (error) {
        console.log(error);
      }
    };

    loadAddressOptions();
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

    if (name === 'country') {
      const filteredStates = allStatesByCountry[value] || [];
      setFormData((prev) => ({ ...prev, country: value, state: '', city: '' }));
      setStateOptions(filteredStates);
      setCityOptions([]);
      return;
    }

    if (name === 'state') {
      setFormData((prev) => ({ ...prev, state: value, city: '' }));
      setCityOptions(allCitiesByState[value] || []);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required.';
    if (!formData.clientCode.trim()) newErrors.clientCode = 'Client code is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required.';

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
      const response = await fetch(api.geturl(api.MODULE.CLIENT, api.OPERATIONS.SAVE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });
      const result = await handleApiResponse(response);

      if (result.success) {
        alert('Client saved successfully!');
        setFormData(createInitialFormData());
        setErrors({});
        navigate('/superadmin/client/view');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert('Client save failed.');
    }
  };

  const handleReset = () => {
    setFormData(createInitialFormData());
    setErrors({});
  };

  const summaryItems = [
    { label: 'Total Clients', value: `${clientCount}` },
    { label: 'Active Clients', value: `${activeClientCount}` },
    { label: 'Pending Approvals', value: '0' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <PageHeader
          title="Add Client"
          subtitle="Create and manage client organization details."
          backLink="/dashboard"
          backLinkText="Back to Client Dashboard"
          moduleText="SuperAdmin Client Module"
        />

        <section className="space-y-6 lg:space-y-8">
          {/* Main Form Card */}
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Client Onboarding</h2>
            <p className="mt-1 text-sm text-slate-500">
              Capture client company details and contact information.
            </p>

            <form className="mt-6 space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormInput
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                  error={errors.companyName}
                />
                <FormInput
                  label="Client Code"
                  name="clientCode"
                  value={formData.clientCode}
                  onChange={handleInputChange}
                  placeholder="Enter client code"
                  required
                  error={errors.clientCode}
                />
                <FormSelect
                  label="Industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  options={industryOptions}
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormInput
                  label="Contact Person"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Enter contact person name"
                  required
                  error={errors.contactPerson}
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
                <FormInput
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormInput
                  label="GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  placeholder="Enter GST number"
                />
                <FormSelect
                  label="Company Size"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleInputChange}
                  options={companySizeOptions}
                />
                <FormInput
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Enter website URL"
                />
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SearchableSelect
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  options={createSelectOptions(countryOptions, 'Select Country')}
                  placeholder="Search country"
                />
                <SearchableSelect
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  options={createSelectOptions(stateOptions, 'Select State')}
                  placeholder="Search state"
                />
                <SearchableSelect
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  options={createSelectOptions(cityOptions, 'Select City')}
                  placeholder="Search city"
                />
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormTextarea
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  rows={2}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormInput
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                />
                <FormSelect
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={statusOptions}
                />
                </div>
              </div>

              <FormActions
                submitLabel="Save Client"
                resetLabel="Reset"
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            </form>
          </div>

          {/* Summary Card */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <InfoCard title="Client Overview" items={summaryItems} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default AddClient;
