import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import PageHeader from '../../../components/hrms/PageHeader';
import FormInput from '../../../components/hrms/FormInput';
import FormSelect from '../../../components/hrms/FormSelect';
import FormTextarea from '../../../components/hrms/FormTextarea';
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

const makeFormData = (client) => ({
  companyName: client?.companyName || client?.ORG_Name || client?.clientName || '',
  clientCode: client?.clientCode || client?.orgmobile || '',
  industry: client?.industry || '',
  contactPerson: client?.contactPerson || client?.clientName || '',
  email: client?.email || client?.orgemail || client?.ownemail || '',
  phone: client?.phone || client?.orgmobile || client?.ownmobile || '',
  gstNumber: client?.gstNumber || '',
  companySize: client?.companySize || '',
  website: client?.website || client?.url || '',
  address: client?.address || '',
  city: client?.city || '',
  state: client?.state || '',
  country: client?.country || '',
  postalCode: client?.postalCode || '',
  status: client?.status || 'Active',
});

const createSelectOptions = (items, defaultLabel) => [
  { value: '', label: defaultLabel },
  ...items.map((item) => ({ value: item, label: item }))
];

function ClientActionPage({ mode = 'view' }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isViewMode = mode === 'view';

  const [formData, setFormData] = useState(createInitialFormData);
  const [initialFormData, setInitialFormData] = useState(createInitialFormData);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [countryOptions, setCountryOptions] = useState(['India']);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [allStatesByCountry, setAllStatesByCountry] = useState({});
  const [allCitiesByState, setAllCitiesByState] = useState({});

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (loggedIn !== 'true' || userRole !== 'superadmin') {
      navigate('/login');
    }
  }, [navigate]);

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
    if (formData.country && allStatesByCountry[formData.country]) {
      setStateOptions(allStatesByCountry[formData.country]);
    }
  }, [formData.country, allStatesByCountry]);

  useEffect(() => {
    if (formData.state && allCitiesByState[formData.state]) {
      setCityOptions(allCitiesByState[formData.state]);
    }
  }, [formData.state, allCitiesByState]);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const api = BaseAPIcaller();
        const token = localStorage.getItem('token');
        const response = await fetch(api.geturl(api.MODULE.CLIENT, api.OPERATIONS.SEARCHBYID, id), {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const data = await response.json();
        const client = data.client || location.state?.client;

        if (client) {
          const clientFormData = makeFormData(client);
          setFormData(clientFormData);
          setInitialFormData(clientFormData);
        } else {
          setMessage('Client data not found.');
        }
      } catch (error) {
        console.log(error);

        if (location.state?.client) {
          const clientFormData = makeFormData(location.state.client);
          setFormData(clientFormData);
          setInitialFormData(clientFormData);
        } else {
          setMessage('Unable to load client data.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id, location.state]);

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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      navigate('/superadmin/client/view');
      return;
    }

    try {
      const api = BaseAPIcaller();
      const token = localStorage.getItem('token');
      const response = await fetch(api.geturl(api.MODULE.CLIENT, api.OPERATIONS.UPDATE, id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });
      const result = await handleApiResponse(response);

      if (result.success) {
        alert('Client updated successfully');
        navigate('/superadmin/client/view');
      } else {
        setMessage(result.message || 'Client update failed.');
      }
    } catch (error) {
      console.log(error);
      setMessage('Client update failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <PageHeader
          title={isViewMode ? 'Client Details' : 'Edit Client'}
          subtitle={isViewMode ? 'View client information.' : 'Update client information.'}
          backLink="/superadmin/client/view"
          backLinkText="Back"
          moduleText="SuperAdmin Client Module"
        />

        <section className="space-y-6 lg:space-y-8">
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            {loading ? (
              <p className="text-sm text-slate-500">Loading client...</p>
            ) : (
              <form className="mt-2 space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FormInput label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} disabled={isViewMode} />
                  <FormInput label="Client Code" name="clientCode" value={formData.clientCode} onChange={handleInputChange} disabled={isViewMode} />
                  <FormSelect label="Industry" name="industry" value={formData.industry} onChange={handleInputChange} options={industryOptions} disabled={isViewMode} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FormInput label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} disabled={isViewMode} />
                  <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={isViewMode} />
                  <FormInput label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={isViewMode} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FormInput label="GST Number" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} disabled={isViewMode} />
                  <FormSelect label="Company Size" name="companySize" value={formData.companySize} onChange={handleInputChange} options={companySizeOptions} disabled={isViewMode} />
                  <FormInput label="Website" name="website" value={formData.website} onChange={handleInputChange} disabled={isViewMode} />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <SearchableSelect label="Country" name="country" value={formData.country} onChange={handleInputChange} options={createSelectOptions(countryOptions, 'Select Country')} disabled={isViewMode} placeholder="Search country" />
                  <SearchableSelect label="State" name="state" value={formData.state} onChange={handleInputChange} options={createSelectOptions(stateOptions, 'Select State')} disabled={isViewMode} placeholder="Search state" />
                  <SearchableSelect label="City" name="city" value={formData.city} onChange={handleInputChange} options={createSelectOptions(cityOptions, 'Select City')} disabled={isViewMode} placeholder="Search city" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormTextarea label="Address" name="address" value={formData.address} onChange={handleInputChange} rows={2} disabled={isViewMode} />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormInput label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} disabled={isViewMode} />
                    <FormSelect label="Status" name="status" value={formData.status} onChange={handleInputChange} options={statusOptions} disabled={isViewMode} />
                  </div>
                </div>

                {isViewMode ? (
                  <div className="flex gap-3 pt-4">
                    <Link
                      to={`/superadmin/client/edit/${id}`}
                      state={location.state}
                      className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Update Client
                    </Link>
                    <Link
                      to="/superadmin/client/view"
                      className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      Back
                    </Link>
                  </div>
                ) : (
                  <FormActions
                    submitLabel="Save Client"
                    resetLabel="Back"
                    onSubmit={handleSubmit}
                    onReset={() => navigate('/superadmin/client/view')}
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

export default ClientActionPage;
