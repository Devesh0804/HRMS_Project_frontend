import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import EmployeeDashboard from './components/Employee/EmployeeDashboard';
import Attendance from './components/Employee/Attendance';
import Profile from './components/Employee/Profile';
import Leave from './components/Employee/Leave';
import Payroll from './components/Employee/Payroll';
import QrScanner from './components/Employee/QrScanner';
import EmployeeAttendanceVerifyPage from './pages/employee/attendance/EmployeeAttendanceVerifyPage';  
import RecruitmentDashboard from './pages/superadmin/recruitment/RecruitmentDashboard';
import AddAdmin from './components/AddAdmin';
import AddEmployee from './components/AddEmployee';
import SuperAdminAttendance from './pages/superadmin/attendance/SuperAdminAttendance';
import AddClient from './pages/superadmin/client/AddClient';
import ViewClientPage from './pages/superadmin/client/ViewClientPage';
import ClientActionPage from './pages/superadmin/client/ClientActionPage';
import AddRole from './pages/superadmin/role/AddRole';
import AddDepartment from './pages/superadmin/department/AddDepartment';
import AddProject from './pages/superadmin/project/AddProject';
import ViewProjectPage from './pages/superadmin/project/ViewProjectPage';
import ProjectActionPage from './pages/superadmin/project/ProjectActionPage';
import EditProfile from './pages/superadmin/profile/EditProfile';
import ViewEmployeePage from './pages/superadmin/employee/ViewEmployeePage';
import ManageEmployeePage from './pages/superadmin/employee/ManageEmployeePage';
import EmployeeActionPage from './pages/superadmin/employee/EmployeeActionPage';
import ViewDepartmentPage from './pages/superadmin/department/ViewDepartmentPage';
import DepartmentActionPage from './pages/superadmin/department/DepartmentActionPage';
import Gate1Page from './pages/superadmin/gate/Gate1Page';
import Gate2Page from './pages/superadmin/gate/Gate2Page';
import Gate3Page from './pages/superadmin/gate/Gate3Page';
import ViewAdminPage from './pages/superadmin/admin/ViewAdminPage';
import AdminActionPage from './pages/superadmin/admin/AdminActionPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Single Login Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/superadmin/recruitment" element={<RecruitmentDashboard />} />
        <Route path="/superadmin/admin/add" element={<AddAdmin />} />
        <Route path="/superadmin/admin/view" element={<ViewAdminPage />} />
        <Route path="/superadmin/admin/view/:id" element={<AdminActionPage />} />
        <Route path="/superadmin/admin/edit/:id" element={<AdminActionPage mode="edit" />} />
        <Route path="/superadmin/employee/add" element={<AddEmployee />} />
        <Route path="/superadmin/employee/view" element={<ViewEmployeePage />} />
        <Route path="/superadmin/employee/view/:id" element={<EmployeeActionPage/>} />
        <Route path="/superadmin/employee/edit/:id" element={<EmployeeActionPage mode="edit" />} />
        <Route path="/superadmin/employee/manage" element={<ManageEmployeePage />} />
        <Route path="/attendance/view" element={<SuperAdminAttendance />} />
        
        {/* New SuperAdmin Routes */}
        <Route path="/superadmin/client/add" element={<AddClient />} />
        <Route path="/superadmin/client/view" element={<ViewClientPage />} />
        <Route path="/superadmin/client/view/:id" element={<ClientActionPage />} />
        <Route path="/superadmin/client/edit/:id" element={<ClientActionPage mode="edit" />} />
        <Route path="/superadmin/role/add" element={<AddRole />} />
        <Route path="/superadmin/department/add" element={<AddDepartment />} />
        <Route path="/superadmin/department/view/:id" element={<DepartmentActionPage />} />
        <Route path="/superadmin/department/edit/:id" element={<DepartmentActionPage mode="edit" />} />
        <Route path="/superadmin/project/add" element={<AddProject />} />
        <Route path="/superadmin/project/view" element={<ViewProjectPage />} />
        <Route path="/superadmin/project/view/:id" element={<ProjectActionPage />} />
        <Route path="/superadmin/project/edit/:id" element={<ProjectActionPage mode="edit" />} />
        <Route path="/superadmin/profile/edit" element={<EditProfile />} />
        <Route path="/superadmin/role/view" element={<Navigate to="/superadmin/role/add" replace />} />
        <Route path="/superadmin/department/view" element={<ViewDepartmentPage />} />
        <Route path="/superadmin/profile/view" element={<Navigate to="/superadmin/profile/edit" replace />} />
        <Route path="/admin/view" element={<Navigate to="/superadmin/admin/view" replace />} />
        <Route path="/employee/view" element={<Navigate to="/superadmin/employee/view" replace />} />
        <Route path="/employee/add" element={<Navigate to="/superadmin/employee/add" replace />} />
        <Route path="/employee/manage" element={<Navigate to="/superadmin/employee/manage" replace />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/attendance" element={<Attendance />} />
        <Route path="/employee/attendance/verify" element={<EmployeeAttendanceVerifyPage />} />
        <Route path="/employee/profile" element={<Profile />} />
        <Route path="/employee/form" element={<Navigate to="/superadmin/employee/add" replace />} />
        <Route path="/employee/leave" element={<Leave />} />
        <Route path="/employee/payroll" element={<Payroll />} />
        <Route path="/employee/qr-scanner" element={<QrScanner />} />
        
        {/* Gate Routes */}
        <Route path="/superadmin/gate/gate1" element={<Gate1Page />} />
        <Route path="/superadmin/gate/gate2" element={<Gate2Page />} />
        <Route path="/superadmin/gate/gate3" element={<Gate3Page />} />

        {/* Default Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
