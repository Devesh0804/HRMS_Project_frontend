import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SuperAdminNavbar from '../../../components/SuperAdminNavbar';

const STATIC_ATTENDANCE_DAYS = [
  { label: '1/4/2026', type: 'working' },
  { label: '2/4/2026', type: 'working' },
  { label: '3/4/2026', type: 'working' },
  { label: '4/4/2026', type: 'holiday', note: 'Holiday' },
  { label: '5/4/2026', type: 'off', note: 'Off Day' },
  { label: '6/4/2026', type: 'working' },
  { label: '7/4/2026', type: 'working' },
];

const WORKING_DAY_STATUS_CYCLE = ['', 'P', 'A', 'L', 'HD'];

const statusLabelMap = {
  '': '-',
  P: 'P',
  A: 'A',
  L: 'L',
  HD: 'HD',
  H: 'H',
  WO: 'WO',
};

const getAttendanceDays = () => {
  // Keep static for now. Later replace with generated month calendar + holiday/off-day API data.
  return STATIC_ATTENDANCE_DAYS;
};

const buildDefaultAttendance = (attendanceDays) =>
  attendanceDays.reduce((acc, day) => {
    if (day.type === 'holiday') {
      acc[day.label] = 'H';
    } else if (day.type === 'off') {
      acc[day.label] = 'WO';
    } else {
      acc[day.label] = '';
    }
    return acc;
  }, {});

const buildEmployeeAttendance = (attendanceDays, overrides = {}) => ({
  ...buildDefaultAttendance(attendanceDays),
  ...overrides,
});

const getInitialRows = (attendanceDays) => [
  {
    id: 1,
    name: 'raj',
    department: 'Engineering',
    role: 'Frontend Developer',
    attendance: buildEmployeeAttendance(attendanceDays, {
      '1/4/2026': 'P',
      '2/4/2026': 'A',
      '3/4/2026': 'P',
      '6/4/2026': 'P',
      '7/4/2026': 'L',
    }),
  },
  {
    id: 2,
    name: 'Aarav Sharma',
    department: 'Engineering',
    role: 'Backend Developer',
    attendance: buildEmployeeAttendance(attendanceDays, {
      '1/4/2026': 'P',
      '2/4/2026': 'P',
      '3/4/2026': 'P',
      '6/4/2026': 'P',
      '7/4/2026': 'P',
    }),
  },
  {
    id: 3,
    name: 'Priya Verma',
    department: 'Human Resources',
    role: 'HR Executive',
    attendance: buildEmployeeAttendance(attendanceDays, {
      '1/4/2026': 'L',
      '2/4/2026': 'P',
      '3/4/2026': 'A',
      '6/4/2026': 'P',
      '7/4/2026': 'HD',
    }),
  },
  {
    id: 4,
    name: 'Karan Nair',
    department: 'Design',
    role: 'Product Designer',
    attendance: buildEmployeeAttendance(attendanceDays, {
      '1/4/2026': 'P',
      '2/4/2026': 'HD',
      '3/4/2026': 'P',
      '6/4/2026': 'A',
      '7/4/2026': 'P',
    }),
  },
  {
    id: 5,
    name: 'Sneha Kapoor',
    department: 'Operations',
    role: 'Operations Manager',
    attendance: buildEmployeeAttendance(attendanceDays, {
      '1/4/2026': 'P',
      '2/4/2026': 'P',
      '3/4/2026': 'L',
      '6/4/2026': 'P',
      '7/4/2026': 'A',
    }),
  },
];

const getStatusClasses = (status) => {
  if (status === 'P') return 'bg-emerald-100 text-emerald-700';
  if (status === 'A') return 'bg-red-100 text-red-700';
  if (status === 'L') return 'bg-amber-100 text-amber-700';
  if (status === 'HD') return 'bg-orange-100 text-orange-700';
  if (status === 'H') return 'bg-indigo-100 text-indigo-700';
  if (status === 'WO') return 'bg-slate-200 text-slate-700';
  return 'bg-slate-100 text-slate-500';
};

const getDayHeaderClasses = (dayType) => {
  if (dayType === 'holiday') return 'bg-indigo-50 text-indigo-700';
  if (dayType === 'off') return 'bg-slate-100 text-slate-600';
  return 'bg-slate-50 text-slate-600';
};

