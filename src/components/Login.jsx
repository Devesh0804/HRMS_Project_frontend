import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from './Input';
import hrmsBackground from '../assets/hrmsBackground.png';
import BaseAPIcaller from '../utils/BaseApicaller.js';
import { jwtDecode } from 'jwt-decode';
import { setAuthSession } from '../utils/authSession';

const api = BaseAPIcaller();
const url = api.geturl(api.MODULE.AUTHENTICATION, api.OPERATIONS.LOGIN)



const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    useremail: '',
    password: ''
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
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
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
    console.log('Login form data:', formData);

    async function AuthUser() {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            useremail: formData.useremail,
            password: formData.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          setServerError(data.message || 'Unable to login. Please check credentials.');
          return;
        }

        if (data.token) {
          const decoded = jwtDecode(data.token);
          const savedRole = (decoded.role || '').toLowerCase();
          setAuthSession(savedRole === 'superadmin' ? 'superadmin' : 'employee', data.token);
          localStorage.setItem('userName', decoded.name || '');

          if (decoded.condition) {
            navigate('/register');
            return;
          }

          if (savedRole === 'superadmin') {
            navigate('/dashboard');
            return;
          }

          navigate('/employee/dashboard');
          return;
        }

        setServerError('Login failed: invalid response from server.');
      } catch (error) {
        setServerError(error.message || 'Login request failed.');
      }
    }

    AuthUser();
    // Check if it's superadmin and first time
    // if (formData.useremail === 'superadmin@gmail.com') {
    //   const isRegistered = localStorage.getItem('superadminRegistered');
    //   if (!isRegistered) {
    //     // First time superadmin login, redirect to registration
    //     navigate('/register');
    //     return;
    //   }
    //   // Registered, go to superadmin dashboard
    //   localStorage.setItem('isLoggedIn', 'true');
    //   localStorage.setItem('userRole', 'superadmin');
    //   navigate('/dashboard');
    // } else {
    //   // Regular user, go to employee dashboard
    //   localStorage.setItem('isLoggedIn', 'true');
    //   localStorage.setItem('userRole', 'employee');
    //   navigate('/employee/dashboard');
    // }
    // TODO: Replace this with backend authentication and token handling
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
            Login
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-indigo-700 drop-shadow">
            Sign in to your HRMS account
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
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon="🔒"
            />
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-700 transition">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-lg"
              >
                Sign In
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
};


export default Login;