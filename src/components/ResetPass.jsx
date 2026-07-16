import React from 'react'
import Input from './Input'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import BaseAPIcaller from '../utils/BaseApicaller';
import { ur } from '@faker-js/faker';






const api = BaseAPIcaller();
// const url = api.geturl(api.MODULE.AUTHENTICATION, api.OPERATIONS.RESET_PASS)






function ResetPass() {
      const {token} = useParams();
      const url = `https://hrms-project-backend-gijz.onrender.com/hrms/authentication/reset-password/${token}`


      const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirm_password:''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };



    const validateForm = () => {
    const newErrors = {};
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
     if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'confirm password is not same';
    }
    return newErrors;
  };

 
    
     const handleSubmit = (e) => {
         e.preventDefault();
         const validationErrors = validateForm();
         if (Object.keys(validationErrors).length > 0) {
           setErrors(validationErrors);
           return;
         }
         // For now, just log the data and temporarily allow dashboard access
        //  console.log('Login form data:', formData);
     
         async function Reset_pass() {
           try {
             const response = await fetch(url, {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                 password: formData.password
               })
             });
     
             const data = await response.json();
     
             if (!response.ok) {
               setServerError(data.message || 'Unable to update password');
               return;
             }
              alert(data.message)
              navigate('/')
    
           } catch (error) {
             setServerError(error.message || 'Login request failed.');
           }
         }
     
         Reset_pass();

        }






  return (
        <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"

    >
      {/* Subtle overlay for better form visibility */}
      <div className="absolute inset-0 bg-white bg-opacity-10"></div>

      {/* Content */}
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl sm:text-4xl font-extrabold text-indigo-900 drop-shadow-lg">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-indigo-700 drop-shadow">
            
            </p>
        </div>
    
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} >
          <div className="bg-white bg-opacity-98 py-6 sm:py-8 px-4 sm:px-6 shadow-2xs rounded-xl sm:rounded-2xl space-y-4">
         
            <Input
              label="Enter New Password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon="🔒"
            />

               <Input
              label="Confirm-Password"
              type="password"
              name="confirm_password"
              placeholder="Enter password"
              value={formData.confirm_password}
              onChange={handleChange}
              error={errors.confirm_password}
              icon="🔒"
            />
            <div className="flex items-center justify-between">
              <div className="text-sm">
               
                {/* <Link className="font-medium text-indigo-600 hover:text-indigo-700 transition" to="/forgot_pass"> Forgot your password?</Link> */}
            
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-lg"
              >
                Next
              </button>
            </div>
            {/* {serverError && (
              <div className="text-red-600 text-sm text-center mt-2">{serverError}</div>
            )} */}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPass