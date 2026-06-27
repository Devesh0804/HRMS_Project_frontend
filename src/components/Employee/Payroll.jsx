import React, { useState } from 'react';
import MainLayout from './MainLayout';

const Payroll = () => {
  // Dummy payroll data
  const [payrollData] = useState([
    { month: 'January 2024', salary: 5000, status: 'Paid', paidDate: '2024-01-31' },
    { month: 'December 2023', salary: 5000, status: 'Paid', paidDate: '2023-12-31' },
    { month: 'November 2023', salary: 5000, status: 'Paid', paidDate: '2023-11-30' },
    { month: 'October 2023', salary: 4800, status: 'Paid', paidDate: '2023-10-31' },
    { month: 'September 2023', salary: 4800, status: 'Paid', paidDate: '2023-09-30' },
    { month: 'February 2024', salary: 5000, status: 'Unpaid', paidDate: '-' }
  ]);

  const salaryBreakdown = {
    basic: 3500,
    hra: 1000,
    conveyance: 200,
    lta: 300,
    deductions: 500,
    netSalary: 4500
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'text-green-600 bg-green-100';
      case 'Unpaid':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Payroll</h2>
          <p className="text-gray-600 text-sm sm:text-base">View your salary details and payment history</p>
        </div>

        {/* Salary Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Basic Salary</p>
                <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-1 sm:mt-2">Rs{salaryBreakdown.basic}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 ml-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">HRA</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">Rs{salaryBreakdown.hra}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0 ml-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Deductions</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1 sm:mt-2">Rs{salaryBreakdown.deductions}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0 ml-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition sm:col-span-2 lg:col-span-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs sm:text-sm font-semibold">Net Salary</p>
                <p className="text-3xl sm:text-4xl font-bold text-blue-600 mt-1 sm:mt-2">Rs{salaryBreakdown.netSalary}</p>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0 ml-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Details */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Salary Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Basic Salary</span>
              <span className="font-semibold">Rs{salaryBreakdown.basic}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">House Rent Allowance (HRA)</span>
              <span className="font-semibold">Rs{salaryBreakdown.hra}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Conveyance Allowance</span>
              <span className="font-semibold">Rs{salaryBreakdown.conveyance}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">Leave Travel Allowance (LTA)</span>
              <span className="font-semibold">Rs{salaryBreakdown.lta}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
              <span className="text-gray-700 font-semibold">Gross Salary</span>
              <span className="font-bold">Rs{salaryBreakdown.basic + salaryBreakdown.hra + salaryBreakdown.conveyance + salaryBreakdown.lta}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-red-600">Deductions (Tax, Insurance, etc.)</span>
              <span className="font-semibold text-red-600">-Rs{salaryBreakdown.deductions}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-gray-50 px-3 rounded">
              <span className="text-lg font-bold text-gray-800">Net Salary</span>
              <span className="text-lg font-bold text-blue-600">Rs{salaryBreakdown.netSalary}</span>
            </div>
          </div>
        </div>

        {/* Payroll History Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Payment History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollData.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.month}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs{record.salary}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.paidDate !== '-' ? new Date(record.paidDate).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Payroll;