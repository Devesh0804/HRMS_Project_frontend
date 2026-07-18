import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from './Input';
import BaseAPIcaller from '../utils/BaseApicaller.js';
import hrmsBackground from '../assets/hrmsBackground.png';
const Register = () => {
  const navigate = useNavigate();
  const api = BaseAPIcaller();
  const url = api.geturl(api.MODULE.AUTHENTICATION, api.OPERATIONS.REGISTER);
  const [formData, setFormData] = useState({
    FullName:{
      firstName :'',
      lastName:''
    },
    useremail: '',
    username: '',
    password: '',
    // confirmPassword: ''
    mobile:'',
    role:'Superadmin'
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.FullName.firstName.trim()) {
      newErrors.FullName.firstName = 'First Name is required';
    }
     if (!formData.FullName.lastName.trim()) {
      newErrors.FullName.lastName = 'Last Name is required';
    }
    if (!formData.useremail.trim()) {
      newErrors.useremail = 'Email is required';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    // if (!formData.confirmPassword.trim()) {
    //   newErrors.confirmPassword = 'Confirm Password is required';
    // } else if (formData.password !== formData.confirmPassword) {
    //   newErrors.confirmPassword = 'Passwords do not match';
    // }
       if (!formData.mobile.trim()) {
      newErrors.mobile = 'Contact no. is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    console.log(formData);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setServerError('');
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          FullName: formData.FullName,
          useremail: formData.useremail,
          username: formData.username,
          password: formData.password,
          mobile: formData.mobile,
          roleName: formData.role
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || 'Unable to register. Please check your details.');
        return;
      }

      // Registration successful, redirect to login.
      navigate('/login');
    } catch (error) {
      setServerError(error.message || 'Registration request failed.');
    } finally {
      setIsSubmitting(false);
    }

    // // For now, just log the data
    // console.log('Register form data:', formData);
    // // Set superadmin as registered
    // localStorage.setItem('superadminRegistered', 'true');
    // localStorage.setItem('isLoggedIn', 'true');
    // localStorage.setItem('userRole', 'superadmin');
    // navigate('/dashboard');
    // TODO: Integrate with backend API
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: `url(${hrmsBackground})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Subtle overlay for better form visibility */}
      <div className="absolute inset-0 bg-white bg-opacity-10"></div>
      
      {/* Content */}
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl sm:text-4xl font-extrabold text-indigo-900 drop-shadow-lg">
            SuperAdmin Registration
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-indigo-700 drop-shadow">
            Create your HRMS account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white bg-opacity-98 py-6 sm:py-8 px-4 sm:px-6 shadow-2xl rounded-xl sm:rounded-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <Input
              label="First Name"
              type="text"
              name="FullName.firstName"
              placeholder="Enter your First name"
              value={formData.FullName.firstName}
              onChange={handleChange}
              error={errors.FullName?.firstName}
              icon="👤"
            />
               <Input
              label="Last Name"
              type="text"
              name="FullName.lastName"
              placeholder="Enter your Last name"
              value={formData.FullName.lastName}
              onChange={handleChange}
              error={errors.FullName?.lastName}
              icon="👤"
            />
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
            <Input
              label="Username"
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              icon="👤"
            />
             <Input
              label="Mobile"
              type="number"
              name="mobile"
              placeholder="Enter contact no"
              value={formData.mobile}
              onChange={handleChange}
              error={errors.mobile}
              icon="📞"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon="🔒"
            />
             
            {/* <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon="🔒"
            /> */}

           
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-lg disabled:cursor-not-allowed disabled:bg-indigo-400"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>
            {serverError && (
              <div className="text-red-600 text-sm text-center mt-2">{serverError}</div>
            )}
            <div className="text-center">
              <p className="text-sm text-gray-700">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700 transition">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