const SuperAdminAttendance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const attendanceDays = useMemo(() => getAttendanceDays(), []);
  const workingDays = useMemo(
    () => attendanceDays.filter((day) => day.type === 'working').map((day) => day.label),
    [attendanceDays]
  );
  const [rows, setRows] = useState(() => getInitialRows(attendanceDays));
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [analysisFilter, setAnalysisFilter] = useState('all');
  const [bulkDate, setBulkDate] = useState(
    workingDays.length > 0 ? workingDays[0] : attendanceDays[0]?.label || ''
  );
  const [bulkStatus, setBulkStatus] = useState('P');

  const isManageMode = location.pathname === '/attendance/manage';

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

  const getEmployeeSummary = (employeeAttendance) => {
    const summary = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      attendanceRate: 0,
    };

    workingDays.forEach((dayLabel) => {
      const status = employeeAttendance[dayLabel];
      if (status === 'P') summary.present += 1;
      if (status === 'A') summary.absent += 1;
      if (status === 'L') summary.late += 1;
      if (status === 'HD') summary.halfDay += 1;
    });

    const paidDays = summary.present + summary.late + summary.halfDay * 0.5;
    summary.attendanceRate = workingDays.length
      ? Math.round((paidDays / workingDays.length) * 100)
      : 0;

    return summary;
  };

  const rowsWithSummary = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        summary: getEmployeeSummary(row.attendance),
      })),
    [rows, workingDays]
  );

  const departments = useMemo(
    () => ['All', ...new Set(rows.map((row) => row.department))],
    [rows]
  );

  const filteredRows = useMemo(() => {
    return rowsWithSummary.filter((row) => {
      const matchesSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        departmentFilter === 'All' || row.department === departmentFilter;

      if (!matchesSearch || !matchesDepartment) {
        return false;
      }

      if (analysisFilter === 'all') {
        return true;
      }

      if (analysisFilter === 'low') {
        return row.summary.attendanceRate < 75;
      }

      if (analysisFilter === 'absent') {
        return row.summary.absent > 0;
      }

      return row.summary.late > 0;
    });
  }, [analysisFilter, departmentFilter, rowsWithSummary, searchTerm]);

  const dashboardSummary = useMemo(() => {
    const totalEmployees = rowsWithSummary.length;
    if (!totalEmployees) {
      return {
        totalEmployees: 0,
        averageAttendance: 0,
        employeesWithAbsence: 0,
        totalLateMarks: 0,
      };
    }

    const totals = rowsWithSummary.reduce(
      (acc, row) => {
        acc.totalAttendanceRate += row.summary.attendanceRate;
        if (row.summary.absent > 0) {
          acc.employeesWithAbsence += 1;
        }
        acc.totalLateMarks += row.summary.late;
        return acc;
      },
      { totalAttendanceRate: 0, employeesWithAbsence: 0, totalLateMarks: 0 }
    );

    return {
      totalEmployees,
      averageAttendance: Math.round(totals.totalAttendanceRate / totalEmployees),
      employeesWithAbsence: totals.employeesWithAbsence,
      totalLateMarks: totals.totalLateMarks,
    };
  }, [rowsWithSummary]);

  const getNextStatus = (currentStatus) => {
    const currentIndex = WORKING_DAY_STATUS_CYCLE.indexOf(currentStatus);
    const nextIndex =
      currentIndex >= 0
        ? (currentIndex + 1) % WORKING_DAY_STATUS_CYCLE.length
        : 0;
    return WORKING_DAY_STATUS_CYCLE[nextIndex];
  };

  const handleStatusCycle = (employeeId, dayLabel) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id !== employeeId) {
          return row;
        }

        return {
          ...row,
          attendance: {
            ...row.attendance,
            [dayLabel]: getNextStatus(row.attendance[dayLabel]),
          },
        };
      })
    );
  };

  const handleBulkApply = () => {
    if (!bulkDate) {
      return;
    }

    const targetIds = new Set(filteredRows.map((row) => row.id));

    setRows((prevRows) =>
      prevRows.map((row) => {
        if (!targetIds.has(row.id)) {
          return row;
        }

        return {
          ...row,
          attendance: {
            ...row.attendance,
            [bulkDate]: bulkStatus,
          },
        };
      })
    );
  };

  const handleResetEmployee = (employeeId) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id !== employeeId) {
          return row;
        }

        const nextAttendance = { ...row.attendance };
        workingDays.forEach((dayLabel) => {
          nextAttendance[dayLabel] = '';
        });

        return {
          ...row,
          attendance: nextAttendance,
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SuperAdminNavbar onLogout={handleLogout} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-semibold">SuperAdmin Attendance Module</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                Monthly Attendance Management
              </h1>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-600">
                Analyze presence trends and manage attendance marks for your organization.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* <Link
                to="/attendance/view"
                className={`inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition ${
                  !isManageMode
                    ? 'bg-indigo-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                View Mode
              </Link> */}
              {/* <Link
                to="/attendance/manage"
                className={`inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isManageMode
                    ? 'bg-indigo-600 text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                Manage Mode
              </Link> */}
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back to Main Dashboard
              </Link>
            </div>
          </div>
        </header>

        <section className="space-y-6 lg:space-y-8">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
              <p className="text-xs sm:text-sm text-slate-500">Total Employees</p>
              <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">
                {dashboardSummary.totalEmployees}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">Current month workforce</p>
            </div>

            <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
              <p className="text-xs sm:text-sm text-slate-500">Average Attendance</p>
              <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">
                {dashboardSummary.averageAttendance}%
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">Paid attendance ratio</p>
            </div>

            <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
              <p className="text-xs sm:text-sm text-slate-500">Employees With Absence</p>
              <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">
                {dashboardSummary.employeesWithAbsence}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">Need follow-up this month</p>
            </div>

            <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
              <p className="text-xs sm:text-sm text-slate-500">Late Marks</p>
              <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">
                {dashboardSummary.totalLateMarks}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">Across all employees</p>
            </div>
          </div>

          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Search Employee
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Department
                </label>
                <select
                  value={departmentFilter}
                  onChange={(event) => setDepartmentFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                >
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Analysis Focus
                </label>
                <select
                  value={analysisFilter}
                  onChange={(event) => setAnalysisFilter(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="all">All Employees</option>
                  <option value="low">Attendance Under 75%</option>
                  <option value="absent">Has Absent Mark</option>
                  <option value="late">Has Late Mark</option>
                </select>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Legend</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['P', 'A', 'L', 'HD', 'H', 'WO'].map((status) => (
                    <span
                      key={status}
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(status)}`}
                    >
                      {status}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isManageMode && (
            <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Bulk Update</h2>
              <p className="mt-1 text-sm text-slate-500">
                Apply a status to all currently filtered employees for one date.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                    Attendance Date
                  </label>
                  <select
                    value={bulkDate}
                    onChange={(event) => setBulkDate(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    {workingDays.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                    Mark As
                  </label>
                  <select
                    value={bulkStatus}
                    onChange={(event) => setBulkStatus(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="P">Present</option>
                    <option value="A">Absent</option>
                    <option value="L">Late</option>
                    <option value="HD">Half Day</option>
                    <option value="">Clear</option>
                  </select>
                </div>

                <div className="sm:col-span-2 xl:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={handleBulkApply}
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    Apply to Filtered Employees
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Attendance Table
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Month view table with static date headers. Dynamic date generation can replace this dataset later.
                </p>
              </div>
              <p className="text-sm font-medium text-slate-500">
                Showing {filteredRows.length} of {rows.length} employees
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="bg-slate-50 px-4 py-3 font-semibold text-slate-700 sticky left-0 z-20">
                      Name
                    </th>
                    {attendanceDays.map((day) => (
                      <th
                        key={day.label}
                        className={`px-3 py-3 text-center font-semibold whitespace-nowrap ${getDayHeaderClasses(
                          day.type
                        )}`}
                      >
                        <span>{day.label}</span>
                        {day.note ? (
                          <span className="mt-1 block text-[11px] font-medium text-slate-500">
                            {day.note}
                          </span>
                        ) : null}
                      </th>
                    ))}
                    <th className="bg-slate-50 px-3 py-3 text-center font-semibold text-slate-700">P</th>
                    <th className="bg-slate-50 px-3 py-3 text-center font-semibold text-slate-700">A</th>
                    <th className="bg-slate-50 px-3 py-3 text-center font-semibold text-slate-700">L</th>
                    <th className="bg-slate-50 px-3 py-3 text-center font-semibold text-slate-700">Rate</th>
                    {isManageMode ? (
                      <th className="bg-slate-50 px-3 py-3 text-center font-semibold text-slate-700">
                        Action
                      </th>
                    ) : null}
                  </tr>
                </thead>

                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100">
                      <td className="bg-white sticky left-0 z-10 px-4 py-4 align-top">
                        <p className="font-semibold text-slate-900">{row.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {row.department} . {row.role}
                        </p>
                      </td>

                      {attendanceDays.map((day) => {
                        const currentStatus = row.attendance[day.label];
                        const isWorkingDay = day.type === 'working';
                        const canEdit = isManageMode && isWorkingDay;

                        return (
                          <td key={`${row.id}-${day.label}`} className="px-3 py-4 text-center">
                            <button
                              type="button"
                              disabled={!canEdit}
                              onClick={() => handleStatusCycle(row.id, day.label)}
                              className={`inline-flex min-w-40px items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition ${getStatusClasses(
                                currentStatus
                              )} ${
                                canEdit
                                  ? 'cursor-pointer hover:brightness-95'
                                  : 'cursor-default'
                              }`}
                            >
                              {statusLabelMap[currentStatus]}
                            </button>
                          </td>
                        );
                      })}

                      <td className="px-3 py-4 text-center font-medium text-slate-700">
                        {row.summary.present}
                      </td>
                      <td className="px-3 py-4 text-center font-medium text-slate-700">
                        {row.summary.absent}
                      </td>
                      <td className="px-3 py-4 text-center font-medium text-slate-700">
                        {row.summary.late}
                      </td>
                      <td className="px-3 py-4 text-center font-semibold text-slate-900">
                        {row.summary.attendanceRate}%
                      </td>
                      {isManageMode ? (
                        <td className="px-3 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleResetEmployee(row.id)}
                            className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                          >
                            Reset
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SuperAdminAttendance;
