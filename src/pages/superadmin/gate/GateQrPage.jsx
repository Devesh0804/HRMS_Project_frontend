import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';
import BaseAPIcaller from '../../../utils/BaseApicaller.js';

const api = BaseAPIcaller();
const url = api.geturl(api.MODULE.GATE, api.OPERATIONS.GETDATA);








const backendUrl = 'http://localhost:4000';

function GateQrPage({ pageTitle, gateIndex }) {
  const navigate = useNavigate();
  const [gate, setGate] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (loggedIn !== 'true' || userRole !== 'superadmin') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    async function getQrUrl() {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setGate(data[gateIndex] || {});
        
        // setGate(data[gateIndex] || {});
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getQrUrl();
  }, [gateIndex]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const qrImageSrc = gate.qrImageUrl ? `${backendUrl}${gate.qrImageUrl.qrImageUrl}` : '';
  const parsedQrData = useMemo(() => {
    if (!gate.qrData) return null;

    if (typeof gate.qrData === 'string') {
      try {
        return JSON.parse(gate.qrData);
      } catch (error) {
        console.error('Failed to parse gate.qrData:', error, gate.qrData);
        return null;
      }
    }

    return gate.qrData;
  }, [gate.qrData]);

  const qrDataString = useMemo(() => {
    if (!gate.qrData) return '';
    return typeof gate.qrData === 'string' ? gate.qrData : JSON.stringify(gate.qrData);
  }, [gate.qrData]);

  const scanLink = useMemo(() => {
    if (!parsedQrData?.gateCode || !parsedQrData?.gateName) {
      return '#';
    }

    const params = new URLSearchParams({
      gateCode: parsedQrData.gateCode,
      gateName: parsedQrData.gateName,
    });
    return `/employee/attendance/verify?${params.toString()}`;
  }, [parsedQrData]);

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [qrImageSrc]);

  const copyQrData = async () => {
    if (!qrDataString || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(qrDataString);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />
       
      <div className="w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* <p>{attendenceurl+`${params.toString()}`}</p> */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-600">SuperAdmin Gate Module</p>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">{pageTitle}</h1>
              <p className="mt-1 text-sm text-slate-600 sm:mt-2 sm:text-base">
                View the gate QR code used for employee attendance scanning.
              </p>
            </div>

            <Link
              to="/dashboard"
              className="inline-flex w-fit items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Gate QR</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {loading ? 'Loading...' : gate.gateName || 'Gate not found'}
                </h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Active
              </span>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                {qrImageSrc && !imageError ? (
                  <img
                    className="h-56 w-56 rounded-lg bg-white object-contain p-2"
                    src={qrImageSrc}
                    alt={`${gate.gateName} QR Code`}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-56 w-56 items-center justify-center rounded-lg bg-white px-6 text-center text-sm text-slate-500">
                    {imageError ? 'QR image could not be loaded. Please check the backend server.' : 'No QR image'}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Gate Name</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{gate.gateName || 'N/A'}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Gate Code</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{gate.gateCode || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">QR Details</h2>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 border-b border-slate-200 sm:grid-cols-[180px_1fr]">
                <div className="bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Backend API</div>
                <div className="break-all px-4 py-3 text-sm text-slate-700">{url}</div>
              </div>
              <div className="grid grid-cols-1 border-b border-slate-200 sm:grid-cols-[180px_1fr]">
                <div className="bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Image URL</div>
                <div className="break-all px-4 py-3 text-sm text-slate-700">{qrImageSrc || 'N/A'}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
                <div className="bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">QR Data</div>
                <div className="break-all px-4 py-3 text-sm text-slate-700">
                  {qrDataString || 'N/A'}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a
                href={qrDataString || '#'}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  qrDataString
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'cursor-not-allowed bg-slate-200 text-slate-500'
                }`}
              >
                Open Scan Link
              </a>
              <button
                type="button"
                onClick={copyQrData}
                disabled={!qrDataString}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                Copy Link
              </button>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              The QR code contains the scan link above. Scanning it opens the employee attendance verification page with this gate already selected.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default GateQrPage;
