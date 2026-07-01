import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import handleApiResponse from '../../../utils/BaseApiResponse';
import BaseAPIcaller from '../../../utils/BaseApicaller';
import "./employeeAction.css"


const emptyForm = {
  FullName: {
    firstName: '',
    lastName: ''
  },
  useremail: '',
  username: '',
  password: '',
  mobile: '',
  AlternateMobile: '',
  gender: '',
  DOB: '',
  department: '',
  address: {
    CountryName: '',
    StateName: '',
    CityName: ''
  },
  Documents: {
    Marks_10th: '',
    Marks_12th: '',
    UG_qualifications: '',
    PG_qualifications: ''
  },
  BankDetails: {
    bankname: '',
    ifsccode: '',
    branchName: '',
    acccountno: '',
    confirmAccountNumber: '',
    passbook_checkImg: ''
  },
  status: '',
  AccountStatus: '',
  roleName: 'User'
};

const makeFormData = (employee, defaultRoleName = 'User') => ({
  FullName: {
    firstName: employee?.FullName?.firstName || '',
    lastName: employee?.FullName?.lastName || ''
  },
  useremail: employee?.useremail || '',
  username: employee?.username || '',
  password: employee?.password || '',
  mobile: employee?.mobile || '',
  AlternateMobile: employee?.AlternateMobile || '',
  gender: employee?.gender || '',
  DOB: employee?.DOB || '',
  department: employee?.department?.deptName || employee?.department || '',
  address: {
    CountryName: employee?.address?.country?.CountryName || employee?.address?.CountryName || '',
    StateName: employee?.address?.state?.StateName || employee?.address?.StateName || '',
    CityName: employee?.address?.city?.CityName || employee?.address?.CityName || ''
  },
  Documents: {
    Marks_10th: employee?.Documents?.Marks_10th || '',
    Marks_12th: employee?.Documents?.Marks_12th || '',
    UG_qualifications: employee?.Documents?.UG_qualifications || '',
    PG_qualifications: employee?.Documents?.PG_qualifications || ''
  },
  BankDetails: {
    bankname: employee?.BankDetails?.bankname || '',
    ifsccode: employee?.BankDetails?.ifsccode || '',
    branchName: employee?.BankDetails?.branchName || '',
    acccountno: employee?.BankDetails?.acccountno || '',
    confirmAccountNumber: employee?.BankDetails?.acccountno || '',
    passbook_checkImg: employee?.BankDetails?.passbook_checkImg || ''
  },
  status: employee?.status || '',
  AccountStatus: employee?.AccountStatus || '',
  roleName: employee?.roleName || employee?.role?.roleName || defaultRoleName
});

const personalFields = [
  { label: 'First Name', name: 'FullName.firstName', type: 'text' },
  { label: 'Last Name', name: 'FullName.lastName', type: 'text' },
  { label: 'Username', name: 'username', type: 'text' },
  { label: 'Email', name: 'useremail', type: 'email' },
  { label: 'Password', name: 'password', type: 'text' },
  { label: 'Mobile Number', name: 'mobile', type: 'text' },
  { label: 'Alternate Mobile Number', name: 'AlternateMobile', type: 'text' },
  { label: 'Department Name', name: 'department', type: 'text' },
  { label: 'Date Of Birth', name: 'DOB', type: 'date' }
];

const addressFields = [
  { label: 'Country', name: 'address.CountryName', type: 'text' },
  { label: 'State', name: 'address.StateName' , type: 'text'},
  { label: 'City', name: 'address.CityName' , type: 'text'}
];

const documentFields = [
  { label: '10th Document', name: 'Documents.Marks_10th', type: 'file'},
  { label: '12th Document', name: 'Documents.Marks_12th', type: 'file'},
  { label: 'UG Document', name: 'Documents.UG_qualifications',type: 'file' },
  { label: 'PG Document', name: 'Documents.PG_qualifications',type: 'file' }
];

const bankFields = [
  { label: 'Bank Name', name: 'BankDetails.bankname', type: 'text' },
  { label: 'IFSC Code', name: 'BankDetails.ifsccode', type: 'text' },
  { label: 'Branch', name: 'BankDetails.branchName' , type: 'text'},
  { label: 'Account Number', name: 'BankDetails.acccountno', type: 'text' },
  { label: 'Confirm Account Number', name: 'BankDetails.confirmAccountNumber', type: 'text' },
  { label: 'Passbook Image', name: 'BankDetails.passbook_checkImg' ,type: 'file'}
];

