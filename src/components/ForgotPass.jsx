import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from './Input';
import hrmsBackground from '../assets/hrmsBackground.png';
import BaseAPIcaller from '../utils/BaseApicaller.js';
import { setAuthSession } from '../utils/authSession';

const api = BaseAPIcaller();
const url = api.geturl(api.MODULE.AUTHENTICATION, api.OPERATIONS.FORGOT_PASS)



const ForgotPass = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    useremail: ''
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
    if (!formData.useremail.trim()) {
      newErrors.useremail = 'Email is required';
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
  
    

    async function Forgot_Pass() {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            useremail: formData.useremail,
          
          })
        });

        const data = await response.json();
        alert(data.message)
        navigate('/')
          
        if (!response.ok) {
          setServerError(data.message || 'Check email');
          return;
        }
      } catch (error) {
        setServerError(error.message || 'forgot password request failed.');
      }
    }
  Forgot_Pass();
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
            Forgot Pass?
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-indigo-700 drop-shadow">
            Enter your e-mail 
            </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white bg-opacity-98 py-6 sm:py-8 px-4 sm:px-6 shadow-2xs rounded-xl sm:rounded-2xl space-y-4">
            <Input
              label="Email"
              type="email"
              name="useremail"
              placeholder="Enter your email"
              value={formData.useremail}
              onChange={handleChange}
              error={errors.useremail}
              icon="📧"
            />
            {/* <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon="🔒"
            /> */}
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
            {serverError && (
              <div className="text-red-600 text-sm text-center mt-2">{serverError}</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
;
}

export default ForgotPass