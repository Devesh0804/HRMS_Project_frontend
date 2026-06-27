import EmployeeActionPage from '../employee/EmployeeActionPage';

function AdminActionPage({ mode = 'view' }) {
  return (
    <EmployeeActionPage
      mode={mode}
      entityLabel="Admin"
      moduleLabel="SuperAdmin Admin Module"
      listPath="/superadmin/admin/view"
      editPathBase="/superadmin/admin/edit"
      stateKey="admin"
      defaultRoleName="Admin"
    />
  );
}

export default AdminActionPage;
