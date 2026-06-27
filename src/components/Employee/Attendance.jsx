import React, { useEffect, useState } from 'react';
import MainLayout from './MainLayout';
import BaseAPIcaller from '../../utils/BaseApicaller.js';

const api = BaseAPIcaller();
const url = api.geturl(api.MODULE.ATTENDENCE, api.OPERATIONS.GETDATA);

const normalizeStatus = (status) => {
  if (!status) {
    return 'Unknown';
  }

  const statusValue = String(status).trim().toUpperCase();

  if (statusValue === 'P') {
    return 'Present';
  }

  if (statusValue === 'A') {
    return 'Absent';
  }

  if (statusValue === 'HD' || statusValue === 'HALF DAY') {
    return 'Half Day';
  }

  return String(status);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Present':
      return 'text-green-600 bg-green-100';
    case 'Absent':
      return 'text-red-600 bg-red-100';
    case 'Half Day':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  const presentDays = attendanceData.filter((item) => item.status === 'Present').length;
  const absentDays = attendanceData.filter((item) => item.status === 'Absent').length;
  const halfDayCount = attendanceData.filter((item) => item.status === 'Half Day').length;

  const getAttendanceStatus = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const result = await response.json();
      const records = Array.isArray(result?.attendence) ? result.attendence : [];

      const formattedRecords = records.map((record) => ({
        id: record?._id || `${record?.AttendedAt}-${record?.AttendenceStatus}`,
        date: record?.AttendedAt,
        time: record?.AttendedAt,
        status: normalizeStatus(record?.AttendenceStatus),
      }));

      setAttendanceData(formattedRecords);
    } catch (error) {
      setAttendanceData([]);
    }
  };

  useEffect(() => {
    getAttendanceStatus();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Attendance</h2>
          <p className="text-gray-600 text-sm sm:text-base">Track your daily attendance and work hours</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Present Days</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{presentDays}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0 ml-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Absent Days</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1 sm:mt-2">{absentDays}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0 ml-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Half Day</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1 sm:mt-2">{halfDayCount}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center shrink-0 ml-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Recent Attendance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-4 sm:px-6 py-6 text-sm text-center text-gray-500">
                      No attendance records available.
                    </td>
                  </tr>
                ) : (
                  attendanceData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(record.time)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Attendance;
