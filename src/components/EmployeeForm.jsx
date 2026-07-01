import React, { useState } from 'react';
import BaseAPIcaller from '../utils/BaseApicaller.js'
import { da } from '@faker-js/faker';
import handleApiResponse from '../utils/BaseApiResponse.js';
import { Eye ,EyeOff } from "lucide-react"
import { useEffect  } from 'react';
import debounce from "lodash.debounce"
import { useNavigate } from 'react-router-dom';

const api = BaseAPIcaller();
const url = api.geturl(api.MODULE.USER, api.OPERATIONS.SAVE)
// console.log(url);

const city_url = api.geturl(api.MODULE.ADDRESS,api.OPERATIONS.GETDATA)
let token = localStorage.getItem('token')


       
  // const response = await fetch(url, {
  //       method: "POST",
  //      headers:{
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`
  //       },
  //       // body: JSON.stringify(submittedData)
  //     })
  //     const message = await handleApiResponse(response);
  //     console.log(message);




const getCurrentUser = () => {
  const userRole = localStorage.getItem('userRole');

  if (userRole === 'superadmin') {
    return localStorage.getItem('superadminEmail') || 'superadmin';
  }

  return localStorage.getItem('employeeUsername') || 'system';
};

const createInitialFormData = (roleName = 'User') => {
  const currentUser = getCurrentUser();

  return {
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
    address: {
      CityName: '',
      StateName: '',
      CountryName: ''
    },
    Documents: {
      Marks_10th: null,
      Marks_12th: null,
      UG_qualifications: null,
      PG_qualifications: null
    },
    BankDetails: {
      bankname: '',
      ifsccode: '',
      branchName: '',
      acccountno: '',
      confirmAccountNumber: '',
      passbook_checkImg: null,
    },
    status: '',
    AccountStatus:'',
    roleName: roleName,
    department:''
    // // createdBy: currentUser,
    // // updatedBy: currentUser,
    // // createdDateTime: '',
    // // updatedDateTime: '',
    // startSession: '09:30',
    // endSession: '18:30'
  };
};


const EmployeeForm = ({
  entityLabel = 'Employee',
  initialVisibility = false,
  showLauncher = true,
  submitLabel = 'Submit',
  roleName = 'User',
  redirectPath = '/superadmin/employee/view'
}) => {
  const entityLabelLower = entityLabel.toLowerCase();
  const [showForm, setShowForm] = useState(initialVisibility);
  const [formData, setFormData] = useState(() => createInitialFormData(roleName));
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
     const [showPass, setShowPass] = useState(false);
     const navigate = useNavigate();





  const handleInputChange = debounce((e) => {
    const { name, value } = e.target;
  
    // When State is selected, update only the cities for that state.
    if (name === 'address.StateName') {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          StateName: value,
          CityName: '', // reset selected city when state changes
        },
      }));

      setcityOptions(allCitiesByState[value] || []);
      return;
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  });


  const handleFileChange = (event) => {
    const { name, files } = event.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');

      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: files && files[0] ? files[0] : null,
        },
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleShowForm = () => {
    setSuccessMessage('');
    setShowForm(true);
  };

  const handleCancel = () => {
    if (showLauncher) {
      setShowForm(false);
    }

    setSuccessMessage('');
    setErrors({});
    setFormData(createInitialFormData(roleName));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^\d{10}$/;

    if (!formData.FullName.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.FullName.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.username.trim()) newErrors.username = 'Username is required.';
    if (!formData.password.trim()) newErrors.password = 'Password is required.';

    if (!formData.useremail.trim()) {
      newErrors.useremail = 'Email is required.';
    } else if (!emailPattern.test(formData.useremail)) {
      newErrors.useremail = 'Enter a valid email address.';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!mobilePattern.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits.';
    }

    if (!formData.AlternateMobile.trim()) {
      newErrors.AlternateMobile = 'Alternate mobile number is required.';
    } else if (!mobilePattern.test(formData.AlternateMobile)) {
      newErrors.AlternateMobile = 'Alternate mobile number must be 10 digits.';
    }

    if (!formData.gender) newErrors.gender = 'Gender is required.';
    if (!formData.DOB) newErrors.dateOfBirth = 'Date of birth is required.';
    // if (!formData.address.CityName) newErrors.city = 'City is required.';
    // if (!formData.address.StateName) newErrors.state = 'State is required.';
    // if (!formData.address.CountryName) newErrors.country = 'Country is required.';
    if (!formData.Documents.Marks_10th) newErrors.tenthDocument = '10th document is required.';
    if (!formData.Documents.Marks_12th) newErrors.twelfthDocument = '12th document is required.';
    // if (!formData.Documents.UG_qualifications) newErrors.ugDocument = 'UG document is required.';
    // if (!formData.Documents.PG_qualifications) newErrors.pgDocument = 'PG document is required.';
    if (!formData.BankDetails.bankname.trim()) newErrors.bankName = 'Bank name is required.';
    if (!formData.BankDetails.ifsccode.trim()) newErrors.ifscCode = 'IFSC code is required.';
    if (!formData.BankDetails.branchName.trim()) newErrors.branch = 'Branch is required.';

    if (!formData.BankDetails.acccountno.trim()) {
      newErrors.accountNumber = 'Account number is required.';
    }

    if (!formData.BankDetails.confirmAccountNumber.trim()) {
      newErrors.confirmAccountNumber = 'Please confirm the account number.';
    } else if (formData.BankDetails.confirmAccountNumber !== formData.BankDetails.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match.';
    }

    if (!formData.BankDetails.passbook_checkImg) newErrors.passbookImage = 'Passbook image is required.';

    return newErrors;
  };

 
  const handleSubmit = async (event) => {
    event.preventDefault();
    
   
    const validationErrors = validateForm();

    console.log(Object.keys(validationErrors));


    if (Object.keys(validationErrors).length > 0) {
      alert('fill form carefully')
      setErrors(validationErrors);
      return;
    }

    const currentTime = new Date().toISOString();
    const submittedData = {
      ...formData,
      password: `${formData.username || entityLabelLower}@123`,
      updatedBy: getCurrentUser(),
      createdDateTime: formData.createdDateTime || currentTime,
      updatedDateTime: currentTime
    };

    const payload = {
      ...submittedData,
      Documents: {
        Marks_10th: null,
        Marks_12th: null,
        UG_qualifications: null,
        PG_qualifications: null
      },
      BankDetails: {
        ...submittedData.BankDetails,
        passbook_checkImg: null
      }
    };

    const formDataToSend = new FormData();
    formDataToSend.append('payload', JSON.stringify(payload));
    formDataToSend.append('Documents.Marks_10th', formData.Documents.Marks_10th || '');
    formDataToSend.append('Documents.Marks_12th', formData.Documents.Marks_12th || '');
    formDataToSend.append('Documents.UG_qualifications', formData.Documents.UG_qualifications || '');
    formDataToSend.append('Documents.PG_qualifications', formData.Documents.PG_qualifications || '');
    formDataToSend.append('BankDetails.passbook_checkImg', formData.BankDetails.passbook_checkImg || '');

    console.log(`${entityLabel} details saved locally:`);

    setSuccessMessage(`${entityLabel} details were captured successfully.`);
    setErrors({});
    if (showLauncher) {
      setShowForm(false);
    } 
  
    setFormData(createInitialFormData(roleName));
  
  
    
    
    try {
        
        
      // Include Content-Type so backend's express.json() can parse the body.
      // Without this header `req.body` may be undefined which causes destructure errors.
      const response = await fetch(url, {
        method: "POST",
        headers:{
            Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      })
      const message = await handleApiResponse(response);
      console.log(message);
      
      alert(message)
      navigate(redirectPath)




    } catch (error) {
      console.log(error);

    }


    console.log('data', formData);
  };

  const renderFieldError = (fieldName) => {
    if (!errors[fieldName]) {
      return null;
    }

    return <p className="text-sm text-red-600 mt-2">{errors[fieldName]}</p>;
  };




    const [countryOptions,setCountryOptions] = useState(["India"]);
    const [stateOptions,setStateOptions] = useState([]);
    const [cityOptions,setcityOptions] = useState([]);
    const [allCitiesByState, setAllCitiesByState] = useState({});

  useEffect(()=>{
      async function cityAddress(){
    
      
      const response = await fetch(city_url,{
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
      const data = await response.json();
      const allstates = [];
      const allCities = [];
      const stateCityMap = {};

      // Build a map from state name to its city list.
      // This allows us to show only the cities for the selected state.
      data.forEach((country,index)=>{
        country.states.forEach((state,index)=>{
             
            allstates.push(state.name);
            const stateCities = state.cities.map((city)=>city.name);
            stateCityMap[state.name] = stateCities;
            allCities.push(...stateCities);
        })
      })
      setStateOptions(allstates);
      setAllCitiesByState(stateCityMap);
      setcityOptions(allCities);
      
}
  cityAddress();

 
  },[])

  



  return (
   

    <div className="space-y-6">
      {showLauncher && (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleShowForm}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transform text-sm sm:text-base"
          >
            {`Add ${entityLabel}`}
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {showLauncher && !showForm && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Form Visibility</h3>
          </div>
          <div className="p-4 sm:p-6">
            <p className="text-gray-600 text-sm sm:text-base">
              The {entityLabelLower} form is hidden by default. Use the <span className="font-semibold text-gray-800">{`Add ${entityLabel}`}</span> button to open it.
            </p>
          </div>
        </div>
      )}

      <div
        className={`origin-top overflow-hidden transition-all duration-300 ease-out ${showForm
          ? 'max-h-5000px opacity-100 translate-y-0'
          : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
          }`}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Personal Information</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="FullName.firstName"

                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('FullName.firstName')}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="FullName.lastName"

                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('FullName.lastName')}
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"

                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('username')}
                </div>



                <div>
                  <label htmlFor="useremail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    id="useremail"
                    name="useremail"

                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('useremail')}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"

                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('password')}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="number"
                    id="mobile"
                    name="mobile"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('mobile')}
                </div>

                <div>
                  <label htmlFor="AlternateMobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Alternate Mobile Number
                  </label>
                  <input
                    type="number"
                    id="AlternateMobile"
                    name="AlternateMobile"

                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('AlternateMobile')}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"

                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {renderFieldError('gender')}
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department Name
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"

                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('department')}
                </div>

                <div>
                  <label htmlFor="DOB" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="DOB"
                    name="DOB"

                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('DOB')}
                </div>
              </div>
            </div>
          </div>








          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Address Details</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <div>
                  <label htmlFor="formData.address.country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    id="formData.address.CountryName"
                    name="address.CountryName"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ><option>Select Country</option>
                    {countryOptions.map((country,index) => (
                      <option key={index} value={country === 'Select Country' ? '' : country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {renderFieldError('formData.address.CountryName')}
                </div>


                
                <div>
                  <label htmlFor="formData.address.StateName" className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    id="formData.address.StateName"
                    name="address.StateName"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >  <option>Select State</option>
                    {stateOptions.map((state,index) => (
                      <option key={index} value={state === 'Select State' ? '' : state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {renderFieldError('formData.address.StateName')}
                </div>

                <div>
                  <label htmlFor="formData.address.CityName" className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    id="formData.address.CityName"
                    name="address.CityName"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                     <option>Select City</option>
                     
                    {cityOptions.map((city,index) => (
                      <option key={index} value={city === 'Select City' ? '' : city}>
                        {city}
                        
                      </option>
                    
                    ))}
                  </select>
                  {renderFieldError('formData.address.CityName')}
                </div>


                
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Education Documents</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="tenthDocument" className="block text-sm font-medium text-gray-700 mb-2">
                    10th Document
                  </label>
                  <input
                    type="file"
                    id="tenthDocument"
                    name="Documents.Marks_10th"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.Documents.Marks_10th && <p className="text-sm text-gray-500 mt-2">{formData.Documents.Marks_10th.name}</p>}
                  {renderFieldError('Documents.Marks_10th')}
                </div>

                <div>
                  <label htmlFor="twelfthDocument" className="block text-sm font-medium text-gray-700 mb-2">
                    12th Document
                  </label>
                  <input
                    type="file"
                    id="twelfthDocument"
                    name="Documents.Marks_12th"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.Documents.Marks_12th && <p className="text-sm text-gray-500 mt-2">{formData.Documents.Marks_12th.name}</p>}
                  {renderFieldError('Documents.Marks_12th')}
                </div>

                <div>
                  <label htmlFor="ugDocument" className="block text-sm font-medium text-gray-700 mb-2">
                    UG Document
                  </label>
                  <input
                    type="file"
                    id="ugDocument"
                    name="Documents.UG_qualifications"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.ugDocument && <p className="text-sm text-gray-500 mt-2">{formData.ugDocument.name}</p>}
                  {renderFieldError('ugDocument')}
                </div>

                <div>
                  <label htmlFor="pgDocument" className="block text-sm font-medium text-gray-700 mb-2">
                    PG Document
                  </label>
                  <input
                    type="file"
                    id="pgDocument"
                    name="Documents.PG_qualifications"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.pgDocument && <p className="text-sm text-gray-500 mt-2">{formData.pgDocument.name}</p>}
                  {renderFieldError('pgDocument')}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Bank Details</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="BankDetails.bankname"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('bankName')}
                </div>

                <div>
                  <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    id="ifscCode"
                    name="BankDetails.ifsccode"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('ifsccode')}
                </div>

                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    id="branch"
                    name="BankDetails.branchName"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('branchName')}
                </div>

                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="number"
                    id="accountNumber"
                    name="BankDetails.acccountno"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {renderFieldError('accountNumber')}
                </div>

                <div>
                  <label htmlFor="confirmAccountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Account Number
                  </label>
                  <input
                    type={showPass ? "text" : "password"}
                    id="confirmAccountNumber"
                    name="BankDetails.confirmAccountNumber"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      
                    }}>{showPass ? <EyeOff size={18}/> : <Eye size={18}/> }</button>
                  {renderFieldError('confirmAccountNumber')}
                </div>



     {/* const setShowPassword = () => {
  const [showPass, setShowPass] = useState(false);

} */}
                <div>
                  <label htmlFor="passbookImage" className="block text-sm font-medium text-gray-700 mb-2">
                    Passbook Image
                  </label>
                  <input
                    type="file"
                    id="passbookImage"
                    name="BankDetails.passbook_checkImg"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formData.BankDetails.passbook_checkImg && <p className="text-sm text-gray-500 mt-2">{formData.BankDetails.passbook_checkImg.name}</p>}
                  {renderFieldError('passbookImage')}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">Status Activity</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            

                   <div>
                  <label htmlFor="formData.status" className="block text-sm font-medium text-gray-700 mb-2">
                    User status
                  </label>
                  <select
                    id="formData.status"
                    name="status"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                     <option >
                         Select Status
                      </option>

                    <option >
                         Active
                      </option>
                      <option >
                         Inactive
                      </option>
                  </select>
                  {/* {renderFieldError('formData.address.CountryName')} */}
                </div>


                    <div>
                  <label htmlFor="formData.AccountStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <select
                    id="formData.AccountStatus"
                    name="AccountStatus"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option >
                         Select Account Status
                      </option>
                    <option >
                         Locked
                      </option>
                      <option >
                         Unlocked
                      </option>
                  </select>
                  {renderFieldError('formData.address.CountryName')}
                </div>

             

              </div>
            </div>
          </div>


          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              {submitLabel}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