function EmployeeActionPage({
  mode = 'view',
  entityLabel = 'Employee',
  moduleLabel = 'SuperAdmin Employee Module',
  listPath = '/superadmin/employee/view',
  editPathBase = '/superadmin/employee/edit',
  stateKey = 'employee',
  defaultRoleName = 'User'
}) {
  const { id } = useParams();
  const location = useLocation();
  // console.log(location);
  
  
  const isViewMode = mode === 'view';

  const [formData, setFormData] = useState(emptyForm);
  const [initialFormData, setInitialFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (loggedIn !== 'true' || userRole !== 'superadmin') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const api = BaseAPIcaller();
        const token = localStorage.getItem('token');
        const response = await fetch(api.geturl(api.MODULE.USER, api.OPERATIONS.GETDATA), {
          method: 'GET',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        const employees = await response.json();
        // console.log(employees);
        
          const employee = employees.find((item) => item._id === id);
          
        if (employee) {
          const employeeFormData = makeFormData(employee, defaultRoleName);
          setFormData(employeeFormData);
          setInitialFormData(employeeFormData);
        } else if (location.state?.[stateKey]) {
          const employeeFormData = makeFormData(location.state[stateKey], defaultRoleName);
          setFormData(employeeFormData);
          setInitialFormData(employeeFormData);
        } else {
          setMessage(`${entityLabel} data not found.`);
        }
      } catch (error) {
        console.error(`Error loading ${entityLabel.toLowerCase()}:`, error);
        if (location.state?.[stateKey]) {
          const employeeFormData = makeFormData(location.state[stateKey], defaultRoleName);
          setFormData(employeeFormData);
          setInitialFormData(employeeFormData);
        } else {
          setMessage(`Unable to load ${entityLabel.toLowerCase()} data.`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [id, location.state, defaultRoleName, entityLabel, stateKey]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
      navigate(listPath);
      return;
    }

    try {
      const api = BaseAPIcaller();
      const token = localStorage.getItem('token');
      const response = await fetch(api.geturl(api.MODULE.USER, api.OPERATIONS.UPDATE, id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData)
      });
       
      const message = handleApiResponse(response)
      if ((await message).success) {
        setMessage(`${entityLabel} updated successfully.`);
        alert(`${entityLabel} updated successfully`)
        navigate(listPath)

      } else {
        setMessage(`${entityLabel} update failed.`);
      }
    } catch (error) {
      console.error(`Error updating ${entityLabel.toLowerCase()}:`, error);
      setMessage(`${entityLabel} update failed.`);
    }
  };

  const getValue = (name) => {
    if (!name.includes('.')) {
      return formData[name] || '';
    }

    const [parent, child] = name.split('.');
    return formData[parent]?.[child] || '';
  };

  const inputClass = 'w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-600';

  const [selectedImage, setSelectedImage] = useState(null);

  const openImagePreview = (imageUrl) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
    }
  };

  const closeImagePreview = () => setSelectedImage(null);

  const renderInput = (field) => (
    
    //  { label: 'First Name', name: 'FullName.firstName', type: 'text' }
    // { label: '10th Document', name: 'Documents.Marks_10th' },
    <div key={field.name}>
     
      <label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>

       {
       field.type == 'file' ? 
       
       <img
        src={getValue(field.name)}
        alt=""
        className="profile-image"
        onClick={() => openImagePreview(getValue(field.name))}
        style={{
          width: "50px",
          cursor: getValue(field.name) ? "pointer" : "default"
        }}
      />
       
       :
       
       <input
        type={ field.name == documentFields.map((field)=>(field)) ? 'file' : field.type }
        name={field.name}
        value={getValue(field.name)}
        onChange={handleChange}
        disabled={isViewMode || field.name === 'department'}
        className={inputClass}
      />
       }
       
   
      </div>

    
  );



  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-semibold">{moduleLabel}</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                {isViewMode ? `${entityLabel} Details` : `Edit ${entityLabel}`}
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">
                {isViewMode ? `View all ${entityLabel.toLowerCase()} form details.` : `Update ${entityLabel.toLowerCase()} form details.`}
              </p>
            </div>

            <div className="flex gap-3">
              {isViewMode && (
                <Link
                  to={`${editPathBase}/${id}`}
                  state={location.state}
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  Edit
                </Link>
              )}
              <Link
                to={listPath}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </Link>
            </div>
          </div>
        </header>

        <section className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
          {loading ? (
            <p className="text-sm text-slate-500">Loading {entityLabel.toLowerCase()}...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Personal Information</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {personalFields.map(renderInput)}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Gender</label>
                    <select className={inputClass} name="gender" value={formData.gender} onChange={handleChange} disabled={isViewMode}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Address Details</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {addressFields.map(renderInput)}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Education Documents</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {documentFields.map(renderInput)}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Bank Details</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {bankFields.map(renderInput)}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Status Activity</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">User Status</label>
                    <select className={inputClass} name="status" value={formData.status} onChange={handleChange} disabled={isViewMode}>
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Account Status</label>
                    <select className={inputClass} name="AccountStatus" value={formData.AccountStatus} onChange={handleChange} disabled={isViewMode}>
                        <option value="">Select Account Status</option>
                      <option value="Locked">Locked</option>
                      <option value="Unlocked">Unlocked</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {!isViewMode && (
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    Save {entityLabel}
                  </button>
                )}

                {message && <p className="text-sm font-medium text-slate-600">{message}</p>}
              </div>
            </form>
          )}
        </section>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={closeImagePreview}
        >
          <div className="relative max-h-[90vh] max-w-[90vw] hover:cursor-alias:" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closeImagePreview}
              className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-lg font-semibold text-slate-800 shadow"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}



export default EmployeeActionPage;
