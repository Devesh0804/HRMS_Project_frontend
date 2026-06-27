import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import PageHeader from '../../../components/hrms/PageHeader';
import FormInput from '../../../components/hrms/FormInput';
import FormSelect from '../../../components/hrms/FormSelect';
import FormTextarea from '../../../components/hrms/FormTextarea';
import InfoCard from '../../../components/hrms/InfoCard';
import FormActions from '../../../components/hrms/FormActions';
import BaseAPIcaller from '../../../utils/BaseApicaller.js';
import handleApiResponse from '../../../utils/BaseApiResponse.js';


const api = BaseAPIcaller();
const url = api.geturl(api.MODULE.DEPARTMENT,api.OPERATIONS.SAVE)




const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

const parentDepartmentOptions = [
  { value: '', label: 'Select Parent Department' },
  { value: 'None', label: 'None (Top Level)' },
  { value: 'HR', label: 'HR' },
  { value: 'IT', label: 'IT' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
];

const departmentHeadOptions = [
  { value: '', label: 'Select Department Head' },
  { value: 'John Smith', label: 'John Smith' },
  { value: 'Sarah Johnson', label: 'Sarah Johnson' },
  { value: 'Michael Brown', label: 'Michael Brown' },
  { value: 'Emily Davis', label: 'Emily Davis' },
];

const createInitialFormData = () => ({
  deptName: '',
  deptCode: '',
  salary:{
   minSalary:"",
   maxSalary:""
  },
  createdBy:"",
  updatedBy:"",
  // parentDepartment: '',
  // employeeCapacity: '',
  // extensionNumber: '',
  // budgetAllocation: '',
  // description: '',
  status: 'Active',
});

function AddDepartment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => createInitialFormData());
  const [errors, setErrors] = useState({});
  const [departments , setDepartMents] = useState();

  useEffect(()=>{
// const url = api.geturl(api.MODULE.DEPARTMENT,api.OPERATIONS.SAVE)
try {
    
     async function getDepartMents(){
      const url = api.geturl(api.MODULE.DEPARTMENT,api.OPERATIONS.GETDATA)
       const token = localStorage.getItem('token');
       const response = await fetch(url,{
        method  : 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
       })

       const department = await response.json();
       const departmentSize = department.length
      //  console.log(departmentSize);
      await setDepartMents(departmentSize)
  
      
       
     }
     getDepartMents();
} catch (error) {
    console.log(error);
    
}
     
  },[])

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
      if(name.includes(".")){
          const [parent , child] = name.split(".")
          setFormData((prev)=>({
            ...prev,
                 [parent] : {
                  ...prev[parent],
                   [child] :value,
                 },
          }))
      }else{
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.deptName.trim()) newErrors.departmentName = 'Department name is required.';
    if (!formData.deptCode.trim()) newErrors.departmentCode = 'Department code is required.';
    // if (!formData.departmentHead) newErrors.departmentHead = 'Department head is required.';

    return newErrors;
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    const validationErrors = validateForm();
  console.log(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Department details saved locally:', formData);
    alert('Department saved successfully!');
    setFormData(createInitialFormData());
    setErrors({});
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url,{
        method : 'POST',
        headers :{
          'content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body : JSON.stringify(formData)
      })
      const message = await handleApiResponse(response);
      console.log(message);
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    setFormData(createInitialFormData());
    setErrors({});
  };

  const summaryItems = [
    { label: 'Total Departments', value: `${departments}` },
    { label: 'Active Departments', value: `${departments}` },
    { label: 'Open Positions', value: '12' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />
     
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <PageHeader
          title="Add Department"
          subtitle="Create department structure and assign managers."
          backLink="/dashboard"
          backLinkText="Back to Department Dashboard"
          moduleText="SuperAdmin Department Module"
        />

        <section className="space-y-6 lg:space-y-8">
          {/* Main Form Card */}
          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Department Setup</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage department details and hierarchy.
            </p>

            <form className="mt-6 space-y-6">
              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <FormInput
                  label="Department Name"
                  name="deptName"
                  // value={formData.deptName}
                  onChange={handleInputChange}
                  placeholder="Enter department name"
                  required
                  error={errors.departmentName}
                />
                <FormInput
                  label="Department Code"
                  name="deptCode"
                  // value={formData.deptCode}
                  onChange={handleInputChange}
                  placeholder="Enter department code"
                  required
                  error={errors.departmentCode}
                />
                {/* <FormSelect
                  label="Department Head"
                  name="departmentHead"
                  value={formData.departmentHead}
                  onChange={handleInputChange}
                  options={departmentHeadOptions}
                  required
                  error={errors.departmentHead}
                /> */}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
               <FormInput
                  label="Max Salary"
                  name="salary.maxSalary"
                  // value={formData.salary.maxSalary}
                  onChange={handleInputChange}
                  placeholder="Enter capacity"
                  type="number"
                />
                <FormInput
                  label="Min Salary"
                  name="salary.minSalary"
                  // value={formData.employeeCapacity}
                  onChange={handleInputChange}
                  placeholder="Enter capacity"
                  type="number"
                />
                {/* <FormInput
                  label="Extension Number"
                  name="extensionNumber"
                  value={formData.extensionNumber}
                  onChange={handleInputChange}
                  placeholder="Enter extension"
                /> */}
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {/* <FormInput
                  label="Budget Allocation"
                  name="budgetAllocation"
                  value={formData.budgetAllocation}
                  onChange={handleInputChange}
                  placeholder="Enter budget"
                  type="number"
                /> */}
                {/* <FormSelect
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={statusOptions}
                /> */}
              </div>

              {/* Row 4 */}
              {/* <div className="grid grid-cols-1 gap-4">
                <FormTextarea
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter department description"
                  rows={3}
                />
              </div> */}

              <FormActions
                submitLabel="Save Department"
                resetLabel="Reset"
                onSubmit={handleSubmit}
                onReset={handleReset}
              />
            </form>
          </div>

          {/* Summary Card */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-1">
            <InfoCard title="Department Overview" items={summaryItems} departmentsData = {departments}/>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AddDepartment;