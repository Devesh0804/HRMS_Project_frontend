import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';
import { useNavigate } from 'react-router-dom';
import MainLayout from './MainLayout';

const getParsedQrData = (value) => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

const QrScanner = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const scannerControlsRef = useRef(null);
  const codeReaderRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [statusMessage, setStatusMessage] = useState('Camera is ready to scan a QR code.');
  const [errorMessage, setErrorMessage] = useState('');

  const parsedQrData = getParsedQrData(scanResult);

  const stopScanner = useCallback(() => {
    if (scannerControlsRef.current) {
      scannerControlsRef.current.stop();
      scannerControlsRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
  }, []);

  const startScanner = async () => {
    setErrorMessage('');
    setScanResult('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('Camera access is not available in this browser.');
      return;
    }

    try {
      stopScanner();
      const codeReader = new BrowserQRCodeReader();
      codeReaderRef.current = codeReader;

      setIsScanning(true);
      setStatusMessage('Point the camera at a QR code.');

      scannerControlsRef.current = await codeReader.decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: 'environment' },
          },
          audio: false,
        },
        videoRef.current,
        (result) => {
          if (!result) {
            return;
          }

          const qrText = result.getText();
          setScanResult(qrText);
          setStatusMessage('QR code scanned successfully.');
          setErrorMessage('');
          stopScanner();

          try {
            const scannedUrl = new URL(qrText, window.location.origin);

            if (scannedUrl.pathname === '/employee/attendance/verify') {
              navigate(`${scannedUrl.pathname}${scannedUrl.search}`);
            }
          } catch {
            // Normal QR text stays visible in the result panel.
          }
        }
      );
    } catch (error) {
      stopScanner();

      if (error?.name === 'NotAllowedError') {
        setErrorMessage('Camera permission was denied. Please allow camera access and try again.');
      } else if (error?.name === 'NotFoundError') {
        setErrorMessage('No camera was found on this device.');
      } else {
        setErrorMessage('Unable to open the camera. Please try again.');
      }
    }
  };

  const copyScanResult = async () => {
    if (!scanResult || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(scanResult);
    setStatusMessage('Scanned QR data copied.');
  };

  const openScannedQr = () => {
    if (!scanResult) {
      return;
    }

    try {
      const scannedUrl = new URL(scanResult, window.location.origin);

      if (scannedUrl.pathname === '/employee/attendance/verify') {
        navigate(`${scannedUrl.pathname}${scannedUrl.search}`);
        return;
      }

      setErrorMessage('This QR code is not an attendance verification QR.');
    } catch {
      setErrorMessage('This QR code data is not a valid attendance link.');
    }
  };

  useEffect(() => stopScanner, [stopScanner]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl">QR Scanner</h2>
            <p className="text-sm text-gray-600 sm:text-base">Open the camera and scan any QR code.</p>
          </div>

          <div className="flex gap-3">
            {isScanning ? (
              <button
                type="button"
                onClick={stopScanner}
                className="rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Stop Camera
              </button>
            ) : (
              <button
                type="button"
                onClick={startScanner}
                className="rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Open Camera
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <section className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
              <h3 className="text-lg font-bold text-gray-800">Camera Preview</h3>
            </div>

            <div className="bg-gray-950 p-3 sm:p-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm font-medium text-gray-300">
                    Press Open Camera to start scanning.
                  </div>
                )}
                {isScanning && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-44 w-44 rounded-xl border-4 border-white/90 shadow-[0_0_0_999px_rgba(0,0,0,0.28)] sm:h-56 sm:w-56" />
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-4 sm:px-6">
              {errorMessage ? (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{errorMessage}</p>
              ) : (
                <p className="rounded-lg bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">{statusMessage}</p>
              )}
            </div>
          </section>

          <section className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
            <h3 className="text-lg font-bold text-gray-800">Scanned Result</h3>

            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">QR Data</p>
              <p className="mt-2 min-h-16 break-all text-sm font-semibold text-gray-800">
                {scanResult || 'No QR code scanned yet.'}
              </p>
            </div>

            {parsedQrData && (
              <div className="mt-4 space-y-3">
                {Object.entries(parsedQrData).map(([key, value]) => (
                  <div key={key} className="rounded-lg border border-gray-200 p-3">
                    <p className="text-xs font-semibold uppercase text-gray-500">{key}</p>
                    <p className="mt-1 break-all text-sm font-semibold text-gray-800">{String(value)}</p>
                  </div>
                ))}
              </div>
            )}

            {scanResult && !parsedQrData && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-semibold uppercase text-emerald-700">Attendance QR</p>
                <p className="mt-2 text-sm font-semibold text-emerald-900">
                  Open this scanned link to verify attendance and location.
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openScannedQr}
                disabled={!scanResult}
                className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Verify Attendance
              </button>
              <button
                type="button"
                onClick={() => {
                  setScanResult('');
                  setStatusMessage('Camera is ready to scan a QR code.');
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Clear Result
              </button>
              <button
                type="button"
                onClick={copyScanResult}
                disabled={!scanResult}
                className="rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Copy Result
              </button>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default QrScanner;
