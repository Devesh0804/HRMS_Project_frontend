import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import BaseAPIcaller from '../../../utils/BaseApicaller.js';

const api = BaseAPIcaller();
const attendanceSaveUrl = api.geturl(api.MODULE.ATTENDENCE, api.OPERATIONS.SAVE);
console.log(attendanceSaveUrl);


const getEmployeeId = (token) => {
  if (!token) {
    return '';
  }

  try {
    const decoded = jwtDecode(token);
    return decoded?._id || '';
  } catch {
    return '';
  }
};

const getStatusStyle = (status) => {
  if (status === 'verified') {
    return {
      badge: 'bg-emerald-100 text-emerald-700',
      panel: 'border-emerald-200 bg-emerald-50',
      title: 'Attendance verified',
      message: 'Your QR and current location are verified.',
    };
  }

  if (status === 'failed') {
    return {
      badge: 'bg-red-100 text-red-700',
      panel: 'border-red-200 bg-red-50',
      title: 'Verification failed',
      message: 'Location is not verified for this gate.',
    };
  }

  if (status === 'auth_required') {
    return {
      badge: 'bg-amber-100 text-amber-700',
      panel: 'border-amber-200 bg-amber-50',
      title: 'Employee login required',
      message: 'This QR link is valid. Please login as an employee to mark attendance.',
    };
  }

  return {
    badge: 'bg-indigo-100 text-indigo-700',
    panel: 'border-indigo-200 bg-indigo-50',
    title: 'Verifying attendance',
    message: 'Please wait while we verify QR and location.',
  };
};

const EmployeeAttendanceVerifyPage = () => {
  const location = useLocation();
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('Reading scanned QR information.');
  const [currentLocation, setCurrentLocation] = useState(null);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const gateCode = query.get('gateCode') || '';
  const gateName = query.get('gateName') || '';
  const scannedAt = new Date();
  const statusStyle = getStatusStyle(status);

  useEffect(() => {
    const verifyAttendance = async () => {
      if (!gateCode || !gateName) {
        setStatus('failed');
        setMessage('This QR code is not valid for attendance verification.');
        return;
      }

      if (!navigator.geolocation) {
        setStatus('failed');
        setMessage('Location service is not available in this browser.');
        return;
      }

      const token = localStorage.getItem('token');
      const employeeId = getEmployeeId(token);

      if (!token || !employeeId) {
        setStatus('auth_required');
        setMessage('This QR was scanned successfully. Login as an employee, then open this link again to mark attendance.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationPayload = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setCurrentLocation(locationPayload);
          setMessage('Location received. Sending verification request.');

          try {
            const response = await fetch(attendanceSaveUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                location: locationPayload,
                formatted: new Date().toISOString(),
                _id: employeeId,
                gateCode,
                gateName,
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              setStatus('failed');
              setMessage(result?.message || 'Location is not verified.');
              return;
            }

            setStatus('verified');
            setMessage(result?.message || 'Location verified successfully.');
          } catch (error) {
            setStatus('failed');
            setMessage('Unable to verify attendance. Please try again.');
          }
        },
        () => {
          setStatus('failed');
          setMessage('Location permission is required to verify attendance.');
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        }
      );
    };

    verifyAttendance();
  }, [gateCode, gateName]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">QR Attendance</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-800 sm:text-3xl">Attendance Verification</h2>
            <p className="mt-2 text-sm text-gray-600 sm:text-base">
              This screen opens after scanning the gate QR code.
            </p>
          </div>

          <Link
            to="/employee/qr-scanner"
            className="inline-flex w-fit items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Scan Again
          </Link>
        </div>

        <section className={`rounded-lg border p-5 shadow-sm sm:p-6 ${statusStyle.panel}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase ${statusStyle.badge}`}>
                {status === 'checking' ? 'Checking' : status}
              </span>
              <h3 className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">{statusStyle.title}</h3>
              <p className="mt-2 text-sm font-medium text-gray-700">{message || statusStyle.message}</p>

              {status === 'auth_required' ? (
                <Link
                  to="/login"
                  className="mt-4 inline-flex w-fit items-center justify-center rounded-lg bg-amber-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
                >
                  Login as Employee
                </Link>
              ) : null}
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              {status === 'verified' ? (
                <svg className="h-10 w-10 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-10 w-10 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v11a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm12 7H3v8h14V9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-gray-500">Scanned Link</p>
          <p className="mt-2 break-all text-sm font-semibold text-gray-900">
            {`${window.location.origin}${location.pathname}${location.search}`}
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-500">Gate Name</p>
            <p className="mt-2 break-all text-base font-bold text-gray-900">{gateName || 'Not available'}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-500">Gate Code</p>
            <p className="mt-2 break-all text-base font-bold text-gray-900">{gateCode || 'Not available'}</p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-500">Scanned Time</p>
            <p className="mt-2 text-base font-bold text-gray-900">
              {scannedAt.toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-500">Current Location</p>
            <p className="mt-2 break-all text-base font-bold text-gray-900">
              {currentLocation
                ? `${currentLocation.latitude.toFixed(6)}, ${currentLocation.longitude.toFixed(6)}`
                : 'Waiting for location'}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployeeAttendanceVerifyPage;
